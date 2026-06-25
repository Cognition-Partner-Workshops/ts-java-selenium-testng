import { Page, Locator, expect } from '@playwright/test';
import { generateUniqueName, readNotificationMessage, visibleValidationMessages } from '../utils/helpers';

export class ManageDefinitionsPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly nameInput: Locator;
  readonly labelInput: Locator;
  readonly xmlNodeInput: Locator;
  readonly descriptionInput: Locator;
  readonly activeCheckbox: Locator;
  readonly orderInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly definitionTable: Locator;
  readonly questionnaireForm: Locator;
  readonly searchBar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.locator('button.fa-plus-circle').or(
      page.getByRole('button', { name: /add|\+/i })
    ).first();
    this.nameInput = page.locator('#name').or(page.locator('input[name="name"]')).first();
    this.labelInput = page.locator('#label').or(page.locator('input[name="label"]')).first();
    this.xmlNodeInput = page.locator('#xmlNode').or(page.locator('input[name="xmlNode"]')).first();
    this.descriptionInput = page.locator('#description').or(page.locator('textarea[name="description"]')).first();
    this.activeCheckbox = page.locator('#active').or(page.locator('input[name="active"]')).first();
    this.orderInput = page.locator('#order').or(page.locator('input[name="order"]')).first();
    this.saveButton = page.getByRole('button', { name: /^Save$/i });
    this.cancelButton = page.locator('#btnCancel').or(page.getByRole('button', { name: /Cancel/i })).first();
    this.definitionTable = page.locator('table').first();
    this.questionnaireForm = page.locator('#questionnaire');
    this.searchBar = page.locator('#search-bar-0');
  }

  async openAddForm(): Promise<void> {
    await this.addButton.click();
    await expect(this.nameInput).toBeVisible();
  }

  async fillForm(definition: {
    name: string;
    label: string;
    xmlNode: string;
    description?: string;
    active?: boolean;
    order?: string;
  }): Promise<void> {
    await this.nameInput.fill(definition.name);
    await this.labelInput.fill(definition.label);
    await this.xmlNodeInput.fill(definition.xmlNode);
    if (definition.description) {
      await this.descriptionInput.fill(definition.description);
    }
    if (definition.order) {
      await this.orderInput.fill(definition.order);
    }
  }

  async save(): Promise<string> {
    await this.saveButton.click();
    return readNotificationMessage(this.page);
  }

  async clickSaveAndReadMessage(): Promise<string> {
    await this.saveButton.click();
    return readNotificationMessage(this.page);
  }

  async getValidationMessages(): Promise<string[]> {
    return visibleValidationMessages(this.page);
  }

  async searchDefinitions(name: string): Promise<void> {
    await this.searchBar.click();
    await this.searchBar.press('Control+A');
    await this.searchBar.press('Backspace');
    await this.searchBar.pressSequentially(name, { delay: 10 });
    await this.searchBar.press('Enter');
    await this.page.waitForTimeout(500);
  }

  async definitionRows(): Promise<string[][]> {
    return this.definitionTable.locator('tbody tr').evaluateAll((rows) =>
      rows.map((row) => [...(row as HTMLTableRowElement).cells].map((cell) => cell.textContent?.trim() || ''))
    );
  }

  async openEditForm(name: string): Promise<void> {
    await this.searchDefinitions(name);
    const row = this.definitionTable.locator('tbody tr').filter({ hasText: name }).first();
    await row.locator('button.edit').or(row.locator('[title*="edit" i]')).first().click();
  }

  async deleteDefinition(name: string): Promise<{ deleted: boolean; dialogMessage: string; message: string }> {
    await this.searchDefinitions(name);
    const row = this.definitionTable.locator('tbody tr').filter({ hasText: name }).first();
    if (!(await row.isVisible().catch(() => false))) {
      return { deleted: false, dialogMessage: '', message: '' };
    }
    await row.locator('input[type="checkbox"]').first().check();
    const deleteButton = this.page.locator('button.tableRowDelete').or(
      this.page.getByRole('button', { name: /delete/i })
    ).first();
    const dialogPromise = this.page.waitForEvent('dialog', { timeout: 2_000 })
      .then(async (dialog) => { await dialog.accept(); return dialog.message(); })
      .catch(() => '');
    await deleteButton.click();
    const dialogMessage = await dialogPromise;
    if (!dialogMessage) {
      const confirmBtn = this.page.getByRole('button', { name: /^(Yes|OK|Confirm|Delete)$/i }).last();
      if (await confirmBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
        await confirmBtn.click();
      }
    }
    await this.page.waitForTimeout(1000);
    const message = await readNotificationMessage(this.page);
    return { deleted: true, dialogMessage, message };
  }
}
