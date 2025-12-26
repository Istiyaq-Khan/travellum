import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET: Retrieve user's search history (filtered to < 3 days old)
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

        // Filter search history to only show searches < 3 days old
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const recentSearches = user.searchHistory?.filter(
            (search: any) => new Date(search.searchedAt) > threeDaysAgo
        ) || [];

        return NextResponse.json({ searchHistory: recentSearches });
    } catch (error: any) {
        console.error('Search History GET Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Add new country search to user's search history
export async function POST(req: NextRequest) {
    try {
        const { uid, countryName, slug } = await req.json();

        if (!uid || !countryName || !slug) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        // Use a single atomic operation with aggregation pipeline
        // This prevents race conditions and duplicate entries
        const updatedUser = await User.findOneAndUpdate(
            { uid },
            [
                {
                    $set: {
                        searchHistory: {
                            $concatArrays: [
                                // Add new entry at the beginning
                                [{
                                    countryName: countryName,
                                    slug: slug,
                                    searchedAt: new Date()
                                }],
                                // Filter out any existing entries with the same slug
                                {
                                    $filter: {
                                        input: { $ifNull: ["$searchHistory", []] },
                                        as: "item",
                                        cond: { $ne: ["$$item.slug", slug] }
                                    }
                                }
                            ]
                        }
                    }
                }
            ],
            { new: true, updatePipeline: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, searchHistory: updatedUser.searchHistory });
    } catch (error: any) {
        console.error('Search History POST Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
