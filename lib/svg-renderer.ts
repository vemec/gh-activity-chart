import { ContributionData, ContributionDay } from './github';
import { getThemeColors, generateShades, type ThemeName, type ThemeMode } from './themes';

export interface SVGOptions {
  username: string;
  theme?: ThemeName;
  color?: string;
  bg?: boolean;
  mode?: ThemeMode;
  radius?: number;
  gap?: number;
  size?: number;
  onlyGrid?: boolean;
  margin?: number;
  showMonths?: boolean;
  showDays?: boolean;
  showScale?: boolean;
  showUsername?: boolean;
}

export function generateSVG(data: ContributionData, options: SVGOptions): string {
  const {
    color,
    theme = 'github',
    bg = true,
    mode = 'light',
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

  let colors: readonly string[];
  colors = getThemeColors(theme as ThemeName, mode as ThemeMode);
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

  const displayWeeks = weeks; 
  const width = displayWeeks.length * (cellSize + gap) + (margin * 2) + labelSpaceLeft;
  const scaleSpace = (!onlyGrid && showScale) ? 20 : 0;
  const usernameSpace = (!onlyGrid && showUsername) ? 20 : 0;
  const monthsSpace = showMonths ? 20 : 0;

  const height = 7 * cellSize + 6 * gap + (margin * 2) + scaleSpace + usernameSpace + monthsSpace;

  // Build SVG manually
  let svgContent = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;

  // Add background rectangle if bg is enabled
  if (bg) {
    svgContent += `<rect width="${width}" height="${height}" fill="white"/>`;
  }

  // Add months text if enabled
  if (showMonths) {
    let xOffset = margin + labelSpaceLeft;
    const seenMonths = new Set<string>();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    displayWeeks.forEach((week) => {
      const dateStr = week[0].date;
      const yearMonth = dateStr.substring(0, 7);
      if (!seenMonths.has(yearMonth)) {
        const mIdx = parseInt(dateStr.split('-')[1]) - 1;
        const textColor = mode === 'dark' ? '#c9d1d9' : '#24292e';
        svgContent += `<text x="${xOffset}" y="${margin + 15}" font-family="Figtree, system-ui, sans-serif" font-size="10" font-weight="400" fill="${textColor}" opacity="0.8">${monthNames[mIdx]}</text>`;
        seenMonths.add(yearMonth);
      }
      xOffset += cellSize + gap;
    });
  }

  // Add day labels if enabled
  if (showDays) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const textColor = mode === 'dark' ? '#c9d1d9' : '#24292e';
    const daysToShow = [1, 3, 5]; // Monday, Wednesday, Friday
    daysToShow.forEach((dayIndex) => {
      const y = margin + labelSpaceTop + dayIndex * (cellSize + gap) + cellSize / 2 + 3; 
      svgContent += `<text x="${margin + 25}" y="${y}" font-family="Figtree, system-ui, sans-serif" font-size="9" font-weight="400" fill="${textColor}" opacity="0.6" text-anchor="end">${dayNames[dayIndex]}</text>`;
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

  // Add scale
  if (showScale) {
    const scaleY = height - margin - (showUsername ? 40 : 27);
    const textColor = mode === 'dark' ? '#c9d1d9' : '#24292e';

    const lessTextWidth = 25; 
    const scaleSize = cellSize - 2;
    const scaleGap = gap;
    const scaleWidth = colors.length * (scaleSize + scaleGap) - scaleGap;
    const moreTextWidth = 30; 
    const totalScaleWidth = lessTextWidth + scaleWidth + moreTextWidth + 20;

    const chartAreaEndX = margin + labelSpaceLeft + (displayWeeks.length - 1) * (cellSize + gap) + cellSize;
    const scaleStartX = chartAreaEndX - totalScaleWidth;

    svgContent += `<text x="${scaleStartX}" y="${scaleY}" font-family="Figtree, system-ui, sans-serif" font-size="9" font-weight="400" fill="${textColor}" opacity="0.6">Less</text>`;

    const squaresStartX = scaleStartX + lessTextWidth + 5;
    colors.forEach((color, i) => {
      const x = squaresStartX + i * (scaleSize + scaleGap);
      svgContent += `<rect x="${x}" y="${scaleY - scaleSize}" width="${scaleSize}" height="${scaleSize}" fill="${color}" rx="${radius}" ry="${radius}"/>`;
    });

    const moreX = squaresStartX + colors.length * (scaleSize + scaleGap) - scaleGap + 5;
    svgContent += `<text x="${moreX}" y="${scaleY}" font-family="Figtree, system-ui, sans-serif" font-size="9" font-weight="400" fill="${textColor}" opacity="0.6">More</text>`;
  }

  // Add username
  if (showUsername) {
    const usernameY = height - margin - 10;
    const textColor = mode === 'dark' ? '#c9d1d9' : '#24292e';
    const usernameX = margin + labelSpaceLeft;

    svgContent += `<text x="${usernameX}" y="${usernameY}" font-family="Figtree, system-ui, sans-serif" font-size="10" font-weight="500" fill="${textColor}" opacity="0.8">${options.username}</text>`;
  }

  svgContent += '</svg>';
  return svgContent;
}
