import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Country, { ICountry } from '@/models/Country'; // Used in PATCH
import { getCountryData } from '@/lib/country-service';


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const country = await getCountryData(name);

    if (!country) {
      return NextResponse.json({ error: 'Failed to generate country data' }, { status: 500 });
    }

    return NextResponse.json(country);

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
