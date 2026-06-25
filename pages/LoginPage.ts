import { Page, Locator, expect } from '@playwright/test';
import { APP_URL } from '../utils/test-config';

export class LoginPage {
  readonly page: Page;
  readonly signInHeading: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly welcomeMessage: Locator;
  readonly profileDropdown: Locator;
  readonly logoutMenuItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInHeading = page.getByRole('heading', { name: 'Sign In' });
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: /Login/i });
    this.welcomeMessage = page.getByText('What would you like to work on today?');
    this.profileDropdown = page.locator('#dropdown-size-small');
    this.logoutMenuItem = page.getByRole('menuitem', { name: /Log Out/i });
  }

  async goto(): Promise<void> {
    await this.page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 45_000 });
    await expect(this.signInHeading).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL(/\/portal#\/home$/, { timeout: 30_000 });
    await expect(this.welcomeMessage).toBeVisible();
  }

  async logout(): Promise<void> {
    await this.profileDropdown.click();
    await this.logoutMenuItem.click();
    await this.page.waitForURL(/\/portal#\/$/, { timeout: 15_000 });
    await expect(this.signInHeading).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
  }

  async verifyLoginPage(): Promise<void> {
    await expect(this.signInHeading).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }
}
