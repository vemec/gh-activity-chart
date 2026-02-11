// Base theme definitions (light mode) for GitHub activity chart
export const THEMES = {
  github: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  classic: ['#eeeeee', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
  modern: ['#f0f0f0', '#b4daff', '#69b4ff', '#007bff', '#0056b3'],
  nord: ['#eceff4', '#a3be8c', '#8fbcbb', '#81a1c1', '#5e81ac'],
  solarized: ['#eee8d5', '#93a1a1', '#859900', '#b58900', '#cb4b16'],
  sunset: ['#fee2e2', '#fecaca', '#f87171', '#dc2626', '#991b1b'],
  ocean: ['#e0f2fe', '#7dd3fc', '#0ea5e9', '#0284c7', '#075985'],
  dracula: ['#282a36', '#50fa7b', '#6272a4', '#bd93f9', '#ff79c6'],
  monokai: ['#272822', '#a6e22e', '#f92672', '#ae81ff', '#fd971f'],
  'one-dark': ['#282c34', '#98c379', '#e06c75', '#c678dd', '#61afef'],
  'material-dark': ['#263238', '#c3e88d', '#ff5370', '#c792ea', '#82aaff'],
  'tokyo-night': ['#1a1b26', '#9ece6a', '#f7768e', '#bb9af7', '#7dcfff'],
  gruvbox: ['#fbf1c7', '#98971a', '#cc241d', '#b16286', '#458588'],
  catppuccin: ['#eff1f5', '#40a02b', '#d20f39', '#8839ef', '#1e66f5'],
} as const;

export type ThemeName = keyof typeof THEMES;
export type ThemeMode = 'light' | 'dark';

/**
 * Converts light theme colors to dark mode equivalents
 * @param lightColors - Array of 5 light theme colors
 * @returns Array of 5 dark theme colors
 */
export function convertToDarkMode(lightColors: readonly string[]): readonly [string, string, string, string, string] {
  // For themes that have specific dark variants, use predefined mappings
  // For others, use a generic darkening approach
  const result: readonly [string, string, string, string, string] = [
    getDarkColor(lightColors[0], 0),
    getDarkColor(lightColors[1], 1),
    getDarkColor(lightColors[2], 2),
    getDarkColor(lightColors[3], 3),
    getDarkColor(lightColors[4], 4),
  ];

  return result;
}

/**
 * Helper function to get dark color for a specific index
 */
function getDarkColor(color: string, index: number): string {
  // Dark mode color mappings based on common GitHub dark theme
  const darkMappings: Record<string, string> = {
    '#ebedf0': '#161b22', // empty -> dark empty
    '#9be9a8': '#0e4429', // level 1
    '#40c463': '#006d32', // level 2
    '#30a14e': '#26a641', // level 3
    '#216e39': '#39d353', // level 4
  };

  // If we have a predefined dark mapping, use it
  if (darkMappings[color]) {
    return darkMappings[color];
  }

  // Otherwise, convert hex to darker version
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    // Darken the color based on contribution level
    const darkenFactor = [0.1, 0.2, 0.3, 0.4, 0.5][index] || 0.3;
    const newR = Math.max(0, Math.floor(r * darkenFactor));
    const newG = Math.max(0, Math.floor(g * darkenFactor));
    const newB = Math.max(0, Math.floor(b * darkenFactor));

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  return color; // fallback
}

/**
 * Gets theme colors based on theme name and mode
 * @param themeName - The base theme name
 * @param mode - Light or dark mode
 * @returns Array of 5 color strings
 */
export function getThemeColors(themeName: ThemeName, mode: ThemeMode = 'light'): readonly string[] {
  const baseColors = THEMES[themeName];

  if (mode === 'dark') {
    return convertToDarkMode(baseColors);
  }

  return baseColors;
}

/**
 * Generates 5 color shades from a base hex color for custom themes
 * @param baseColor - Hex color string (with or without #)
 * @returns Array of 5 color strings from light to dark
 */
export function generateShades(baseColor: string): readonly string[] {
  const color = baseColor.startsWith('#') ? baseColor : `#${baseColor}`;

  // Parse the hex color
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  // Generate 5 shades from very light to the base color using hex colors (SVG compatible)
  const shades = [
    // Level 0: Very light gray (empty state)
    '#ebedf0',
    // Level 1: Very light tint of the base color
    lightenColor(r, g, b, 0.85),
    // Level 2: Light tint
    lightenColor(r, g, b, 0.7),
    // Level 3: Medium tint
    lightenColor(r, g, b, 0.4),
    // Level 4: Full base color
    color,
  ] as const;

  return shades;
}

/**
 * Lightens RGB color values by a given factor
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @param factor - Lightening factor (0.0 = no change, 1.0 = white)
 * @returns Lightened hex color
 */
function lightenColor(r: number, g: number, b: number, factor: number): string {
  const newR = Math.min(255, Math.floor(r + (255 - r) * factor));
  const newG = Math.min(255, Math.floor(g + (255 - g) * factor));
  const newB = Math.min(255, Math.floor(b + (255 - b) * factor));

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}