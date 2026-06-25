import { Page, Locator, expect } from '@playwright/test';
import { generateUniqueName, readNotificationMessage, searchTable } from '../utils/helpers';

export class ManageClientsPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;
  readonly clientTable: Locator;
  readonly searchBar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.locator('button.fa-plus-circle').or(
      page.getByRole('button', { name: /add|\+/i })
    ).first();
    this.nameInput = page.locator('#name').or(
      page.locator('input[name*="name"]')
    ).first();
    this.saveButton = page.getByRole('button', { name: /^Save$/i });
    this.clientTable = page.locator('table').filter({ hasText: 'Client' }).first();
    this.searchBar = page.locator('#search-bar-0');
  }

  async addNewClient(clientName?: string): Promise<string> {
    const name = clientName || generateUniqueName('Client');
    await this.addButton.click();
    await expect(this.nameInput).toBeVisible();
    await this.nameInput.fill(name);
    await this.saveButton.click();
    await this.page.waitForTimeout(1000);
    return name;
  }

  async editClient(clientName: string, newName: string): Promise<void> {
    await searchTable(this.page, clientName);
    const row = this.clientTable.locator('tbody tr').filter({ hasText: clientName }).first();
    await row.locator('button.edit').or(row.locator('[title*="edit" i]')).first().click();
    await expect(this.nameInput).toBeVisible();
    await this.nameInput.clear();
    await this.nameInput.fill(newName);
    await this.saveButton.click();
    await this.page.waitForTimeout(1000);
  }

  async clientRows(): Promise<string[][]> {
    return this.clientTable.locator('tbody tr').evaluateAll((rows) =>
      rows.map((row) => [...(row as HTMLTableRowElement).cells].map((cell) => cell.textContent?.trim() || ''))
    );
  }

  async verifyClientExists(clientName: string): Promise<void> {
    await searchTable(this.page, clientName);
    await expect(this.page.getByText(clientName)).toBeVisible();
  }
}
