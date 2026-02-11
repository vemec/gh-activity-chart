import { NextRequest, NextResponse } from 'next/server';
import { fetchContributions } from '@/lib/github';
import { renderChart } from '@/lib/renderer';
import { PRESETS, getPreset, type PresetKey, type PresetConfig } from '@/lib/presets';
import { type ThemeName, type ThemeMode, THEMES } from '@/lib/themes';

// Supported output formats
type Format = 'svg' | 'png';

// Configuration interface for chart rendering
interface ChartConfig {
    username: string;
    theme: ThemeName;
    mode: ThemeMode;
    color?: string;
    format: Format;
    bg: boolean;
    radius?: number;
    gap?: number;
    size?: number;
    onlyGrid: boolean;
    margin?: number;
    showMonths: boolean;
    showDays: boolean;
    showScale: boolean;
    showUsername: boolean;
}

/**
 * Validates and parses a numeric parameter from search params
 * @param param - The parameter value as string or null
 * @param defaultValue - Default value if param is null or invalid
 * @param min - Minimum allowed value (optional)
 * @param max - Maximum allowed value (optional)
 * @returns Parsed number or default value
 */
function parseNumericParam(
    param: string | null,
    defaultValue?: number,
    min?: number,
    max?: number
): number | undefined {
    if (!param) return defaultValue;
    const num = parseInt(param, 10);
    if (isNaN(num)) return defaultValue;
    if (min !== undefined && num < min) return min;
    if (max !== undefined && num > max) return max;
    return num;
}

/**
 * Validates and parses a boolean parameter from search params
 * @param param - The parameter value as string or null
 * @param defaultValue - Default value if param is null
 * @returns Parsed boolean
 */
function parseBooleanParam(param: string | null, defaultValue: boolean): boolean {
    if (param === null) return defaultValue;
    return param === 'true';
}

/**
 * GET handler for GitHub activity chart generation
 *
 * Query Parameters:
 * - preset: Predefined visual configuration (see /lib/presets.ts for available options)
 * - theme: Color theme (github, classic, modern, nord, etc.)
 * - mode: Theme mode (light/dark) - transforms theme colors accordingly
 * - color: Custom hex color (e.g., ff6b6b or #ff6b6b) - overrides theme
 * - format: Output format (svg or png)
 * - bg: Show background (true/false)
 * - radius: Corner radius for squares (0-10)
 * - gap: Gap between squares (0-5)
 * - size: Size of individual squares (1-20)
 * - grid: Show only grid without axes (true/false)
 * - margin: Chart margin (0-100)
 * - months: Show month labels (true/false)
 * - days: Show day labels (true/false)
 * - scale: Show contribution scale (true/false)
 * - username: Show username (true/false)
 * - year: Specific year to fetch data for (optional)
 *
 * Note: Presets only define visual properties (bg, radius, gap, size, grid, margin, months, days, scale, username)
 * and do not include color or theme settings.
 *
 * @param request - Next.js request object
 * @param params - Route parameters containing username
 * @returns Response with SVG or PNG chart or error JSON
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;
    const searchParams = request.nextUrl.searchParams;

    // Validate username
    if (!username || username.trim().length === 0) {
        return NextResponse.json(
            { error: 'Invalid username', message: 'Username parameter is required and cannot be empty' },
            { status: 400 }
        );
    }

    const year = parseNumericParam(searchParams.get('year'), undefined, 2008, new Date().getFullYear());
    const preset = searchParams.get('preset') as PresetKey | null;

    // Validate preset
    if (preset && !PRESETS[preset]) {
        return NextResponse.json(
            { error: 'Invalid preset', message: `Preset '${preset}' not found. Available presets: ${Object.keys(PRESETS).join(', ')}` },
            { status: 400 }
        );
    }

    // Get preset configuration or use individual parameters
    const presetConfig: PresetConfig | null = preset ? getPreset(preset) : null;

    // Parse and validate parameters
    const themeParam = searchParams.get('theme');
    const theme: ThemeName = Object.keys(THEMES).includes(themeParam as ThemeName) ? (themeParam as ThemeName) : 'github';

    const modeParam = searchParams.get('mode');
    const mode: ThemeMode = (modeParam === 'dark') ? 'dark' : 'light';

    const color = searchParams.get('color') || undefined;
    const format = (searchParams.get('format') === 'png' ? 'png' : 'svg') as Format;

    const bgParam = searchParams.get('bg');
    const bg = bgParam === null ? (presetConfig?.bg ?? true) : parseBooleanParam(bgParam, true);

    const radius = parseNumericParam(searchParams.get('radius'), presetConfig?.radius, 0, 10);
    const gap = parseNumericParam(searchParams.get('gap'), presetConfig?.gap, 0, 5);
    const size = parseNumericParam(searchParams.get('size'), presetConfig?.size, 1, 20);
    const onlyGrid = parseBooleanParam(searchParams.get('grid'), presetConfig?.grid ?? false);
    const margin = parseNumericParam(searchParams.get('margin'), presetConfig?.margin, 0, 100);
    const showMonths = parseBooleanParam(searchParams.get('months'), presetConfig?.months ?? false);
    const showDays = parseBooleanParam(searchParams.get('days'), presetConfig?.days ?? false);
    const showScale = parseBooleanParam(searchParams.get('scale'), presetConfig?.scale ?? true);
    const showUsername = parseBooleanParam(searchParams.get('username'), presetConfig?.username ?? true);

    try {
        const data = await fetchContributions(username, year);
        const config: ChartConfig = {
            username,
            theme,
            mode,
            color,
            format,
            bg,
            radius,
            gap,
            size,
            onlyGrid,
            margin,
            showMonths,
            showDays,
            showScale,
            showUsername,
        };

        const result = await renderChart(data, config);

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
        const isNotFound = errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('404');
        const isRateLimit = errorMessage.toLowerCase().includes('rate limit') || errorMessage.toLowerCase().includes('403');

        let status = 500;
        let errorType = 'Internal Server Error';

        if (isNotFound) {
            status = 404;
            errorType = 'User Not Found';
        } else if (isRateLimit) {
            status = 429;
            errorType = 'Rate Limit Exceeded';
        }

        return NextResponse.json(
            {
                error: errorType,
                message: errorMessage,
                username,
                timestamp: new Date().toISOString()
            },
            { status }
        );
    }
}
