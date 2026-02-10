// Chart presets configuration
// Presets only define visual properties, not colors or themes

export interface PresetConfig {
    name: string;
    description: string;
    bg: boolean;
    radius: number;
    gap: number;
    size?: number;
    grid: boolean;
    margin: number;
    months: boolean;
    days: boolean;
    scale: boolean;
    username: boolean;
}

export const PRESETS: Record<string, PresetConfig> = {
    classic: {
        name: "Classic",
        description: "Standard GitHub contribution chart style",
        bg: true,
        radius: 2,
        gap: 2,
        size: 10,
        grid: false,
        margin: 20,
        months: true,
        days: true,
        scale: true,
        username: true,
    },
    minimal: {
        name: "Minimal",
        description: "Compact view without labels or background",
        bg: false,
        radius: 2,
        gap: 1,
        size: 10,
        grid: true,
        margin: 5,
        months: false,
        days: false,
        scale: false,
        username: false,
    },
} as const;

export type PresetKey = keyof typeof PRESETS;