import { test, expect } from '@playwright/test';

test('the public app boots and its main navigation actually renders pages', async ({ page }) => {
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  await page.goto('/index.html#home');
  await expect(page.locator('main > .loading')).toHaveCount(0, { timeout: 25000 });
  await expect(page.locator('main h1')).toBeVisible({ timeout: 25000 });
  await page.locator('.app-bottom-nav a[href="#learn"]').click();
  await expect(page.locator('.ns-courses-hub')).toBeVisible({ timeout: 25000 });
  expect(failures.filter(x => /SyntaxError|does not provide an export named|already been declared|Failed to fetch dynamically imported module/i.test(x))).toEqual([]);
});
