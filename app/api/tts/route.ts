import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, readFile, unlink } from 'fs/promises';
import path from 'path';
import { tmpdir } from 'os';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import dbConnect from '@/lib/mongodb';
import Country from '@/models/Country';

const execAsync = promisify(exec);

// Initialize Firebase Admin SDK (server-side)
if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
}

export async function POST(req: NextRequest) {
    const tempFile = path.join(tmpdir(), `tts-${Date.now()}.mp3`);

    try {
        const { text, voiceId, slug, audioKey } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        console.log(`TTS Request: "${text.substring(0, 50)}..."`);

        // Use Microsoft Edge TTS (completely free, no API key needed)
        // Voice: en-US-AriaNeural (female, high quality)
        const voice = voiceId || 'en-US-AriaNeural';

        // Escape text for command line (Windows PowerShell safe)
        const escapedText = text.replace(/"/g, '`"').replace(/'/g, "`'");

        // Generate audio using edge-tts (Python module)
        const command = `python -m edge_tts --voice "${voice}" --text "${escapedText}" --write-media "${tempFile}"`;

        console.log('Generating audio with edge-tts...');
        await execAsync(command, {
            maxBuffer: 10 * 1024 * 1024, // 10MB buffer
            timeout: 30000, // 30 second timeout
            shell: 'powershell.exe'
        });

        // Read the generated audio file
        const audioBuffer = await readFile(tempFile);

        console.log(`✅ TTS generated: ${audioBuffer.length} bytes`);

        let audioUrl: string | null = null;

        // If slug and audioKey are provided, upload to Firebase and save to MongoDB
        if (slug && audioKey) {
            try {
                console.log(`Uploading audio to Firebase Storage...`);

                const bucket = getStorage().bucket();
                const fileName = `search-audios/${slug}-${audioKey}.mp3`;
                const file = bucket.file(fileName);

                // Upload the audio buffer
                await file.save(audioBuffer, {
                    metadata: {
                        contentType: 'audio/mpeg',
                    },
                });

                // Make the file publicly accessible
                await file.makePublic();

                // Get the public URL
                audioUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                console.log(`✅ Audio uploaded: ${audioUrl}`);

                // Update MongoDB with the audio URL
                await dbConnect();
                const updateField = `audioUrls.${audioKey}`;
                await Country.findOneAndUpdate(
                    { slug },
                    { $set: { [updateField]: audioUrl } },
                    { new: true }
                );
                console.log(`✅ MongoDB updated for ${slug}`);

            } catch (uploadError: any) {
                console.error('Upload/DB error:', uploadError);
                // Continue anyway - we still have the audio to return
            }
        }

        // Clean up temp file
        await unlink(tempFile).catch(() => { });

        // Return audio with optional URL
        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.length.toString(),
                'X-Audio-Url': audioUrl || '', // Include the storage URL in header
            },
        });

    } catch (error: any) {
        // Clean up temp file on error
        await unlink(tempFile).catch(() => { });

        console.error('TTS Error Detail:', error);
        const message = error.message || error.stderr || "Unknown error";
        return NextResponse.json({
            error: `TTS generation failed: ${message}`
        }, { status: 500 });
    }
}

