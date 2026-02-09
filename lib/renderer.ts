import satori from 'satori';
import { ContributionData, ContributionDay } from './github';
import React from 'react';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

export interface RenderOptions {
  username: string;
  theme?: 'github' | 'github-dark' | 'classic' | 'modern' | 'nord' | 'solarized' | 'sunset' | 'ocean';
  color?: string;
  format?: 'svg' | 'png';
  bg?: boolean;
  radius?: number; // 0 to 5
  gap?: number;    // 0 to 5
  onlyGrid?: boolean;
  margin?: number; // 0 to 100
  showMonths?: boolean;
  showDays?: boolean;
  showFooter?: boolean;
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
};

export async function renderChart(data: ContributionData, options: RenderOptions): Promise<Buffer | string> {
  const {
    color,
    theme = 'github',
    format = 'svg',
    bg = true,
    radius = 2,
    gap = 2,
    onlyGrid = false,
    margin = 20,
    showMonths = false,
    showDays = false,
    showFooter = true
  } = options;

  let colors = THEMES[theme as keyof typeof THEMES] || THEMES.github;
  if (color) {
    colors = generateShades(color);
  }

  const cellSize = 10;
  const labelSpaceLeft = showDays ? 30 : 0;
  const labelSpaceTop = showMonths ? 20 : 0;

  // Build a continuous timeline of 53 weeks (371 days)
  const daysMap = new Map(data.days.map(d => [d.date, d]));
  const latestDateStr = data.days.length > 0 ? data.days[data.days.length - 1].date : new Date().toISOString().split('T')[0];
  const endDate = new Date(latestDateStr);

  const filledDays: ContributionDay[] = [];
  for (let i = 370; i >= 0; i--) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
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

  const displayWeeks = weeks; // Already limited to 53 weeks
  console.log(`[Renderer] Rendering chart for ${options.username}, format: ${options.format}, displayWeeks: ${displayWeeks.length}`);
  await fs.writeFile(path.join(process.cwd(), 'debug-weeks.json'), JSON.stringify(displayWeeks, null, 2));
  const width = displayWeeks.length * (cellSize + gap) + (margin * 2) + labelSpaceLeft;
  const footerSpace = (!onlyGrid && showFooter) ? 20 : 0;
  const titleSpace = !onlyGrid ? 25 : 0;

  // Height calculation: 7 rows of cells + 6 gaps between them + top/bottom margins
  const height = 7 * cellSize + 6 * gap + (margin * 2);

  const monthLabels: React.ReactElement[] = [];
  const seenMonths = new Set<string>();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  displayWeeks.forEach((week, i) => {
    const dateStr = week[0].date;
    const yearMonth = dateStr.substring(0, 7); // e.g. "2026-02"
    if (!seenMonths.has(yearMonth)) {
      const mIdx = parseInt(dateStr.split('-')[1]) - 1;
      monthLabels.push(
        React.createElement('span', {
          key: yearMonth,
          style: {
            position: 'absolute',
            left: `${i * (cellSize + gap)}px`,
            whiteSpace: 'nowrap'
          }
        }, monthNames[mIdx])
      );
      seenMonths.add(yearMonth);
    }
  });

  const svg = await satori(
    React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: bg ? (theme === 'github-dark' ? '#0d1117' : '#ffffff') : 'transparent',
          padding: `${margin}px`,
          width: '100%',
          height: '100%',
          color: theme === 'github-dark' ? '#c9d1d9' : '#24292e',
        },
      },
      [
        React.createElement(
          'div',
          { key: 'main-container', style: { display: 'flex', flexDirection: 'column' } },
          [
            // showMonths && React.createElement(
            //   'div',
            //   {
            //     key: 'months-row',
            //     style: {
            //       position: 'relative',
            //       marginLeft: `${labelSpaceLeft}px`,
            //       height: '15px',
            //       fontSize: '9px',
            //       marginBottom: '4px',
            //       opacity: 0.6,
            //     }
            //   },
            //   monthLabels
            // ),
            React.createElement(
              'div',
              { key: 'grid-row', style: { display: 'flex' } },
              [
                // showDays && React.createElement(
                //   'div',
                //   { key: 'days', style: { display: 'flex', flexDirection: 'column', width: `${labelSpaceLeft}px`, fontSize: '9px', justifyContent: 'space-around', paddingRight: '4px', opacity: 0.6 } },
                //   ['Mon', 'Wed', 'Fri'].map((day, i) => React.createElement('span', { key: i, style: { height: `${cellSize}px`, display: 'flex', alignItems: 'center' } }, day))
                // ),
                React.createElement(
                  'div',
                  { key: 'grid', style: { display: 'flex', gap: `${gap}px` } },
                  displayWeeks.map((week, wi) =>
                    React.createElement(
                      'div',
                      { key: wi, style: { display: 'flex', flexDirection: 'column', gap: `${gap}px`, flexShrink: 0 } },
                      week.map((day, di) =>
                        React.createElement('div', {
                          key: di,
                          style: {
                            width: `${cellSize}px`,
                            height: `${cellSize}px`,
                            backgroundColor: colors[day.level],
                            borderRadius: `${radius}px`,
                          },
                        })
                      )
                    )
                  )
                )
              ]
            )
          ]
        ),
        // !onlyGrid && React.createElement('div', { key: 'title', style: { marginTop: '15px', fontSize: '13px', fontWeight: 'bold', display: 'flex', marginLeft: `${labelSpaceLeft}px` } }, `@${options.username}'s contributions`),
        // !onlyGrid && showFooter && React.createElement(
        //   'div',
        //   {
        //     key: 'footer',
        //     style: { marginTop: '5px', marginLeft: `${labelSpaceLeft}px`, display: 'flex', justifyContent: 'space-between', fontSize: '10px', opacity: 0.7 }
        //   },
        //   [
        //     React.createElement('span', { key: 'total', style: { display: 'flex' } }, `${data.total} contributions in this period`),
        //     React.createElement('div', { key: 'legend', style: { display: 'flex', gap: '2px', alignItems: 'center' } }, [
        //       React.createElement('span', { key: 'less', style: { marginRight: '4px', display: 'flex' } }, 'Less'),
        //       ...colors.map((c, i) => React.createElement('div', { key: i, style: { width: '8px', height: '8px', backgroundColor: c, borderRadius: '1px', display: 'flex' } })),
        //       React.createElement('span', { key: 'more', style: { marginLeft: '4px', display: 'flex' } }, 'More'),
        //     ])
        //   ]
        // )
      ].filter(Boolean) as any
    ),
    {
      width,
      height,
      fonts: [],
    }
  );

  if (format === 'png') {
    return await sharp(Buffer.from(svg)).png().toBuffer();
  }

  return svg;
}

function generateShades(baseColor: string): string[] {
  const color = baseColor.startsWith('#') ? baseColor : `#${baseColor}`;
  // Simple approximation of shades
  return [
    '#ebedf0',
    color + '33',
    color + '66',
    color + 'aa',
    color,
  ];
}
