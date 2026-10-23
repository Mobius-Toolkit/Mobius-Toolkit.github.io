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
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Search failed: ${response.status} ${query}`);
  }
  return response.json();
}

const merged = (await search(`${scope} is:pr is:merged`, 1)).total_count;

const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const query = `${scope} is:issue is:closed reason:completed linked:pr closed:>=${since}`;
const hours = [];
for (let page = 1; ; page++) {
  const { items, total_count } = await search(query, page);
  for (const { created_at, closed_at } of items) {
    hours.push((Date.parse(closed_at) - Date.parse(created_at)) / 3_600_000);
  }
  if (items.length === 0 || hours.length >= total_count) {
    break;
  }
}
if (hours.length === 0) {
  throw new Error(`No closed issue found: ${query}`);
}
hours.sort((a, b) => a - b);
const middle = Math.floor(hours.length / 2);
const median = hours.length % 2 ? hours[middle] : (hours[middle - 1] + hours[middle]) / 2;

await mkdir(new URL('./', file), { recursive: true });
await writeFile(file, JSON.stringify({ merged, medianHours: Math.round(median) }));
