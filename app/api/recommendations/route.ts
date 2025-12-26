import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// force dynamic to prevent static optimization issues
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

  try {
    const { uid, budget, documents, age, mood } = await req.json();

    if (!uid) return NextResponse.json({ error: 'UID required' }, { status: 400 });

    const prompt = `
      Act as an expert travel agent.
      Recommend 5 travel destinations based on the following user details:
      
      - Budget Level: ${budget}
      - Travel Documents Held: ${documents}
      - Age: ${age}
      - Current Mood: ${mood}

      Constraints:
      1. Consider the visa requirements for the held documents (e.g. if they have a passport from a specific country, focus on visa-free or easy-visa countries if possible, but general advice is fine).
      2. Match the budget level.
      3. Match the vibe/mood.
      4. Provide distinct options.

      Return a JSON array with exactly 5 objects. format:
      [
        {
          "name": "Country Name",
          "matchScore": 95,
          "reason": "One succinct sentence explaining why it fits particularly well."
        }
      ]
      
      Do not include markdown or code blocks. Strictly return valid JSON.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

    let recommendations = [];
    try {
        recommendations = JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse JSON from Gemini:", text);
        return NextResponse.json({ error: 'Failed to generate valid recommendations' }, { status: 500 });
    }

    return NextResponse.json({ recommendations });
  } catch (error: any) {
    console.error('Recommendations API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
