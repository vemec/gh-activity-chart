import { NextRequest, NextResponse } from 'next/server';
import { fetchContributions } from '@/lib/github';
import { renderChart } from '@/lib/renderer';

// Preset configurations
const PRESETS = {
    minimal: {
        bg: false,
        onlyGrid: true,
        margin: 5,
        radius: 2,
        gap: 1,
        showMonths: false,
        showDays: false,
        showFooter: false,
    },
    compact: {
        bg: true,
        onlyGrid: true,
        margin: 10,
        radius: 1,
        gap: 1,
        showMonths: false,
        showDays: false,
        showFooter: false,
    },
    classic: {
        bg: true,
        onlyGrid: false,
        margin: 20,
        radius: 2,
        gap: 2,
        showMonths: true,
        showDays: false,
        showFooter: true,
    },
    modern: {
        bg: true,
        onlyGrid: false,
        margin: 20,
        radius: 3,
        gap: 2,
        showMonths: false,
        showDays: true,
        showFooter: true,
    },
    full: {
        bg: true,
        onlyGrid: false,
        margin: 25,
        radius: 2,
        gap: 2,
        showMonths: true,
        showDays: true,
        showFooter: true,
    },
    dark: {
        bg: true,
        onlyGrid: false,
        margin: 20,
        radius: 2,
        gap: 2,
        showMonths: true,
        showDays: false,
        showFooter: true,
    },
    coder: {
        bg: true,
        onlyGrid: false,
        margin: 20,
        radius: 2,
        gap: 2,
        showMonths: true,
        showDays: false,
        showFooter: true,
    },
} as const;

type PresetKey = keyof typeof PRESETS;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;
    const searchParams = request.nextUrl.searchParams;

    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
    const preset = searchParams.get('preset') as PresetKey | null;

    // Get preset configuration or use individual parameters
    const presetConfig = preset && PRESETS[preset] ? PRESETS[preset] : null;

    const theme = (searchParams.get('theme') as 'github' | 'github-dark' | 'classic' | 'modern' | 'nord' | 'solarized' | 'sunset' | 'ocean' | 'dracula' | 'monokai' | 'one-dark' | 'material-dark' | 'tokyo-night' | 'gruvbox' | 'catppuccin') || 'github';
    const color = searchParams.get('color') || undefined;
    const format = (searchParams.get('format') || 'svg') as 'svg' | 'png';
    const bgParam = searchParams.get('bg');
    const bg = bgParam === null ? (presetConfig?.bg ?? true) : bgParam === 'true';
    const radius = searchParams.get('radius') ? parseInt(searchParams.get('radius')!) : presetConfig?.radius;
    const gap = searchParams.get('gap') ? parseInt(searchParams.get('gap')!) : presetConfig?.gap;
    const onlyGrid = searchParams.get('grid') === 'true' || (presetConfig?.onlyGrid ?? false);
    const margin = searchParams.get('margin') ? parseInt(searchParams.get('margin')!) : presetConfig?.margin;
    const showMonths = searchParams.get('months') === 'true' || (presetConfig?.showMonths ?? true);
    const showDays = searchParams.get('days') === 'true' || (presetConfig?.showDays ?? false);
    const showFooter = searchParams.get('footer') !== 'false' && (presetConfig?.showFooter ?? true);

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
