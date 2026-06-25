import { Page, Locator, expect } from '@playwright/test';

export class MyWorkQueuePage {
  readonly page: Page;
  readonly workQueueTable: Locator;
  readonly searchBar: Locator;
  readonly statusFilter: Locator;
  readonly contextFilter: Locator;
  readonly pageSizeDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.workQueueTable = page.locator('table').first();
    this.searchBar = page.locator('#search-bar-0');
    this.statusFilter = page.locator('select[name*="status"], #statusFilter').first();
    this.contextFilter = page.locator('select[name*="context"], #contextFilter').first();
    this.pageSizeDropdown = page.locator('#dropdown-size-small').first();
  }

  async searchWorkQueue(name: string): Promise<void> {
    await this.searchBar.click();
    await this.searchBar.press('Control+A');
    await this.searchBar.press('Backspace');
    await this.searchBar.pressSequentially(name, { delay: 10 });
    await this.searchBar.press('Enter');
    await this.page.waitForTimeout(500);
  }

  async workQueueRows(): Promise<string[][]> {
    return this.workQueueTable.locator('tbody tr').evaluateAll((rows) =>
      rows.map((row) => [...(row as HTMLTableRowElement).cells].map((cell) => cell.textContent?.trim() || ''))
    );
  }

  async verifyWorkQueueLoaded(): Promise<void> {
    await expect(this.workQueueTable).toBeVisible();
  }

  async openPlanFromQueue(planName: string): Promise<void> {
    await this.searchWorkQueue(planName);
    const row = this.workQueueTable.locator('tbody tr').filter({ hasText: planName }).first();
    await row.locator('a, button.edit, [title*="edit" i]').first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async filterByStatus(status: string): Promise<void> {
    await this.statusFilter.selectOption(status);
    await this.page.waitForTimeout(500);
  }

  async filterByContext(contextName: string): Promise<void> {
    await this.contextFilter.selectOption(contextName);
    await this.page.waitForTimeout(500);
  }

  async verifyPlanInQueue(planName: string): Promise<string[] | undefined> {
    await this.searchWorkQueue(planName);
    const rows = await this.workQueueRows();
    return rows.find((row) => row.some((cell) => cell.includes(planName)));
  }

  async verifyPlanNotInQueue(planName: string): Promise<void> {
    await this.searchWorkQueue(planName);
    await expect.poll(async () => {
      const rows = await this.workQueueRows();
      return rows.some((row) => row.some((cell) => cell.includes(planName)));
    }, { message: `Plan "${planName}" should not be in work queue`, timeout: 10_000 }).toBe(false);
  }
}
