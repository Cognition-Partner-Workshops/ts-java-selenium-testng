import { Page, Locator, expect } from "@playwright/test";

/**
 * Page Object Model - Welcome Page (after successful login)
 * Encapsulates all interactions with the welcome/dashboard page
 */
export class WelcomePage {
  readonly page: Page;
  readonly welcomeTitle: Locator;
  readonly welcomeMessage: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeTitle = page.locator("#welcome-title");
    this.welcomeMessage = page.locator("#welcome-message");
    this.logoutButton = page.locator("#logout-button");
  }

  // ---- Actions ----
  async clickLogout() {
    await this.logoutButton.click();
  }

  // ---- Assertions / Queries ----
  async isDisplayed() {
    await expect(this.welcomeTitle).toBeVisible({ timeout: 5000 });
    await expect(this.logoutButton).toBeVisible();
  }

  async getTitleText(): Promise<string> {
    return await this.welcomeTitle.innerText();
  }

  async getMessageText(): Promise<string> {
    return await this.welcomeMessage.innerText();
  }

  async isLoggedInAs(username: string): Promise<boolean> {
    const text = await this.getMessageText();
    return text.includes(username);
  }
}
