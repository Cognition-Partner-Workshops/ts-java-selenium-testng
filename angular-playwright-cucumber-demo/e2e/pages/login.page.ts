import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  private get usernameInput() {
    return this.page.locator('[data-testid="username-input"]');
  }

  private get passwordInput() {
    return this.page.locator('[data-testid="password-input"]');
  }

  private get loginButton() {
    return this.page.locator('[data-testid="login-button"]');
  }

  private get errorMessage() {
    return this.page.locator('[data-testid="error-message"]');
  }

  private get usernameError() {
    return this.page.locator('[data-testid="username-error"]');
  }

  private get passwordError() {
    return this.page.locator('[data-testid="password-error"]');
  }

  async navigate(): Promise<void> {
    await this.page.goto('http://localhost:4200/login');
    await this.page.waitForLoadState('networkidle');
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible' });
    return (await this.errorMessage.textContent()) || '';
  }

  async isErrorMessageVisible(): Promise<boolean> {
    try {
      await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isUsernameErrorVisible(): Promise<boolean> {
    try {
      await this.usernameError.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isPasswordErrorVisible(): Promise<boolean> {
    try {
      await this.passwordError.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async isOnLoginPage(): Promise<boolean> {
    await this.page.waitForURL('**/login');
    return this.page.url().includes('/login');
  }
}
