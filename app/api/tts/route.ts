import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsClient } from 'elevenlabs';

const apiKey = process.env.ELEVENLABS_API_KEY;
console.log('TTS Debug: API Key present:', !!apiKey, 'Length:', apiKey?.length);

const elevenlabs = new ElevenLabsClient({
    apiKey: apiKey
});

export async function POST(req: NextRequest) {
    try {
        const { text, voiceId } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        // Default voice: "Adam" (premade stable voice) or a similar standard one
        // Using a specific ID if known, otherwise default.
        // Rachel: 21m00Tcm4TlvDq8ikWAM
        const VOICE_ID = voiceId || '21m00Tcm4TlvDq8ikWAM';

        const audioStream = await elevenlabs.generate({
            voice: VOICE_ID,
            text: text,
            model_id: "eleven_monolingual_v1"
        });

        // Handle stream to buffer conversion if necessary, or stream directly.
        // For Next.js App Router, we can return the stream directly or a buffer.
        // ElevenLabs SDK `generate` returns a readable stream (Node).

        // To send this to client, we can collect chunks.
        const chunks: Buffer[] = [];
        for await (const chunk of audioStream) {
            chunks.push(Buffer.from(chunk));
        }
        const audioBuffer = Buffer.concat(chunks);

        return new NextResponse(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioBuffer.length.toString(),
            },
        });

    } catch (error: any) {
        console.error('TTS Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
