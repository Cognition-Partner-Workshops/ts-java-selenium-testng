import { Page, BrowserContext, TestInfo } from '@playwright/test';
import { APP_URL, USERNAME, PASSWORD, portalUrl } from './test-config';
import * as fs from 'fs';

export interface ApiResponse {
  status: number;
  method: string;
  url: string;
}

/**
 * Track gateway API responses (non-GET) for evidence
 */
export function trackGatewayResponses(context: BrowserContext, apiResponses: ApiResponse[]): void {
  context.on('response', (response) => {
    const url = response.url();
    if (url.includes('/gxcapturegateway/') && response.request().method() !== 'GET') {
      apiResponses.push({
        status: response.status(),
        method: response.request().method(),
        url,
      });
    }
  });
}

/**
 * Filter API responses for failures (status >= 400)
 */
export function failedApiResponses(apiResponses: ApiResponse[]): ApiResponse[] {
  return apiResponses.filter((r) => r.status >= 400);
}

/**
 * Capture a screenshot step for evidence
 */
export async function captureStep(page: Page, testInfo: TestInfo, name: string): Promise<void> {
  const screenshotPath = testInfo.outputPath(`${name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach(name, { path: screenshotPath, contentType: 'image/png' });
}

/**
 * Write evidence JSON file
 */
export async function writeEvidence(testInfo: TestInfo, filename: string, evidence: Record<string, unknown>): Promise<void> {
  const outputPath = testInfo.outputPath(filename);
  fs.writeFileSync(outputPath, JSON.stringify(evidence, null, 2));
}

/**
 * Login to the portal
 */
export async function loginToPortal(page: Page): Promise<void> {
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  await page.getByRole('heading', { name: 'Sign In' }).waitFor({ state: 'visible' });
  await page.getByRole('textbox', { name: 'Username' }).fill(USERNAME);
  await page.getByRole('textbox', { name: 'Password' }).fill(PASSWORD);
  await page.getByRole('button', { name: /Login/i }).click();
  await page.waitForURL(/\/portal#\/home$/, { timeout: 30_000 });
  await page.getByText('What would you like to work on today?').waitFor({ state: 'visible' });
}

/**
 * Navigate to Benefits Management instance
 */
export async function openBenefitsManagement(page: Page): Promise<Page> {
  await page.goto(portalUrl('/portal#/home'), { waitUntil: 'domcontentloaded', timeout: 45_000 });
  // Click on Benefits Management instance card
  const bmLink = page.getByText('Benefits Management', { exact: false })
    .or(page.locator('[class*="instance"]').filter({ hasText: 'Benefits Management' }))
    .first();
  const [benefitsPage] = await Promise.all([
    page.context().waitForEvent('page', { timeout: 30_000 }).catch(() => page),
    bmLink.click(),
  ]);
  await benefitsPage.waitForLoadState('domcontentloaded');
  return benefitsPage;
}

/**
 * Open User Management from portal
 */
export async function openUserManagement(page: Page): Promise<void> {
  await page.goto(portalUrl('/portal#/home'), { waitUntil: 'domcontentloaded', timeout: 45_000 });
  await page.getByRole('link', { name: 'Gx Client' }).click();
  await page.waitForURL(/\/portal#\/manageUser$/, { timeout: 15_000 });
  await page.getByRole('heading', { name: /Manage Users/i }).waitFor({ state: 'visible' });
  await userTable(page).waitFor({ state: 'visible' });
}

/**
 * Get the user management table
 */
export function userTable(page: Page) {
  return page.locator('table').filter({ hasText: 'User Name' }).filter({ hasText: 'Applications' }).first();
}

/**
 * Get user rows from the table
 */
export async function userRows(page: Page): Promise<string[][]> {
  return userTable(page).locator('tbody tr').evaluateAll((rows) =>
    rows.map((row) => [...(row as HTMLTableRowElement).cells].map((cell) => cell.textContent?.trim() || ''))
  );
}

/**
 * Show all user rows by changing page size
 */
export async function showAllUserRows(page: Page): Promise<void> {
  const pageSizeButton = page.locator('#pageSize1000').first();
  if (await pageSizeButton.isVisible().catch(() => false)) {
    await pageSizeButton.click().catch(() => null);
    await page.waitForTimeout(500);
    return;
  }
  const pageSizeDropdown = page.locator('#dropdown-size-small').first();
  if (await pageSizeDropdown.isVisible().catch(() => false)) {
    await pageSizeDropdown.click().catch(() => null);
    if (await pageSizeButton.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await pageSizeButton.click().catch(() => null);
      await page.waitForTimeout(500);
    }
  }
}

/**
 * Search in a table using the search bar
 */
export async function searchTable(page: Page, value: string, searchSelector = '#search-bar-0'): Promise<void> {
  await showAllUserRows(page);
  const search = page.locator(searchSelector);
  await search.click();
  await search.press('Control+A');
  await search.press('Backspace');
  if (value) {
    await search.pressSequentially(value, { delay: 10 });
  }
  await search.press('Enter');
  await page.waitForTimeout(500);
}

/**
 * Get visible validation messages
 */
export async function visibleValidationMessages(page: Page): Promise<string[]> {
  return page
    .locator('.errorMsg, .invalid-feedback, .text-danger, [role="alert"]')
    .evaluateAll((elements) =>
      elements.map((el) => el.textContent?.trim() || '').filter((text) => text.length > 0)
    )
    .catch(() => []);
}

/**
 * Read the notification/toast message after a save action
 */
export async function readNotificationMessage(page: Page): Promise<string> {
  const notification = page.locator('.toast-message, .notification, [role="alert"], .Toastify, [class*="toast"]').first();
  try {
    await notification.waitFor({ state: 'visible', timeout: 10_000 });
    return (await notification.textContent()) || '';
  } catch {
    return '';
  }
}

/**
 * Generate a unique name with timestamp
 */
export function generateUniqueName(prefix: string): string {
  const stamp = new Date().toISOString().replace(/\D/g, '').slice(2, 14);
  return `${prefix}_${stamp}`;
}

/**
 * Logout from the portal
 */
export async function logoutFromPortal(page: Page): Promise<void> {
  await page.locator('#dropdown-size-small').click();
  await page.getByRole('menuitem', { name: /Log Out/i }).click();
  await page.waitForURL(/\/portal#\/$/, { timeout: 15_000 });
  await page.getByRole('heading', { name: 'Sign In' }).waitFor({ state: 'visible' });
}

/**
 * Navigate to a BM configuration screen
 */
export async function openConfigurationScreen(benefitsPage: Page, menuItem: string): Promise<void> {
  await benefitsPage.getByText('Configuration', { exact: false }).first().click();
  await benefitsPage.getByText(menuItem, { exact: false }).first().click();
  await benefitsPage.waitForLoadState('domcontentloaded');
}

/**
 * Navigate to Admin > submenu in BM
 */
export async function openAdminScreen(benefitsPage: Page, menuItem: string): Promise<void> {
  await benefitsPage.getByText('Admin', { exact: false }).first().click();
  await benefitsPage.getByText(menuItem, { exact: false }).first().click();
  await benefitsPage.waitForLoadState('domcontentloaded');
}
