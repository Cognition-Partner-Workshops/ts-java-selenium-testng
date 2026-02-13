import { Page } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  private get welcomeMessage() {
    return this.page.locator('[data-testid="welcome-message"]');
  }

  private get logoutButton() {
    return this.page.locator('[data-testid="logout-button"]');
  }

  async getWelcomeMessage(): Promise<string> {
    await this.welcomeMessage.waitFor({ state: 'visible' });
    return (await this.welcomeMessage.textContent()) || '';
  }

  async isOnDashboardPage(): Promise<boolean> {
    await this.page.waitForURL('**/dashboard');
    return this.page.url().includes('/dashboard');
  }

  async isWelcomeMessageVisible(): Promise<boolean> {
    return this.welcomeMessage.isVisible();
  }

  async clickLogout(): Promise<void> {
    await this.logoutButton.click();
  }
}
