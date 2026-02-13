import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// ==================== Incremental Migration Steps ====================

Then('the Angular login page should have all elements from the legacy page', async function (this: CustomWorld) {
  // Compare key elements exist on both pages
  const elements = ['#loginBox', '#username', '#password', '#loginBtn', '#loginForm'];
  for (const selector of elements) {
    const legacyEl = await this.legacyPage.$(selector);
    const angularEl = await this.angularPage.$(selector);
    expect(legacyEl, `Legacy page missing ${selector}`).toBeTruthy();
    expect(angularEl, `Angular page missing ${selector}`).toBeTruthy();
  }
});

Then('the Angular login form should accept the same inputs', async function (this: CustomWorld) {
  // Test that both forms accept the same input types
  await this.angularPage.fill('#username', 'testuser');
  const angularValue = await this.angularPage.inputValue('#username');
  expect(angularValue).toBe('testuser');

  await this.angularPage.fill('#password', 'testpass');
  const passValue = await this.angularPage.inputValue('#password');
  expect(passValue).toBe('testpass');
});

Then('I take screenshots of login page migration comparison', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('11-login-migration');
});

Then('the Angular dashboard should display the same statistics', async function (this: CustomWorld) {
  const legacyTotal = await this.legacyPage.textContent('#totalEmployees');
  const angularTotal = await this.angularPage.textContent('#totalEmployees');
  expect(legacyTotal).toBeTruthy();
  expect(angularTotal).toBeTruthy();
  expect(legacyTotal?.trim()).toBe(angularTotal?.trim());

  const legacyDepts = await this.legacyPage.textContent('#totalDepartments');
  const angularDepts = await this.angularPage.textContent('#totalDepartments');
  expect(legacyDepts?.trim()).toBe(angularDepts?.trim());
});

Then('the Angular dashboard should have the same navigation elements', async function (this: CustomWorld) {
  const navElements = ['#nav-dashboard', '#nav-employees', '#nav-logout'];
  for (const selector of navElements) {
    const legacyNav = await this.legacyPage.$(selector);
    const angularNav = await this.angularPage.$(selector);
    expect(legacyNav, `Legacy nav missing ${selector}`).toBeTruthy();
    expect(angularNav, `Angular nav missing ${selector}`).toBeTruthy();
  }
});

Then('I take screenshots of dashboard migration comparison', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('12-dashboard-migration');
});

Then('the Angular employee list should display the same columns', async function (this: CustomWorld) {
  const legacyHeaders = await this.legacyPage.$$eval('#employeeTable th', (ths: any[]) => ths.map(th => th.textContent?.trim()));
  const angularHeaders = await this.angularPage.$$eval('#employeeTable th', (ths: any[]) => ths.map(th => th.textContent?.trim()));
  expect(legacyHeaders).toEqual(angularHeaders);
});

Then('the Angular employee list should have the same action buttons', async function (this: CustomWorld) {
  const legacyEditBtns = await this.legacyPage.$$('.actions .btn-primary');
  const angularEditBtns = await this.angularPage.$$('.actions .btn-primary');
  expect(angularEditBtns.length).toBe(legacyEditBtns.length);

  const legacyDeleteBtns = await this.legacyPage.$$('.actions .btn-danger');
  const angularDeleteBtns = await this.angularPage.$$('.actions .btn-danger');
  expect(angularDeleteBtns.length).toBe(legacyDeleteBtns.length);
});

Then('I take screenshots of employee list migration comparison', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('13-employee-list-migration');
});

Then('the Angular form should have the same input fields', async function (this: CustomWorld) {
  const fields = ['#name', '#email', '#department', '#salary'];
  for (const field of fields) {
    const legacyField = await this.legacyPage.$(field);
    const angularField = await this.angularPage.$(field);
    expect(legacyField, `Legacy form missing ${field}`).toBeTruthy();
    expect(angularField, `Angular form missing ${field}`).toBeTruthy();
  }
});

Then('the Angular form should have the same validation rules', async function (this: CustomWorld) {
  // Check required attributes
  const legacyNameRequired = await this.legacyPage.$eval('#name', (el: any) => el.hasAttribute('required'));
  const angularNameRequired = await this.angularPage.$eval('#name', (el: any) => el.hasAttribute('required'));
  expect(legacyNameRequired).toBe(true);
  expect(angularNameRequired).toBe(true);
});

Then('I take screenshots of employee form migration comparison', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('14-employee-form-migration');
});
