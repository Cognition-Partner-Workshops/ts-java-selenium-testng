import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly configurationMenu: Locator;
  readonly adminMenu: Locator;
  readonly plansLink: Locator;
  readonly myWorkQueueLink: Locator;
  readonly errorMessages: Locator;

  constructor(page: Page) {
    this.page = page;
    this.configurationMenu = page.getByText('Configuration', { exact: false }).first();
    this.adminMenu = page.getByText('Admin', { exact: false }).first();
    this.plansLink = page.getByText('Plans', { exact: false }).first();
    this.myWorkQueueLink = page.getByText('My Work', { exact: false }).first();
    this.errorMessages = page.locator('.error, [class*="error"], .alert-danger');
  }

  async verifyDashboardLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    await expect(this.errorMessages).not.toBeVisible();
  }

  async openConfiguration(menuItem: string): Promise<void> {
    await this.configurationMenu.click();
    await this.page.getByText(menuItem, { exact: false }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async openAdmin(menuItem: string): Promise<void> {
    await this.adminMenu.click();
    await this.page.getByText(menuItem, { exact: false }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async openPlans(): Promise<void> {
    await this.plansLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async openMyWorkQueue(): Promise<void> {
    await this.myWorkQueueLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
