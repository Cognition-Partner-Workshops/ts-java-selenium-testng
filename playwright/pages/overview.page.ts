/**
 * OverviewPage – Page Object for the Account Overview page.
 *
 * Maps Katalon object-repository paths (Pg_Overview/*) to Playwright locators.
 */

import { Page, Locator } from '@playwright/test';

export class OverviewPage {
  readonly page: Page;

  // ── Locators (Pg_Overview/*) ──────────────────────────────────
  readonly btnLooksGood: Locator;
  readonly lblWelcome: Locator;
  readonly btnIllDoThisLater: Locator;
  readonly lnkAccountOverview: Locator;

  constructor(page: Page) {
    this.page = page;

    // TODO: Replace selectors with actual selectors from the application
    this.btnLooksGood = page.locator('button:has-text("Looks good"), button:has-text("Looks Good"), [data-testid="looks-good-btn"]');
    this.lblWelcome = page.locator('[data-testid="welcome-label"], text="Welcome"');
    this.btnIllDoThisLater = page.locator('button:has-text("I\'ll do this later"), a:has-text("I\'ll do this later"), [data-testid="do-this-later-btn"]');
    this.lnkAccountOverview = page.locator('a:has-text("Account Overview"), [data-testid="account-overview-link"]');
  }
}
