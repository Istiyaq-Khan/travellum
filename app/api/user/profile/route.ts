import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET: Retrieve user profile
export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const uid = searchParams.get('uid');

        if (!uid) {
            return NextResponse.json({ error: 'UID required' }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findOne({ uid });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Create or update user profile
export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { uid, email, profile, mood, displayName, photoURL } = await req.json();

        if (!uid || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Find user and update, or create if new
        // We utilize the "upsert" option to handle both cases
        const updateData: any = {
            email,
            displayName,
            photoURL,
            profile,
            isProfileComplete: true, // Mark profile as complete when updated
        };

        if (mood) {
            // Push mood to moodLogs
            updateData.$push = {
                moodLogs: {
                    date: new Date(),
                    mood: mood
                }
            };
        }

        const user = await User.findOneAndUpdate(
            { uid },
            updateData,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ success: true, data: user });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
