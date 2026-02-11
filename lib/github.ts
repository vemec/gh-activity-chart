import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionData {
  total: number;
  days: ContributionDay[];
}

export async function fetchContributions(username: string, year?: number): Promise<ContributionData> {
  const GITHUB_PAT = process.env.GITHUB_PAT;

  try {
    if (GITHUB_PAT) {
      return await fetchWithGraphQL(username, year, GITHUB_PAT);
    }
    return await fetchWithScraping(username, year);
  } catch (error: unknown) {
    // Check if it's an HTTP error with status 404
    if (error && typeof error === 'object' && 'response' in error) {
      const httpError = error as { response?: { status?: number } };
      if (httpError.response?.status === 404) {
        throw new Error(`User "${username}" not found`);
      }
    }
    throw error;
  }
}

async function fetchWithGraphQL(username: string, year: number | undefined, token: string): Promise<ContributionData> {
  const now = new Date();
  const targetYear = year || now.getFullYear();
  const from = `${targetYear}-01-01T00:00:00Z`;
  const to = `${targetYear}-12-31T23:59:59Z`;

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `;

  const response = await axios.post(
    'https://api.github.com/graphql',
    { query, variables: { username, from, to } },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const calendar = response.data.data.user.contributionsCollection.contributionCalendar;
  const days: ContributionDay[] = [];

  calendar.weeks.forEach((week: unknown) => {
    const w = week as { contributionDays: unknown[] };
    w.contributionDays.forEach((day: unknown) => {
      const d = day as { date: string; contributionCount: number };
      days.push({
        date: d.date,
        count: d.contributionCount,
        level: getLevelFromCount(d.contributionCount),
      });
    });
  });

  const uniqueDays = new Map<string, ContributionDay>();
  days.forEach(day => uniqueDays.set(day.date, day));

  return {
    total: calendar.totalContributions,
    days: Array.from(uniqueDays.values()).sort((a, b) => a.date.localeCompare(b.date)),
  };
}

async function fetchWithScraping(username: string, year?: number): Promise<ContributionData> {
  const url = year
    ? `https://github.com/users/${username}/contributions?tab=overview&from=${year}-01-01&to=${year}-12-31`
    : `https://github.com/users/${username}/contributions`;

  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const days: ContributionDay[] = [];

  // GitHub uses <td> or <rect> depending on the view, but in the contributions endpoint it's usually <td>
  $('.ContributionCalendar-day').each((_, el) => {
    const $el = $(el);
    const date = $el.attr('data-date');
    const countText = $el.find('.sr-only').text() || '';
    const levelMatch = $el.attr('data-level');

    if (date) {
      // The count is usually in the screen reader text like "1 contribution on January 1, 2024"
      // GitHub match counts: "No contributions", "1 contribution", "5 contributions"
      const countMatch = countText.match(/(\d+) contribution/);
      const count = countMatch ? parseInt(countMatch[1]) : 0;
      const level = (parseInt(levelMatch || '0') % 5) as 0 | 1 | 2 | 3 | 4;

      days.push({ date, count, level });
    }
  });

  if (days.length === 0) {
    throw new Error(`No contribution data found for user "${username}"`);
  }

  const totalText = $('.js-yearly-contributions h2').text().trim();
  const totalMatch = totalText.match(/([\d,]+)/);
  const total = totalMatch ? parseInt(totalMatch[1].replace(/,/g, '')) : days.reduce((acc, day) => acc + day.count, 0);

  const uniqueDays = new Map<string, ContributionDay>();
  days.forEach(day => uniqueDays.set(day.date, day));

  return {
    total,
    days: Array.from(uniqueDays.values()).sort((a, b) => a.date.localeCompare(b.date))
  };
}

function getLevelFromCount(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (count < 5) return 1;
  if (count < 10) return 2;
  if (count < 20) return 3;
  return 4;
}
