import { test, expect } from '@playwright/test';
import { APP_URL, USERNAME, PASSWORD } from '../utils/test-config';

test('authenticate and verify login', async ({ page }) => {
  test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running this test.');
  test.setTimeout(60_000);

  await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Username' }).fill(USERNAME);
  await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
  await page.getByRole('button', { name: /Login/i }).click();
  await expect(page).toHaveURL(/\/portal#\/home$/);
  await expect(page.getByText('What would you like to work on today?')).toBeVisible();
});
