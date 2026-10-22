import { mkdir, writeFile } from 'node:fs/promises';

const base = 'https://raw.githubusercontent.com/Mobius-Toolkit/Mobius/screenshots/main';
const names = ['chat', 'inbox', 'tasks', 'chat-tasks', 'agents', 'usage'];
const devices = ['desktop', 'phone'];
const directory = new URL('../src/assets/screenshots/', import.meta.url);

await mkdir(directory, { recursive: true });

for (const name of names) {
  for (const device of devices) {
    const file = `${name}-${device}.png`;
    const response = await fetch(`${base}/${file}`);
    if (!response.ok) {
      throw new Error(`Download of ${file} failed: ${response.status}`);
    }
    await writeFile(new URL(file, directory), Buffer.from(await response.arrayBuffer()));
  }
}
