import { Page, Locator, expect } from '@playwright/test';
import { generateUniqueName, readNotificationMessage, searchTable } from '../utils/helpers';

export class ManageContextPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;
  readonly contextTable: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.locator('button.fa-plus-circle').or(
      page.getByRole('button', { name: /add|\+/i })
    ).first();
    this.nameInput = page.locator('#name').or(
      page.locator('input[name*="name"]')
    ).first();
    this.saveButton = page.getByRole('button', { name: /^Save$/i });
    this.contextTable = page.locator('table').first();
    this.cancelButton = page.locator('#btnCancel').or(
      page.getByRole('button', { name: /Cancel/i })
    ).first();
  }

  async addNewContext(contextName?: string): Promise<string> {
    const name = contextName || generateUniqueName('Context');
    await this.addButton.click();
    await expect(this.nameInput).toBeVisible();
    await this.nameInput.fill(name);
    await this.saveButton.click();
    await this.page.waitForTimeout(1000);
    return name;
  }

  async editContext(contextName: string, newName: string): Promise<void> {
    const row = this.contextTable.locator('tbody tr').filter({ hasText: contextName }).first();
    await row.locator('button.edit').or(row.locator('[title*="edit" i]')).first().click();
    await expect(this.nameInput).toBeVisible();
    await this.nameInput.clear();
    await this.nameInput.fill(newName);
    await this.saveButton.click();
    await this.page.waitForTimeout(1000);
  }

  async verifyContextExists(contextName: string): Promise<void> {
    await expect(this.page.getByText(contextName)).toBeVisible();
  }
}
