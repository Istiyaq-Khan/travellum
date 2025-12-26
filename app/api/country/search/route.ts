import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Country from '@/models/Country';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q');

        if (!query || query.trim().length === 0) {
            return NextResponse.json({ countries: [] });
        }

        // Search for countries by name (case-insensitive)
        const countries = await Country.find({
            name: { $regex: query, $options: 'i' }
        })
            .select('name slug')
            .limit(10)
            .lean();

        return NextResponse.json({ countries });
    } catch (error) {
        console.error('Error searching countries:', error);
        return NextResponse.json(
            { error: 'Failed to search countries' },
            { status: 500 }
        );
    }
}
