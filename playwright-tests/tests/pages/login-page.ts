import { Page, Locator, expect } from "@playwright/test";

/**
 * Page Object Model - Login Page
 * Encapsulates all interactions with the login page
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly signinButton: Locator;
  readonly messageElement: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.locator("#username");
    this.passwordField = page.locator("#password");
    this.signinButton = page.locator("#signin-button");
    this.messageElement = page.locator("#message");
    this.pageTitle = page.locator("h1");
  }

  // ---- Page URL ----
  async visit() {
    await this.page.goto("/");
  }

  // ---- Actions ----
  async enterUsername(username: string) {
    await this.usernameField.fill(username);
  }

  async enterPassword(password: string) {
    await this.passwordField.fill(password);
  }

  async clickSignin() {
    await this.signinButton.click();
  }

  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickSignin();
  }

  // ---- Assertions / Queries ----
  async isDisplayed() {
    await expect(this.usernameField).toBeVisible();
    await expect(this.passwordField).toBeVisible();
    await expect(this.signinButton).toBeVisible();
  }

  async getMessageText(): Promise<string> {
    await expect(this.messageElement).toBeVisible({ timeout: 5000 });
    return await this.messageElement.innerText();
  }

  async isErrorMessage(): Promise<boolean> {
    const className = await this.messageElement.getAttribute("class");
    return className?.includes("error-message") ?? false;
  }

  async isSuccessMessage(): Promise<boolean> {
    const className = await this.messageElement.getAttribute("class");
    return className?.includes("success-message") ?? false;
  }

  async getTitleText(): Promise<string> {
    return await this.pageTitle.innerText();
  }
}
