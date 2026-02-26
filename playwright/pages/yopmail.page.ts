/**
 * YopMailPage – Page Object for the YopMail disposable-email service.
 *
 * Maps Katalon object-repository paths (Pg_YOPmail/*, Pg_WebMailinator/*)
 * to Playwright locators.
 */

import { Page, Locator } from '@playwright/test';

export class YopMailPage {
  readonly page: Page;

  // ── Locators ──────────────────────────────────────────────────
  readonly btnGo: Locator;
  readonly btnNext: Locator;
  readonly lblEmailSubject: Locator;
  readonly lblEmailBody: Locator;

  constructor(page: Page) {
    this.page = page;

    // YopMail-specific selectors
    this.btnGo = page.locator('button:has-text("Go"), #refreshbut, [title="Check Inbox"]');
    this.btnNext = page.locator('button:has-text("Next"), [data-testid="next-btn"]');
    this.lblEmailSubject = page.locator('.lms, .mctn .m .lms');
    this.lblEmailBody = page.locator('#mail .mctn, #mail');
  }

  /** Navigate to YopMail and look up the inbox for the given email prefix. */
  async openInbox(emailPrefix: string): Promise<void> {
    await this.page.goto('https://www.yopmail.com/');
    await this.page.waitForTimeout(3_000);

    const loginInput = this.page.locator('#login');
    await loginInput.waitFor({ state: 'visible', timeout: 10_000 });
    await loginInput.fill(emailPrefix);
    await this.btnGo.click();
  }

  /**
   * Extract a 6-digit OTP from the latest email body.
   * Returns the OTP string or throws if not found.
   */
  async extractOTP(): Promise<string> {
    // Wait for email content to load
    await this.lblEmailSubject.first().waitFor({ state: 'visible', timeout: 30_000 });
    await this.lblEmailBody.first().waitFor({ state: 'visible', timeout: 30_000 });

    // Click email body to ensure it's loaded
    await this.lblEmailBody.first().click();
    const text = await this.lblEmailBody.first().innerText();

    console.log('Email Body:\n' + text);

    // Extract 6-digit OTP
    const match = text.match(/\b\d{6}\b/);
    if (!match) {
      throw new Error('OTP not found in the email body.');
    }

    console.log('OTP Generated - Successfully Captured: ' + match[0]);
    return match[0];
  }
}
