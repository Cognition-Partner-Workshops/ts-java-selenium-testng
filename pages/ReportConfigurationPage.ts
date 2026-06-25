import { Page, Locator, expect } from '@playwright/test';
import { generateUniqueName, readNotificationMessage } from '../utils/helpers';

export class ReportConfigurationPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly reportTable: Locator;
  readonly searchBar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.locator('button.fa-plus-circle').or(
      page.getByRole('button', { name: /add|\+/i })
    ).first();
    this.nameInput = page.locator('#name').or(page.locator('input[name="name"]')).first();
    this.saveButton = page.getByRole('button', { name: /^Save$/i });
    this.cancelButton = page.locator('#btnCancel').or(page.getByRole('button', { name: /Cancel/i })).first();
    this.reportTable = page.locator('table').first();
    this.searchBar = page.locator('#search-bar-0');
  }

  async createReportConfig(name?: string): Promise<{ name: string; message: string }> {
    const reportName = name || generateUniqueName('Report');
    await this.addButton.click();
    await expect(this.nameInput).toBeVisible();
    await this.nameInput.fill(reportName);
    await this.saveButton.click();
    const message = await readNotificationMessage(this.page);
    return { name: reportName, message };
  }

  async editReportConfig(name: string, newName: string): Promise<string> {
    const row = this.reportTable.locator('tbody tr').filter({ hasText: name }).first();
    await row.locator('button.edit, [title*="edit" i]').first().click();
    await expect(this.nameInput).toBeVisible();
    await this.nameInput.clear();
    await this.nameInput.fill(newName);
    await this.saveButton.click();
    return readNotificationMessage(this.page);
  }

  async searchReports(name: string): Promise<void> {
    await this.searchBar.click();
    await this.searchBar.press('Control+A');
    await this.searchBar.press('Backspace');
    await this.searchBar.pressSequentially(name, { delay: 10 });
    await this.searchBar.press('Enter');
    await this.page.waitForTimeout(500);
  }

  async reportRows(): Promise<string[][]> {
    return this.reportTable.locator('tbody tr').evaluateAll((rows) =>
      rows.map((row) => [...(row as HTMLTableRowElement).cells].map((cell) => cell.textContent?.trim() || ''))
    );
  }

  async verifyReportExists(name: string): Promise<void> {
    await this.searchReports(name);
    await expect(this.page.getByText(name)).toBeVisible();
  }
}
