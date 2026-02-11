import { NextRequest, NextResponse } from 'next/server';
import { fetchContributions } from '@/lib/github';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;

    if (!username || username.trim().length === 0) {
        return NextResponse.json(
            { error: 'Invalid username', message: 'Username parameter is required' },
            { status: 400 }
        );
    }

    try {
        const data = await fetchContributions(username);
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
            },
        });
    } catch (error: unknown) {
        console.error('Error fetching contribution data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to fetch data', message: errorMessage },
            { status: 500 }
        );
    }
}
