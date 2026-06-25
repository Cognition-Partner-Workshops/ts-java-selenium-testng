import { Page, Locator, expect } from '@playwright/test';
import { generateUniqueName, readNotificationMessage } from '../utils/helpers';

export class PlansPage {
  readonly page: Page;
  readonly addButton: Locator;
  readonly saveButton: Locator;
  readonly planTable: Locator;
  readonly searchBar: Locator;
  readonly deleteButton: Locator;
  readonly exportButton: Locator;
  readonly massStatusButton: Locator;
  readonly advanceSearchButton: Locator;
  readonly contextFilter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addButton = page.locator('button.fa-plus-circle').or(
      page.getByRole('button', { name: /add|\+/i })
    ).first();
    this.saveButton = page.getByRole('button', { name: /^Save$/i });
    this.planTable = page.locator('table').first();
    this.searchBar = page.locator('#search-bar-0');
    this.deleteButton = page.locator('button.tableRowDelete').or(
      page.getByRole('button', { name: /delete/i })
    ).first();
    this.exportButton = page.getByRole('button', { name: /export/i }).first();
    this.massStatusButton = page.getByRole('button', { name: /mass status|bulk/i }).first();
    this.advanceSearchButton = page.getByRole('button', { name: /advance|advanced/i }).first();
    this.contextFilter = page.locator('select[name*="context"], #contextFilter').first();
  }

  async searchPlans(name: string): Promise<void> {
    await this.searchBar.click();
    await this.searchBar.press('Control+A');
    await this.searchBar.press('Backspace');
    await this.searchBar.pressSequentially(name, { delay: 10 });
    await this.searchBar.press('Enter');
    await this.page.waitForTimeout(500);
  }

  async planRows(): Promise<string[][]> {
    return this.planTable.locator('tbody tr').evaluateAll((rows) =>
      rows.map((row) => [...(row as HTMLTableRowElement).cells].map((cell) => cell.textContent?.trim() || ''))
    );
  }

  async createPlan(planName?: string): Promise<{ name: string; message: string }> {
    const name = planName || generateUniqueName('Plan');
    await this.addButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    const nameInput = this.page.locator('#name, #planName, input[name="name"]').first();
    if (await nameInput.isVisible().catch(() => false)) {
      await nameInput.fill(name);
    }
    await this.saveButton.click();
    const message = await readNotificationMessage(this.page);
    return { name, message };
  }

  async editPlan(planName: string): Promise<void> {
    await this.searchPlans(planName);
    const row = this.planTable.locator('tbody tr').filter({ hasText: planName }).first();
    await row.locator('button.edit, [title*="edit" i]').first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async copyPlan(planName: string): Promise<string> {
    await this.searchPlans(planName);
    const row = this.planTable.locator('tbody tr').filter({ hasText: planName }).first();
    await row.locator('button.copy, [title*="copy" i]').first().click();
    await this.saveButton.click();
    return readNotificationMessage(this.page);
  }

  async createNewVersion(planName: string): Promise<string> {
    await this.searchPlans(planName);
    const row = this.planTable.locator('tbody tr').filter({ hasText: planName }).first();
    await row.locator('button.version, [title*="version" i]').first().click();
    await this.saveButton.click();
    return readNotificationMessage(this.page);
  }

  async deletePlan(planName: string): Promise<void> {
    await this.searchPlans(planName);
    const row = this.planTable.locator('tbody tr').filter({ hasText: planName }).first();
    await row.locator('input[type="checkbox"], input.selection-input-4').first().check();
    const dialogPromise = this.page.waitForEvent('dialog', { timeout: 2_000 })
      .then(async (dialog) => { await dialog.accept(); return dialog.message(); })
      .catch(() => '');
    await this.deleteButton.click();
    await dialogPromise;
    const confirmBtn = this.page.getByRole('button', { name: /^(Yes|OK|Confirm|Delete)$/i }).last();
    if (await confirmBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await confirmBtn.click();
    }
    await this.page.waitForTimeout(1000);
  }

  async filterByStatus(status: string): Promise<void> {
    await this.page.getByText(status, { exact: true }).first().click();
    await this.page.waitForTimeout(500);
  }

  async filterByContext(contextName: string): Promise<void> {
    await this.contextFilter.selectOption(contextName);
    await this.page.waitForTimeout(500);
  }

  async advanceSearch(searchTerm: string): Promise<void> {
    await this.advanceSearchButton.click();
    const searchInput = this.page.locator('input[type="search"], input[placeholder*="search" i]').first();
    await searchInput.fill(searchTerm);
    await this.page.getByRole('button', { name: /search|apply/i }).first().click();
    await this.page.waitForTimeout(500);
  }

  async submitForReview(): Promise<string> {
    await this.page.getByRole('button', { name: /submit for review/i }).first().click();
    const commentInput = this.page.locator('textarea, input[name*="comment"]').first();
    if (await commentInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await commentInput.fill('Automated test - submit for review');
      await this.page.getByRole('button', { name: /submit|confirm|ok/i }).first().click();
    }
    return readNotificationMessage(this.page);
  }

  async approve(): Promise<string> {
    await this.page.getByRole('button', { name: /approve/i }).first().click();
    const commentInput = this.page.locator('textarea, input[name*="comment"]').first();
    if (await commentInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await commentInput.fill('Automated test - approved');
      await this.page.getByRole('button', { name: /submit|confirm|ok/i }).first().click();
    }
    return readNotificationMessage(this.page);
  }

  async publish(): Promise<string> {
    await this.page.getByRole('button', { name: /publish/i }).first().click();
    const commentInput = this.page.locator('textarea, input[name*="comment"]').first();
    if (await commentInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await commentInput.fill('Automated test - published');
      await this.page.getByRole('button', { name: /submit|confirm|ok/i }).first().click();
    }
    return readNotificationMessage(this.page);
  }

  async reject(): Promise<string> {
    await this.page.getByRole('button', { name: /reject/i }).first().click();
    const commentInput = this.page.locator('textarea, input[name*="comment"]').first();
    if (await commentInput.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await commentInput.fill('Automated test - rejected');
      await this.page.getByRole('button', { name: /submit|confirm|ok/i }).first().click();
    }
    return readNotificationMessage(this.page);
  }

  async getStatusDot(planName: string): Promise<Locator> {
    const row = this.planTable.locator('tbody tr').filter({ hasText: planName }).first();
    return row.locator('.status-dot, [class*="status"], .dot').first();
  }

  async massStatusUpdate(): Promise<void> {
    await this.massStatusButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async exportPlans(format: string): Promise<void> {
    await this.exportButton.click();
    await this.page.getByText(format, { exact: false }).first().click();
    const proceedBtn = this.page.getByRole('button', { name: /proceed|export|download/i }).first();
    if (await proceedBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await proceedBtn.click();
    }
    await this.page.waitForTimeout(2000);
  }
}
