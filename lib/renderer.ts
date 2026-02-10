import { ContributionData, ContributionDay } from './github';
import React from 'react';
import sharp from 'sharp';

// Font loading utilities - removed, using system fonts for SVG

export interface RenderOptions {
  username: string;
  theme?: 'github' | 'github-dark' | 'classic' | 'modern' | 'nord' | 'solarized' | 'sunset' | 'ocean' | 'dracula' | 'monokai' | 'one-dark' | 'material-dark' | 'tokyo-night' | 'gruvbox' | 'catppuccin';
  color?: string;
  format?: 'svg' | 'png';
  bg?: boolean;
  radius?: number; // 0 to 5
  gap?: number;    // 0 to 5
  size?: number;   // cell size in pixels, default 10
  onlyGrid?: boolean;
  margin?: number; // 0 to 100
  showMonths?: boolean;
  showDays?: boolean;
  showScale?: boolean;
  showUsername?: boolean;
}

const THEMES = {
  github: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  'github-dark': ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  classic: ['#eeeeee', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
  modern: ['#f0f0f0', '#b4daff', '#69b4ff', '#007bff', '#0056b3'],
  nord: ['#eceff4', '#a3be8c', '#8fbcbb', '#81a1c1', '#5e81ac'],
  solarized: ['#eee8d5', '#93a1a1', '#859900', '#b58900', '#cb4b16'],
  sunset: ['#fee2e2', '#fecaca', '#f87171', '#dc2626', '#991b1b'],
  ocean: ['#e0f2fe', '#7dd3fc', '#0ea5e9', '#0284c7', '#075985'],
  // Classic programmer themes
  dracula: ['#282a36', '#50fa7b', '#6272a4', '#bd93f9', '#ff79c6'],
  monokai: ['#272822', '#a6e22e', '#f92672', '#ae81ff', '#fd971f'],
  'one-dark': ['#282c34', '#98c379', '#e06c75', '#c678dd', '#61afef'],
  'material-dark': ['#263238', '#c3e88d', '#ff5370', '#c792ea', '#82aaff'],
  'tokyo-night': ['#1a1b26', '#9ece6a', '#f7768e', '#bb9af7', '#7dcfff'],
  gruvbox: ['#fbf1c7', '#98971a', '#cc241d', '#b16286', '#458588'],
  catppuccin: ['#eff1f5', '#40a02b', '#d20f39', '#8839ef', '#1e66f5'],
};

export async function renderChart(data: ContributionData, options: RenderOptions): Promise<Buffer | string> {
  const {
    color,
    theme = 'github',
    format = 'svg',
    bg = true,
    radius = 2,
    gap = 2,
    size = 10,
    onlyGrid = false,
    margin = 20,
    showMonths = false,
    showDays = false,
    showScale = true,
    showUsername = true
  } = options;

  let colors = THEMES[theme as keyof typeof THEMES] || THEMES.github;
  if (color) {
    colors = generateShades(color);
  }

  const cellSize = size;
  const labelSpaceLeft = showDays ? 30 : 0;
  const labelSpaceTop = showMonths ? 20 : 0;

  // Build a continuous timeline from today last year to today this year, aligned to weeks like GitHub
  const daysMap = new Map(data.days.map(d => [d.date, d]));
  const today = new Date();
  const endDate = new Date(today);
  const startDate = new Date(today);
  startDate.setFullYear(startDate.getFullYear() - 1);

  // Find the Sunday of the week containing startDate
  const startSunday = new Date(startDate);
  startSunday.setDate(startDate.getDate() - startDate.getDay());

  // Find the Saturday of the week containing endDate
  const endSaturday = new Date(endDate);
  endSaturday.setDate(endDate.getDate() + (6 - endDate.getDay()));

  // Calculate total days between start Sunday and end Saturday
  const timeDiff = endSaturday.getTime() - startSunday.getTime();
  const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include end date

  const filledDays: ContributionDay[] = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startSunday);
    d.setDate(startSunday.getDate() + i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    filledDays.push(daysMap.get(dateStr) || { date: dateStr, count: 0, level: 0 });
  }

  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];
  for (const day of filledDays) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  const displayWeeks = weeks; // Weeks from last year to this year
  console.log(`[Renderer] Rendering chart for ${options.username}, format: ${options.format}, displayWeeks: ${displayWeeks.length}`);
  const width = displayWeeks.length * (cellSize + gap) + (margin * 2) + labelSpaceLeft;
  const scaleSpace = (!onlyGrid && showScale) ? 20 : 0;
  const usernameSpace = (!onlyGrid && showUsername) ? 20 : 0;
  const titleSpace = !onlyGrid ? 25 : 0;
  const monthsSpace = showMonths ? 20 : 0;

  // Height calculation: 7 rows of cells + 6 gaps between them + top/bottom margins + title + scale + username + months
  const height = 7 * cellSize + 6 * gap + (margin * 2) + titleSpace + scaleSpace + usernameSpace + monthsSpace;

  console.log(`[Renderer] showMonths: ${showMonths}`);

  // Load fonts (not needed for manual SVG)
  console.log(`[Renderer] Building SVG manually`);

  // Build SVG manually
  let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

  // Add background rectangle if bg is enabled
  if (bg) {
    svgContent += `<rect width="${width}" height="${height}" fill="white"/>`;
  }

  // Add months text if enabled
  if (showMonths) {
    let xOffset = margin + labelSpaceLeft;
    const seenMonths = new Set<string>();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    displayWeeks.forEach((week, i) => {
      const dateStr = week[0].date;
      const yearMonth = dateStr.substring(0, 7);
      if (!seenMonths.has(yearMonth)) {
        const mIdx = parseInt(dateStr.split('-')[1]) - 1;
        const textColor = theme === 'github-dark' ? '#c9d1d9' : '#24292e';
        svgContent += `<text x="${xOffset}" y="${margin + 15}" font-family="Figtree" font-size="10" font-weight="400" fill="${textColor}" opacity="0.8">${monthNames[mIdx]}</text>`;
        seenMonths.add(yearMonth);
      }
      xOffset += cellSize + gap;
    });
  }

  // Add day labels if enabled
  if (showDays) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const textColor = theme === 'github-dark' ? '#c9d1d9' : '#24292e';
    // Show only 3 days spaced by one day: Mon, Wed, Fri
    const daysToShow = [1, 3, 5]; // Monday, Wednesday, Friday
    daysToShow.forEach((dayIndex, displayIndex) => {
      const y = margin + labelSpaceTop + dayIndex * (cellSize + gap) + cellSize / 2 + 3; // Center vertically in cell
      svgContent += `<text x="${margin + 25}" y="${y}" font-family="Figtree" font-size="9" font-weight="400" fill="${textColor}" opacity="0.6" text-anchor="end">${dayNames[dayIndex]}</text>`;
    });
  }

  // Add grid
  const gridStartY = margin + labelSpaceTop;
  displayWeeks.forEach((week, wi) => {
    const weekStartX = margin + labelSpaceLeft + wi * (cellSize + gap);
    week.forEach((day, di) => {
      const x = weekStartX;
      const y = gridStartY + di * (cellSize + gap);
      const fillColor = colors[day.level];
      svgContent += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${fillColor}" rx="${radius}" ry="${radius}"/>`;
    });
  });

  // Add scale with "Less | More" and color scale
  if (showScale) {
    const scaleY = height - margin - (showUsername ? 40 : 27);
    const textColor = theme === 'github-dark' ? '#c9d1d9' : '#24292e';

    // Calculate scale width: "Less" + 5 squares + gaps + "More"
    const lessTextWidth = 25; // Approximate width of "Less"
    const scaleSize = cellSize - 2;
    const scaleGap = gap;
    const scaleWidth = colors.length * (scaleSize + scaleGap) - scaleGap; // 5 * (cellSize-2) + 4 * gap
    const moreTextWidth = 30; // Approximate width of "More"
    const totalScaleWidth = lessTextWidth + scaleWidth + moreTextWidth + 20; // Add some padding

    // Position scale aligned to the right edge of the chart area
    const chartAreaEndX = margin + labelSpaceLeft + (displayWeeks.length - 1) * (cellSize + gap) + cellSize;
    const scaleStartX = chartAreaEndX - totalScaleWidth;

    // "Less" text
    svgContent += `<text x="${scaleStartX}" y="${scaleY}" font-family="Figtree" font-size="9" font-weight="400" fill="${textColor}" opacity="0.6">Less</text>`;

    // Color scale squares
    const squaresStartX = scaleStartX + lessTextWidth + 5;
    colors.forEach((color, i) => {
      const x = squaresStartX + i * (scaleSize + scaleGap);
      svgContent += `<rect x="${x}" y="${scaleY - scaleSize}" width="${scaleSize}" height="${scaleSize}" fill="${color}" rx="${radius}" ry="${radius}"/>`;
    });

    // "More" text
    const moreX = squaresStartX + colors.length * (scaleSize + scaleGap) - scaleGap + 5;
    svgContent += `<text x="${moreX}" y="${scaleY}" font-family="Figtree" font-size="9" font-weight="400" fill="${textColor}" opacity="0.6">More</text>`;
  }

  // Add username in the bottom left
  if (showUsername) {
    const usernameY = height - margin - 10;
    const textColor = theme === 'github-dark' ? '#c9d1d9' : '#24292e';
    const usernameX = margin + labelSpaceLeft;

    svgContent += `<text x="${usernameX}" y="${usernameY}" font-family="Figtree" font-size="10" font-weight="500" fill="${textColor}" opacity="0.8">${options.username}</text>`;
  }

  svgContent += '</svg>';

  const svg = svgContent;

  if (format === 'png') {
    return await sharp(Buffer.from(svg)).png().toBuffer();
  }

  return svg;
}

function generateShades(baseColor: string): string[] {
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
  ];

  return shades;
}
