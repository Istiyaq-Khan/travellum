import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Country, { ICountry } from '@/models/Country';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const slug = name.toLowerCase().trim().replace(/ /g, '-');
    await dbConnect();

    // 1. Check Cache
    const cachedCountry = await Country.findOne({ slug });

    // Cache validity: 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    if (cachedCountry && cachedCountry.lastUpdated > sevenDaysAgo) {
      console.log(`Serving ${name} from MongoDB Cache`);
      return NextResponse.json(cachedCountry);
    }

    console.log(`Generating data for ${name} using Gemini...`);

    // 2. Generate Data via Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Act as a professional travel guide. Generate a comprehensive JSON guide for the country "${name}".
      The JSON must strictly follow this structure:
      { 
        "name": "Country name",
        "overview": "Short inviting description (2 sentences).",
        "estimatedCost": {
          "budget": "Daily cost for backpackers (include currency)",
          "medium": "Daily cost for average tourist",
          "luxury": "Daily cost for luxury",
          "currency": "Local currency code"
        },
        "safety": {
          "score": 85 (0-100),
          "details": {
            "crime": "Status",
            "transport": "Status",
            "women": "Specific safety info",
            "lgbtq": "Specific safety info",
            "health": "Health risks/quality",
            "political": "Stability status"
          }
        },
        "bestSeason": "Best months to visit",
        "visaRequirements": "General visa info for US/EU citizens",
        "culturalWarnings": ["Array of 3 important dos/donts"],
        "localLaws": ["Array of 2 important laws"],
        "emergencyNumbers": {
          "police": "Number",
          "ambulance": "Number"
        },
        "internetAvailability": "Speed/Coverage description",
        "advisoryText": "A calm, neutral paragraph (approx 50 words) summarizing safety and travel advice, suitable for reading aloud.",
        "historyText": "An engaging, documentary-style short paragraph (approx 60 words) about the country's history and culture."
      }
      Do not include markdown formatting like \`\`\`json. Just return the raw JSON string.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text().replace(/```json/g, '').replace(/```/g, '').trim();

    const data = JSON.parse(text);

    // 3. Use Gemini's Corrected Name for Slug
    // If user searched "farnce", Gemini returns "France". We want slug "france".
    const correctName = data.name || name;
    const correctSlug = correctName.toLowerCase().trim().replace(/ /g, '-');

    // 4. Save to MongoDB (Upsert)
    const countryData = {
      name: correctName,
      slug: correctSlug,
      ...data,
      lastUpdated: new Date()
    };

    const savedCountry = await Country.findOneAndUpdate(
      { slug: correctSlug },
      countryData,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(savedCountry);

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { slug, audioUrl, audioType } = await req.json(); // audioType: 'advisory' | 'history'

    if (!slug || !audioUrl || !audioType) {
      return NextResponse.json({ error: 'Slug, Audio URL, and Audio Type are required' }, { status: 400 });
    }

    await dbConnect();

    const updateField = `audioUrls.${audioType}`;

    const updatedCountry = await Country.findOneAndUpdate(
      { slug },
      { $set: { [updateField]: audioUrl } },
      { new: true }
    );

    if (!updatedCountry) {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }

    return NextResponse.json(updatedCountry);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
