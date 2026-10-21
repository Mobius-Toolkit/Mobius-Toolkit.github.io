import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://mobius-toolkit.github.io',
  integrations: [
    starlight({
      title: 'Mobius',
      logo: { src: './src/assets/icon.svg' },
      favicon: '/icon.svg',
      customCss: ['./src/styles/custom.css'],
      components: {
        PageTitle: './src/components/PageTitle.astro',
      },
      expressiveCode: {
        styleOverrides: {
          borderColor: 'var(--sl-color-hairline)',
          codeFontFamily: "'Geist Mono Variable', monospace",
        },
      },
    }),
  ],
});
