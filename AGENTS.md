# Mobius site

This repository holds the public site of Mobius at `https://mobius-toolkit.github.io/`. The site uses Astro and Starlight. GitHub Pages hosts it.

## Layout

```
.github/workflows/deploy.yml   Build the site. Deploy it to GitHub Pages.
.github/workflows/screenshots.yml  Show the screenshots of the landing page in each pull request.
.mobius/check                  Local check: install and build.
public/                        Static files, for example the favicon.
scripts/fetch-screenshots.mjs  Download the web client screenshots into src/assets/screenshots/. Git ignores them.
scripts/fetch-numbers.mjs      Read the work numbers from the GitHub search API into src/assets/numbers.json. Git ignores it.
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
- `pnpm dev` - download the screenshots, read the numbers, then start the development server.
- `pnpm build` - download the screenshots, read the numbers, then build the site to `dist/`. The build fails when a download or a read fails.
- `pnpm test` - run the Playwright test against `dist/`. Build the site first. The test writes the screenshots of the landing page to `screenshots/`.
- `pnpm exec playwright install chromium` - install the browser for the test. Do this one time.
- `.mobius/check` - install with the frozen lockfile, then build. Run it before each commit.

## Screenshots

The job `build` of `deploy.yml` uploads `screenshots/` as the artifact `screenshots`. The job fails when the folder has no files.

The workflow `screenshots.yml` runs after each run of `Deploy`. It has three jobs:

- `comment` runs when a pull request opens or changes. It writes "The screenshots are pending" into the section "Site screenshots" of the pull request description. It removes the label `screenshots`.
- `publish` runs after `Deploy` for a pull request. It copies the images of the artifact to the folder `pr-<n>` of the branch `screenshots`. It compares each image with the same image in the folder `main/`. It writes a table of the changed screens into the section "Site screenshots", or "No screen changed". It sets the label `screenshots` when a screen changed.
- `main` runs after `Deploy` for a push to `main`. It copies the images of the artifact to the folder `main/` of the branch `screenshots`.

GitHub runs a `workflow_run` job only from the file on the default branch. A change of `screenshots.yml` takes effect after the merge.

The images of the web client come from another repository and can change. The test covers each of them with a mask. Thus the images of the landing page stay the same when the site does not change.

## Writing rule

Write all text in ASD-STE100 (Simplified Technical English). This rule applies to:

- the site text
- the docs
- the code comments
- the commit messages
- the pull requests
