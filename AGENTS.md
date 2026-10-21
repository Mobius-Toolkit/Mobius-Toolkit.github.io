# Mobius site

This repository holds the public site of Mobius at `https://mobius-toolkit.github.io/`. The site uses Astro and Starlight. GitHub Pages hosts it.

## Layout

```
.github/workflows/deploy.yml   Build the site. Deploy it to GitHub Pages.
.mobius/check                  Local check: install and build.
public/                        Static files, for example the favicon.
src/assets/                    Images that Astro processes, for example the logo.
src/content/docs/              Pages in Markdown or MDX. Starlight reads them.
astro.config.mjs               Astro and Starlight settings.
```

## Commands

- `pnpm install` - install the dependencies.
- `pnpm dev` - start the development server.
- `pnpm build` - build the site to `dist/`.
- `.mobius/check` - install with the frozen lockfile, then build. Run it before each commit.

## Writing rule

Write all text in ASD-STE100 (Simplified Technical English). This rule applies to:

- the site text
- the docs
- the code comments
- the commit messages
- the pull requests
