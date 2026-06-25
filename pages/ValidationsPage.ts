import { Page, Locator, expect } from '@playwright/test';
import { readNotificationMessage } from '../utils/helpers';

export class ValidationsPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly validationsTable: Locator;
  readonly searchBar: Locator;
  readonly ruleTypeDropdown: Locator;
  readonly messageInput: Locator;
  readonly expressionInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.locator('button.fa-plus-circle').or(
      page.getByRole('button', { name: /add|\+/i })
    ).first();
    this.nameInput = page.locator('#name').or(page.locator('input[name="name"]')).first();
    this.saveButton = page.getByRole('button', { name: /^Save$/i });
    this.cancelButton = page.locator('#btnCancel').or(page.getByRole('button', { name: /Cancel/i })).first();
    this.validationsTable = page.locator('table').first();
    this.searchBar = page.locator('#search-bar-0');
    this.ruleTypeDropdown = page.locator('#ruleType, select[name*="ruleType"]').first();
    this.messageInput = page.locator('#message, textarea[name*="message"]').first();
    this.expressionInput = page.locator('#expression, textarea[name*="expression"]').first();
  }

  async createConstraint(name: string): Promise<string> {
    await this.addButton.click();
    await expect(this.nameInput).toBeVisible();
    await this.nameInput.fill(name);
    await this.saveButton.click();
    return readNotificationMessage(this.page);
  }

  async createDisplayRule(name: string): Promise<string> {
    await this.addButton.click();
    await expect(this.nameInput).toBeVisible();
    await this.nameInput.fill(name);
    if (await this.ruleTypeDropdown.isVisible().catch(() => false)) {
      await this.ruleTypeDropdown.selectOption('Display');
    }
    await this.saveButton.click();
    return readNotificationMessage(this.page);
  }

  async createValidationRule(name: string): Promise<string> {
    await this.addButton.click();
    await expect(this.nameInput).toBeVisible();
    await this.nameInput.fill(name);
    if (await this.ruleTypeDropdown.isVisible().catch(() => false)) {
      await this.ruleTypeDropdown.selectOption('Validation');
    }
    await this.saveButton.click();
    return readNotificationMessage(this.page);
  }

  async editRule(name: string, updates: { name?: string; message?: string; expression?: string }): Promise<string> {
    await this.searchRules(name);
    const row = this.validationsTable.locator('tbody tr').filter({ hasText: name }).first();
    await row.locator('button.edit, [title*="edit" i]').first().click();
    if (updates.name) {
      await this.nameInput.clear();
      await this.nameInput.fill(updates.name);
    }
    if (updates.message && await this.messageInput.isVisible().catch(() => false)) {
      await this.messageInput.fill(updates.message);
    }
    if (updates.expression && await this.expressionInput.isVisible().catch(() => false)) {
      await this.expressionInput.fill(updates.expression);
    }
    await this.saveButton.click();
    return readNotificationMessage(this.page);
  }

  async deleteRule(name: string): Promise<{ deleted: boolean }> {
    await this.searchRules(name);
    const row = this.validationsTable.locator('tbody tr').filter({ hasText: name }).first();
    if (!(await row.isVisible().catch(() => false))) {
      return { deleted: false };
    }
    await row.locator('input[type="checkbox"]').first().check();
    const deleteButton = this.page.locator('button.tableRowDelete').or(
      this.page.getByRole('button', { name: /delete/i })
    ).first();
    const dialogPromise = this.page.waitForEvent('dialog', { timeout: 2_000 })
      .then(async (dialog) => { await dialog.accept(); return dialog.message(); })
      .catch(() => '');
    await deleteButton.click();
    await dialogPromise;
    const confirmBtn = this.page.getByRole('button', { name: /^(Yes|OK|Confirm|Delete)$/i }).last();
    if (await confirmBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await confirmBtn.click();
    }
    await this.page.waitForTimeout(1000);
    return { deleted: true };
  }

  async searchRules(name: string): Promise<void> {
    await this.searchBar.click();
    await this.searchBar.press('Control+A');
    await this.searchBar.press('Backspace');
    await this.searchBar.pressSequentially(name, { delay: 10 });
    await this.searchBar.press('Enter');
    await this.page.waitForTimeout(500);
  }

  async ruleRows(): Promise<string[][]> {
    return this.validationsTable.locator('tbody tr').evaluateAll((rows) =>
      rows.map((row) => [...(row as HTMLTableRowElement).cells].map((cell) => cell.textContent?.trim() || ''))
    );
  }
}
