import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'phone', width: 390, height: 844 },
];

for (const { name, width, height } of viewports) {
  test(`landing page at ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page).toHaveTitle('Self-hosted agent factory | Mobius');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mobius');
    await page.locator('img').evaluateAll((images) =>
      Promise.all(
        images.map((image) => {
          image.loading = 'eager';
          return image.decode();
        }),
      ),
    );
    await page.screenshot({ path: `screenshots/landing-${name}.png`, fullPage: true });
  });
}
