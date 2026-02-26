/**
 * ProfilePage – Page Object for Profile / MFA-related elements.
 *
 * Maps Katalon object-repository paths (Pg_Profile/*) to Playwright locators.
 */

import { Page, Locator } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;

  // ── Locators (Pg_Profile/*) ───────────────────────────────────
  readonly lnkShowMore: Locator;
  readonly chkEmailOption: Locator;
  readonly btnMFANext: Locator;
  readonly lnkSendAnotherWay: Locator;
  readonly lnkResendOtp: Locator;
  readonly editEnterOneTimeCode: Locator;
  readonly chkRememberThisDevice: Locator;
  readonly editEmailName: Locator;
  readonly editPassword: Locator;
  readonly editRetypeNewPassword: Locator;

  constructor(page: Page) {
    this.page = page;

    // TODO: Replace selectors with actual selectors from the application
    this.lnkShowMore = page.locator('a:has-text("Show more"), button:has-text("Show more"), [data-testid="show-more"]');
    this.chkEmailOption = page.locator('input[type="radio"][value="email"], input[type="checkbox"][data-testid="email-option"], label:has-text("Email")');
    this.btnMFANext = page.locator('button:has-text("Next"), [data-testid="mfa-next-btn"]');
    this.lnkSendAnotherWay = page.locator('a:has-text("Send another way"), button:has-text("Send another way"), [data-testid="send-another-way"]');
    this.lnkResendOtp = page.locator('a:has-text("Resend"), button:has-text("Resend"), [data-testid="resend-otp"]');
    this.editEnterOneTimeCode = page.locator('input[data-testid="otp-input"], input[name="otpCode"], input[placeholder*="code"]');
    this.chkRememberThisDevice = page.locator('input[type="checkbox"][data-testid="remember-device"], label:has-text("Remember this device")');
    this.editEmailName = page.locator('#login, input[name="login"], [data-testid="email-name-input"]');
    this.editPassword = page.locator('#newPassword, input[name="newPassword"], [data-testid="new-password"]');
    this.editRetypeNewPassword = page.locator('#retypePassword, input[name="retypePassword"], [data-testid="retype-password"]');
  }
}
