import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { GoogleGenerativeAI } from '@google/generative-ai';

// force dynamic to prevent static optimization issues with DB/AI calls
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // Initialize inside handler to avoid module-level side effects causing Turbopack panics
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

  try {
    const { uid } = await req.json();
    if (!uid) return NextResponse.json({ error: 'UID required' }, { status: 400 });

    await dbConnect();
    const user = await User.findOne({ uid });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Check if we have cached recommendations less than 24 hours old
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    if (user.recommendations?.generatedAt && new Date(user.recommendations.generatedAt) > twentyFourHoursAgo) {
      console.log('Serving cached recommendations for user:', uid);
      return NextResponse.json({ recommendations: user.recommendations.data, cached: true });
    }

    console.log('Generating new recommendations for user:', uid);

    // Latest mood
    const latestMood = user.moodLogs?.length ? user.moodLogs[user.moodLogs.length - 1].mood : 'General';
    const profile = user.profile || {};

    const prompt = `
      Based on this user profile, recommend 3 top travel destinations.
      Profile:
      - Age: ${profile.age || 'Unknown'}
      - Group Type: ${profile.groupType || 'Solo'}
      - Location: ${profile.location || 'Unknown'}
      - Mood: ${latestMood}
      - Documents: ${profile.travelDocuments?.join(', ') || 'None'}

      Return a JSON array with 3 objects:
      [
        {
          "name": "Country Name",
          "matchScore": 95,
          "reason": "One sentence explaining why it fits their mood and profile."
        }
      ]
      Do not include markdown. strictly JSON.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

    const recommendations = JSON.parse(text);

    // Save recommendations to user document with timestamp
    await User.findOneAndUpdate(
      { uid },
      {
        recommendations: {
          data: recommendations,
          generatedAt: new Date()
        }
      }
    );

    return NextResponse.json({ recommendations, cached: false });
  } catch (error: any) {
    console.error('Recommend API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
