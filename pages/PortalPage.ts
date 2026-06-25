import { Page, Locator, expect } from '@playwright/test';
import { portalUrl } from '../utils/test-config';

export class PortalPage {
  readonly page: Page;
  readonly gxClientLink: Locator;
  readonly benefitsManagementCard: Locator;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.gxClientLink = page.getByRole('link', { name: 'Gx Client' });
    this.benefitsManagementCard = page.getByText('Benefits Management', { exact: false }).first();
    this.welcomeMessage = page.getByText('What would you like to work on today?');
  }

  async goto(): Promise<void> {
    await this.page.goto(portalUrl('/portal#/home'), { waitUntil: 'domcontentloaded', timeout: 45_000 });
    await this.page.waitForURL(/\/portal#\/home$/, { timeout: 15_000 });
  }

  async navigateToUserManagement(): Promise<void> {
    await this.gxClientLink.click();
    await this.page.waitForURL(/\/portal#\/manageUser$/, { timeout: 15_000 });
    await expect(this.page.getByRole('heading', { name: /Manage Users/i })).toBeVisible();
  }

  async clickBenefitsManagement(): Promise<Page> {
    const [benefitsPage] = await Promise.all([
      this.page.context().waitForEvent('page', { timeout: 30_000 }).catch(() => this.page),
      this.benefitsManagementCard.click(),
    ]);
    await benefitsPage.waitForLoadState('domcontentloaded');
    return benefitsPage;
  }

  async verifyNoSRPInstance(): Promise<void> {
    await expect(this.page.getByText('SRP', { exact: true })).not.toBeVisible();
  }

  async verifyNoM3PInstance(): Promise<void> {
    await expect(this.page.getByText('M3P', { exact: true })).not.toBeVisible();
  }

  async verifyPortalHome(): Promise<void> {
    await expect(this.welcomeMessage).toBeVisible();
  }
}
