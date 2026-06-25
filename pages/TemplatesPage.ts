import { Page, Locator, expect } from '@playwright/test';
import { generateUniqueName, readNotificationMessage } from '../utils/helpers';

export class TemplatesPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly templateCodeInput: Locator;
  readonly benefitDefinitionDropdown: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly templateTable: Locator;
  readonly searchBar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.locator('button.fa-plus-circle').or(
      page.getByRole('button', { name: /add|\+/i })
    ).first();
    this.nameInput = page.locator('#name').or(page.locator('input[name="name"]')).first();
    this.descriptionInput = page.locator('#description').or(page.locator('textarea[name="description"]')).first();
    this.templateCodeInput = page.locator('#templateCode').or(page.locator('input[name="templateCode"]')).first();
    this.benefitDefinitionDropdown = page.locator('#benefitDefinition').or(
      page.locator('select[name="benefitDefinition"]')
    ).first();
    this.saveButton = page.getByRole('button', { name: /^Save$/i });
    this.cancelButton = page.locator('#btnCancel').or(page.getByRole('button', { name: /Cancel/i })).first();
    this.templateTable = page.locator('table').first();
    this.searchBar = page.locator('#search-bar-0');
  }

  async searchTemplates(name: string): Promise<void> {
    await this.searchBar.click();
    await this.searchBar.press('Control+A');
    await this.searchBar.press('Backspace');
    await this.searchBar.pressSequentially(name, { delay: 10 });
    await this.searchBar.press('Enter');
    await this.page.waitForTimeout(500);
  }

  async templateRows(): Promise<string[][]> {
    return this.templateTable.locator('tbody tr').evaluateAll((rows) =>
      rows.map((row) => [...(row as HTMLTableRowElement).cells].map((cell) => cell.textContent?.trim() || ''))
    );
  }

  async waitForTemplateRow(templateName: string): Promise<string[] | undefined> {
    await this.searchTemplates(templateName);
    await expect.poll(async () => {
      const rows = await this.templateRows();
      return rows.some((row) => row.some((cell) => cell.includes(templateName)));
    }, { message: `Template "${templateName}" should be visible`, timeout: 15_000 }).toBe(true);
    const rows = await this.templateRows();
    return rows.find((row) => row.some((cell) => cell.includes(templateName)));
  }

  async fillForm(template: {
    name: string;
    description?: string;
    templateCode?: string;
  }): Promise<void> {
    await this.nameInput.fill(template.name);
    if (template.description) {
      await this.descriptionInput.fill(template.description);
    }
    if (template.templateCode) {
      await this.templateCodeInput.fill(template.templateCode);
    }
  }

  async save(): Promise<string> {
    await this.saveButton.click();
    return readNotificationMessage(this.page);
  }

  async createTemplate(name?: string): Promise<{ name: string; message: string }> {
    const templateName = name || generateUniqueName('Template');
    await this.addButton.click();
    await expect(this.nameInput).toBeVisible();
    await this.fillForm({ name: templateName });
    const message = await this.save();
    return { name: templateName, message };
  }

  async openEditForm(name: string): Promise<void> {
    await this.searchTemplates(name);
    const row = this.templateTable.locator('tbody tr').filter({ hasText: name }).first();
    await row.locator('button.edit').or(row.locator('[title*="edit" i]')).first().click();
    await expect(this.nameInput).toBeVisible();
  }

  async copyTemplate(name: string): Promise<void> {
    await this.searchTemplates(name);
    const row = this.templateTable.locator('tbody tr').filter({ hasText: name }).first();
    await row.locator('button.copy, [title*="copy" i]').first().click();
    await this.page.waitForTimeout(1000);
  }

  async createVersion(name: string): Promise<void> {
    await this.searchTemplates(name);
    const row = this.templateTable.locator('tbody tr').filter({ hasText: name }).first();
    await row.locator('button.version, [title*="version" i]').first().click();
    await this.page.waitForTimeout(1000);
  }

  async deleteTemplate(name: string): Promise<{ deleted: boolean }> {
    await this.searchTemplates(name);
    const row = this.templateTable.locator('tbody tr').filter({ hasText: name }).first();
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
}
