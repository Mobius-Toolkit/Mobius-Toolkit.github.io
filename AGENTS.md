# Mobius site

This repository holds the public site of Mobius at `https://mobius-toolkit.github.io/`. The site uses Astro and Starlight. GitHub Pages hosts it.

## Layout

```
.github/workflows/deploy.yml   Build the site. Deploy it to GitHub Pages.
.mobius/check                  Local check: install and build.
public/                        Static files, for example the favicon.
scripts/fetch-screenshots.mjs  Download the web client screenshots into src/assets/screenshots/. Git ignores them.
src/assets/                    Images that Astro processes, for example the logo.
src/components/                Astro components of the landing page and the Starlight overrides.
src/content/docs/              Pages in Markdown or MDX. Starlight reads them.
src/styles/custom.css          Fonts and colors of the site. Starlight loads this file.
tests/                         Playwright test. It takes the screenshots of the landing page.
astro.config.mjs               Astro and Starlight settings.
playwright.config.ts           Playwright settings. They start the preview server.
```

## Commands

- `pnpm install` - install the dependencies.
- `pnpm dev` - download the screenshots, then start the development server.
- `pnpm build` - download the screenshots, then build the site to `dist/`. The build fails when a download fails.
- `pnpm test` - run the Playwright test against `dist/`. Build the site first. The test writes the screenshots of the landing page to `screenshots/`.
- `pnpm exec playwright install chromium` - install the browser for the test. Do this one time.
- `.mobius/check` - install with the frozen lockfile, then build. Run it before each commit.

## Writing rule

Write all text in ASD-STE100 (Simplified Technical English). This rule applies to:

- the site text
- the docs
- the code comments
- the commit messages
- the pull requests
