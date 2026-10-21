import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://mobius-toolkit.github.io',
  integrations: [
    starlight({
      title: 'Mobius',
      logo: { src: './src/assets/icon.svg' },
      favicon: '/icon.svg',
    }),
  ],
});
