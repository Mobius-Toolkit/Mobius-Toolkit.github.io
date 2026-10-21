import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  use: { baseURL: 'http://localhost:4321', reducedMotion: 'reduce' },
  webServer: { command: 'pnpm preview --ignore-lock', url: 'http://localhost:4321' },
});
