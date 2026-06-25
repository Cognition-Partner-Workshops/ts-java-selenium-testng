import { Page, Locator, expect } from '@playwright/test';
import { generateUniqueName, readNotificationMessage, visibleValidationMessages } from '../utils/helpers';

export class LoadDefinitionsPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly loadTable: Locator;
  readonly searchBar: Locator;
  readonly runButton: Locator;
  readonly statusColumn: Locator;
  readonly batchProcessButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.locator('button.fa-plus-circle').or(
      page.getByRole('button', { name: /add|\+/i })
    ).first();
    this.nameInput = page.locator('#name').or(page.locator('input[name="name"]')).first();
    this.saveButton = page.getByRole('button', { name: /^Save$/i });
    this.cancelButton = page.locator('#btnCancel').or(page.getByRole('button', { name: /Cancel/i })).first();
    this.loadTable = page.locator('table').first();
    this.searchBar = page.locator('#search-bar-0');
    this.runButton = page.getByRole('button', { name: /run|execute/i }).first();
    this.statusColumn = page.locator('td[class*="status"], td:nth-child(4)');
    this.batchProcessButton = page.getByRole('button', { name: /batch|process/i }).first();
  }

  async searchLoadDefinitions(name: string): Promise<void> {
    await this.searchBar.click();
    await this.searchBar.press('Control+A');
    await this.searchBar.press('Backspace');
    await this.searchBar.pressSequentially(name, { delay: 10 });
    await this.searchBar.press('Enter');
    await this.page.waitForTimeout(500);
  }

  async loadDefinitionRows(): Promise<string[][]> {
    return this.loadTable.locator('tbody tr').evaluateAll((rows) =>
      rows.map((row) => [...(row as HTMLTableRowElement).cells].map((cell) => cell.textContent?.trim() || ''))
    );
  }

  async createLoadDefinition(name?: string): Promise<{ name: string; message: string }> {
    const loadName = name || generateUniqueName('Load');
    await this.addButton.click();
    await expect(this.nameInput).toBeVisible();
    await this.nameInput.fill(loadName);
    await this.saveButton.click();
    const message = await readNotificationMessage(this.page);
    return { name: loadName, message };
  }

  async openEditForm(name: string): Promise<void> {
    await this.searchLoadDefinitions(name);
    const row = this.loadTable.locator('tbody tr').filter({ hasText: name }).first();
    await row.locator('button.edit, [title*="edit" i]').first().click();
    await expect(this.nameInput).toBeVisible();
  }

  async deleteLoadDefinition(name: string): Promise<{ deleted: boolean }> {
    await this.searchLoadDefinitions(name);
    const row = this.loadTable.locator('tbody tr').filter({ hasText: name }).first();
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

  async verifyValidationMessages(): Promise<string[]> {
    return visibleValidationMessages(this.page);
  }

  async runLoadDefinition(name: string): Promise<string> {
    await this.searchLoadDefinitions(name);
    const row = this.loadTable.locator('tbody tr').filter({ hasText: name }).first();
    await row.locator('button.run, [title*="run" i], button.fa-play').first().click();
    return readNotificationMessage(this.page);
  }

  async batchProcess(): Promise<string> {
    await this.batchProcessButton.click();
    return readNotificationMessage(this.page);
  }

  async waitForLoadDefinitionRow(name: string): Promise<string[] | undefined> {
    await this.searchLoadDefinitions(name);
    await expect.poll(async () => {
      const rows = await this.loadDefinitionRows();
      return rows.some((row) => row.some((cell) => cell.includes(name)));
    }, { message: `Load definition "${name}" should be visible`, timeout: 15_000 }).toBe(true);
    const rows = await this.loadDefinitionRows();
    return rows.find((row) => row.some((cell) => cell.includes(name)));
  }
}
