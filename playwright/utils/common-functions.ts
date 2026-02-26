/**
 * CommonFunctions - Playwright equivalent of the Katalon CommonFunctions base class.
 *
 * Provides helper methods that mirror the Katalon custom keywords:
 *   fn_Click, fn_SetText, fn_WaitForElementPresent, fn_ClickIfObjectExists,
 *   fn_PrintCustomMessage, fn_WaituntillElementIsPresent,
 *   fn_WaitUntilPageLoadComplete, setImplicitWait, etc.
 */

import { Page, Locator, expect } from '@playwright/test';

export class CommonFunctions {
  constructor(protected readonly page: Page) {}

  // ── Navigation ────────────────────────────────────────────────

  /** Navigate to the given URL. */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  // ── Element interaction helpers ───────────────────────────────

  /** Click an element identified by its locator. */
  async fnClick(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 15_000 });
    await locator.click();
  }

  /** Fill a text field (clear first, then type). */
  async fnSetText(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: 15_000 });
    await locator.fill(text);
  }

  /** Wait until the element is present on the page (visible). */
  async fnWaitForElementPresent(locator: Locator, timeoutSeconds: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: timeoutSeconds * 1_000 });
  }

  /**
   * Click the element only if it exists and is visible within a short timeout.
   * Equivalent of fn_ClickIfObjectExists – silently does nothing when the
   * element is not found.
   */
  async fnClickIfObjectExists(locator: Locator, timeoutMs = 5_000): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout: timeoutMs });
      await locator.click();
    } catch {
      // Element not present – intentionally ignored.
    }
  }

  /**
   * Wait until a "skeleton loader" or similar element disappears.
   * Equivalent of fn_WaituntillElementIsPresent (which waits for it to vanish).
   */
  async fnWaitUntilElementIsGone(locator: Locator, timeoutMs = 30_000): Promise<void> {
    try {
      await locator.waitFor({ state: 'hidden', timeout: timeoutMs });
    } catch {
      // Already gone or never appeared.
    }
  }

  /** Wait until the page reaches the 'networkidle' load state. */
  async fnWaitUntilPageLoadComplete(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  // ── Logging / messaging ───────────────────────────────────────

  /** Print a custom message (mirrors fn_PrintCustomMessage). */
  fnPrintCustomMessage(message: string, isPass: boolean): void {
    const prefix = isPass ? '[PASS]' : '[INFO]';
    console.log(`${prefix} ${message}`);
  }

  // ── Miscellaneous ─────────────────────────────────────────────

  /** Explicit wait (replaces setImplicitWait / WebUI.delay). */
  async wait(seconds: number): Promise<void> {
    await this.page.waitForTimeout(seconds * 1_000);
  }

  /** Take a screenshot and return the buffer. */
  async takeScreenshot(filePath?: string): Promise<Buffer> {
    return this.page.screenshot({ path: filePath, fullPage: true });
  }

  /** Scroll to the top of the page. */
  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /** Get current page URL. */
  getUrl(): string {
    return this.page.url();
  }

  /** Verify an element is present (assertion). */
  async fnVerifyElementIsPresent(locator: Locator, timeoutSeconds = 5): Promise<void> {
    await expect(locator).toBeVisible({ timeout: timeoutSeconds * 1_000 });
  }
}
