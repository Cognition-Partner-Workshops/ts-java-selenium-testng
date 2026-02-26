/**
 * LoginPage – Page Object for the Login page.
 *
 * Maps Katalon object-repository paths (Pg_Login/*) to Playwright locators.
 * Selector placeholders use reasonable CSS / text selectors – update them
 * to match the actual DOM once the application is available.
 */

import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // ── Locators (Pg_Login/*) ─────────────────────────────────────
  readonly editUserID: Locator;
  readonly editUserIDTemp: Locator;
  readonly editPassword: Locator;
  readonly editLastName: Locator;
  readonly btnContinue: Locator;
  readonly btnNext: Locator;
  readonly btnSignin: Locator;
  readonly btnNEXT: Locator;
  readonly btnGoToAccountOverviewForgotPassword: Locator;

  constructor(page: Page) {
    this.page = page;

    // TODO: Replace selectors with actual selectors from the application
    this.editUserID = page.locator('#userid, [data-testid="userid"], input[name="userid"]');
    this.editUserIDTemp = page.locator('#useridTemp, [data-testid="useridTemp"], input[name="useridTemp"]');
    this.editPassword = page.locator('#password, [data-testid="password"], input[name="password"], input[type="password"]');
    this.editLastName = page.locator('#lastName, [data-testid="lastName"], input[name="lastName"]');
    this.btnContinue = page.locator('button:has-text("Continue"), [data-testid="continue-btn"]');
    this.btnNext = page.locator('button:has-text("Next"), [data-testid="next-btn"]');
    this.btnSignin = page.locator('button:has-text("Sign in"), button:has-text("Sign In"), [data-testid="signin-btn"]');
    this.btnNEXT = page.locator('button:has-text("NEXT"), button:has-text("Next")');
    this.btnGoToAccountOverviewForgotPassword = page.locator(
      'a:has-text("Go to Account Overview"), button:has-text("Go to Account Overview"), [data-testid="go-to-account-overview"]'
    );
  }
}
