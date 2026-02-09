import { NextRequest, NextResponse } from 'next/server';
import { fetchContributions } from '@/lib/github';
import { renderChart } from '@/lib/renderer';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;
    const searchParams = request.nextUrl.searchParams;

    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
    const theme = (searchParams.get('theme') as 'github' | 'github-dark' | 'classic' | 'modern' | 'nord' | 'solarized' | 'sunset' | 'ocean' | 'dracula' | 'monokai' | 'one-dark' | 'material-dark' | 'tokyo-night' | 'gruvbox' | 'catppuccin') || 'github';
    const color = searchParams.get('color') || undefined;
    const format = (searchParams.get('format') || 'svg') as 'svg' | 'png';
    const bg = searchParams.get('bg') !== 'false';
    const radius = searchParams.get('radius') ? parseInt(searchParams.get('radius')!) : undefined;
    const gap = searchParams.get('gap') ? parseInt(searchParams.get('gap')!) : undefined;
    const onlyGrid = searchParams.get('grid') === 'true';
    const margin = searchParams.get('margin') ? parseInt(searchParams.get('margin')!) : undefined;
    const showMonths = searchParams.get('months') === 'true';
    const showDays = searchParams.get('days') === 'true';
    const showFooter = searchParams.get('footer') !== 'false';

    try {
        const data = await fetchContributions(username, year);
        const result = await renderChart(data, {
            username,
            theme,
            color,
            format,
            bg,
            radius,
            gap,
            onlyGrid,
            margin,
            showMonths,
            showDays,
            showFooter,
        });

        if (format === 'png') {
            const buffer = result as Buffer;
            return new Response(new Uint8Array(buffer), {
                headers: {
                    'Content-Type': 'image/png',
                    'Cache-Control': 'public, max-age=14400, s-maxage=14400, stale-while-revalidate=86400',
                },
            });
        }

        const svg = result as string;
        return new Response(svg, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, max-age=14400, s-maxage=14400, stale-while-revalidate=86400',
            },
        });
    } catch (error: unknown) {
        console.error('Error generating chart:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const isNotFound = errorMessage.includes('not found');
        return NextResponse.json(
            { error: isNotFound ? 'User Not Found' : 'Failed to generate chart', message: errorMessage },
            { status: isNotFound ? 404 : 500 }
        );
    }
}
