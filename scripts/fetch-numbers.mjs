import { mkdir, writeFile } from 'node:fs/promises';

const scope = 'org:Mobius-Toolkit -repo:Mobius-Toolkit/Mobius-rust';
const headers = { Accept: 'application/vnd.github+json' };
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}
const file = new URL('../src/assets/numbers.json', import.meta.url);

async function search(query, page) {
  const url = new URL('https://api.github.com/search/issues');
  url.search = new URLSearchParams({ q: query, per_page: '100', page: String(page) });
  let response = await fetch(url, { headers });
  if (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') {
    const resetAt = Number(response.headers.get('x-ratelimit-reset')) * 1000;
    await new Promise((resolve) => setTimeout(resolve, Math.max(resetAt - Date.now(), 0) + 1000));
    response = await fetch(url, { headers });
  }
  if (!response.ok) {
    throw new Error(`Search failed: ${response.status} ${query}`);
  }
  return response.json();
}

const merged = (await search(`${scope} is:pr is:merged`, 1)).total_count;

const day = 24 * 60 * 60 * 1000;
const isoDay = (index) => new Date(index * day).toISOString().slice(0, 10);
const closedQuery = `${scope} is:issue is:closed reason:completed linked:pr`;
const hours = [];

// A search query returns at most 1000 results, so a range with more results is split in two.
async function collect(from, to) {
  const query = `${closedQuery} closed:${isoDay(from)}..${isoDay(to)}`;
  const first = await search(query, 1);
  if (first.total_count > 1000) {
    if (from === to) {
      throw new Error(`More than 1000 results for one day: ${query}`);
    }
    const middle = Math.floor((from + to) / 2);
    await collect(from, middle);
    await collect(middle + 1, to);
    return;
  }
  const pages = [first];
  for (let page = 2; page <= Math.ceil(first.total_count / 100); page++) {
    pages.push(await search(query, page));
  }
  for (const { items } of pages) {
    for (const { created_at, closed_at } of items) {
      hours.push((Date.parse(closed_at) - Date.parse(created_at)) / 3_600_000);
    }
  }
}

const today = Math.floor(Date.now() / day);
await collect(today - 30, today);
if (hours.length === 0) {
  throw new Error(`No closed issue found: ${closedQuery}`);
}
hours.sort((a, b) => a - b);
const middle = Math.floor(hours.length / 2);
const median = hours.length % 2 ? hours[middle] : (hours[middle - 1] + hours[middle]) / 2;

await mkdir(new URL('./', file), { recursive: true });
await writeFile(file, JSON.stringify({ merged, medianHours: Math.round(median) }));
