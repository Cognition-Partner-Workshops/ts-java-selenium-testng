import { Page, Locator, expect } from '@playwright/test';

export class RolesAndPrivilegesPage {
  readonly page: Page;
  readonly rolesTable: Locator;
  readonly addButton: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;
  readonly searchBar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.rolesTable = page.locator('table').first();
    this.addButton = page.locator('button.fa-plus-circle').or(
      page.getByRole('button', { name: /add|\+/i })
    ).first();
    this.nameInput = page.locator('#name').or(page.locator('input[name="name"]')).first();
    this.saveButton = page.getByRole('button', { name: /^Save$/i });
    this.searchBar = page.locator('#search-bar-0');
  }

  async verifyRolesLoaded(): Promise<void> {
    await expect(this.rolesTable).toBeVisible();
  }

  async roleRows(): Promise<string[][]> {
    return this.rolesTable.locator('tbody tr').evaluateAll((rows) =>
      rows.map((row) => [...(row as HTMLTableRowElement).cells].map((cell) => cell.textContent?.trim() || ''))
    );
  }

  async verifyRoleExists(roleName: string): Promise<string[] | undefined> {
    const rows = await this.roleRows();
    return rows.find((row) => row.some((cell) => cell.includes(roleName)));
  }

  async verifyUserRole(username: string, expectedRole: string): Promise<void> {
    await expect(this.page.getByText(expectedRole)).toBeVisible();
  }

  async verifyPermission(permission: string): Promise<boolean> {
    const permissionLocator = this.page.getByText(permission, { exact: false });
    return permissionLocator.isVisible();
  }

  async verifyCheckboxState(permission: string, expected: boolean): Promise<void> {
    const row = this.rolesTable.locator('tbody tr').filter({ hasText: permission }).first();
    const checkbox = row.locator('input[type="checkbox"]').first();
    if (expected) {
      await expect(checkbox).toBeChecked();
    } else {
      await expect(checkbox).not.toBeChecked();
    }
  }
}
