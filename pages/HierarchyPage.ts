import { Page, Locator, expect } from '@playwright/test';
import { generateUniqueName, readNotificationMessage } from '../utils/helpers';

export class HierarchyPage {
  readonly page: Page;
  readonly addCategoryButton: Locator;
  readonly addComponentButton: Locator;
  readonly addAttributeButton: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly hierarchyTree: Locator;
  readonly searchBar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addCategoryButton = page.getByRole('button', { name: /add category/i }).or(
      page.locator('button.fa-plus-circle')
    ).first();
    this.addComponentButton = page.getByRole('button', { name: /add component/i }).first();
    this.addAttributeButton = page.getByRole('button', { name: /add attribute/i }).first();
    this.nameInput = page.locator('#name').or(page.locator('input[name="name"]')).first();
    this.saveButton = page.getByRole('button', { name: /^Save$/i });
    this.cancelButton = page.locator('#btnCancel').or(page.getByRole('button', { name: /Cancel/i })).first();
    this.hierarchyTree = page.locator('.tree, [class*="hierarchy"], [class*="tree"]').first();
    this.searchBar = page.locator('#search-bar-0');
  }

  async createCategory(name?: string): Promise<string> {
    const categoryName = name || generateUniqueName('Category');
    await this.addCategoryButton.click();
    await expect(this.nameInput).toBeVisible();
    await this.nameInput.fill(categoryName);
    await this.saveButton.click();
    await this.page.waitForTimeout(1000);
    return categoryName;
  }

  async createComponent(parentCategory: string, name?: string): Promise<string> {
    const componentName = name || generateUniqueName('Component');
    await this.page.getByText(parentCategory).first().click();
    await this.addComponentButton.click();
    await expect(this.nameInput).toBeVisible();
    await this.nameInput.fill(componentName);
    await this.saveButton.click();
    await this.page.waitForTimeout(1000);
    return componentName;
  }

  async createAttribute(parentComponent: string, name?: string): Promise<string> {
    const attributeName = name || generateUniqueName('Attribute');
    await this.page.getByText(parentComponent).first().click();
    await this.addAttributeButton.click();
    await expect(this.nameInput).toBeVisible();
    await this.nameInput.fill(attributeName);
    await this.saveButton.click();
    await this.page.waitForTimeout(1000);
    return attributeName;
  }

  async verifyHierarchyNodeExists(nodeName: string): Promise<void> {
    await expect(this.page.getByText(nodeName)).toBeVisible();
  }
}
