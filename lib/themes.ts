// Theme definitions for GitHub activity chart
export const THEMES = {
  github: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  'github-dark': ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
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

/**
 * Generates 5 color shades from a base hex color for custom themes
 * @param baseColor - Hex color string (with or without #)
 * @returns Array of 5 color strings from light to dark
 */
export function generateShades(baseColor: string): readonly [string, string, string, string, string] {
  const color = baseColor.startsWith('#') ? baseColor : `#${baseColor}`;

  // Parse the hex color
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  // Generate 5 shades from very light to the base color
  const shades = [
    // Level 0: Very light gray (almost white)
    '#ebedf0',
    // Level 1: Very light tint of the base color
    `rgba(${r}, ${g}, ${b}, 0.15)`,
    // Level 2: Light tint
    `rgba(${r}, ${g}, ${b}, 0.3)`,
    // Level 3: Medium tint
    `rgba(${r}, ${g}, ${b}, 0.6)`,
    // Level 4: Full base color
    color,
  ] as const;

  return shades;
}