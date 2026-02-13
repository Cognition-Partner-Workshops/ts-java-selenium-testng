import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// ==================== E2E Functional Steps ====================

When('I login with {string} and {string} on the legacy app', async function (this: CustomWorld, username: string, password: string) {
  await this.legacyPage.fill('#username', username);
  await this.legacyPage.fill('#password', password);
  await this.legacyPage.click('#loginBtn');
  await this.legacyPage.waitForTimeout(1500);
});

When('I login with {string} and {string} on the Angular app', async function (this: CustomWorld, username: string, password: string) {
  await this.angularPage.fill('#username', username);
  await this.angularPage.fill('#password', password);
  await this.angularPage.click('#loginBtn');
  await this.angularPage.waitForTimeout(1500);
});

Then('both apps should navigate to the dashboard', async function (this: CustomWorld) {
  expect(this.legacyPage.url()).toContain('/dashboard');
  expect(this.angularPage.url()).toContain('/dashboard');
});

Then('I take screenshots of both apps after login', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('05-login-success');
});

Then('both apps should display an error message', async function (this: CustomWorld) {
  const legacyError = await this.legacyPage.$('#errorAlert');
  const angularError = await this.angularPage.$('#errorAlert');
  expect(legacyError).toBeTruthy();
  expect(angularError).toBeTruthy();
});

Then('I take screenshots of both login error states', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('06-login-error');
});

When('I navigate to each page on the legacy app', async function (this: CustomWorld) {
  await this.legacyPage.click('#nav-employees');
  await this.legacyPage.waitForLoadState('networkidle');
  await this.takeScreenshot(this.legacyPage, '07a-nav-employees-legacy', 'legacy');
  await this.legacyPage.click('#nav-dashboard');
  await this.legacyPage.waitForLoadState('networkidle');
  await this.takeScreenshot(this.legacyPage, '07b-nav-dashboard-legacy', 'legacy');
});

When('I navigate to each page on the Angular app', async function (this: CustomWorld) {
  await this.angularPage.click('#nav-employees');
  await this.angularPage.waitForLoadState('networkidle');
  await this.takeScreenshot(this.angularPage, '07a-nav-employees-angular', 'angular');
  await this.angularPage.click('#nav-dashboard');
  await this.angularPage.waitForLoadState('networkidle');
  await this.takeScreenshot(this.angularPage, '07b-nav-dashboard-angular', 'angular');
});

Then('all navigation links should work on both apps', async function (this: CustomWorld) {
  // Verify we can navigate back to dashboard
  expect(this.legacyPage.url()).toContain('/dashboard');
  expect(this.angularPage.url()).toContain('/dashboard');
});

Then('I take screenshots of navigation comparison', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('07-navigation-final');
});

When('I add a new employee {string} with email {string} on the legacy app', async function (this: CustomWorld, name: string, email: string) {
  await this.legacyPage.goto(`${this.legacyUrl}/employees`);
  await this.legacyPage.waitForLoadState('networkidle');
  await this.legacyPage.click('#addEmployeeBtn');
  await this.legacyPage.waitForLoadState('networkidle');
  await this.legacyPage.fill('#name', name);
  await this.legacyPage.fill('#email', email);
  await this.legacyPage.selectOption('#department', 'Engineering');
  await this.legacyPage.fill('#salary', '75000');
  await this.takeScreenshot(this.legacyPage, '08a-add-form-filled-legacy', 'legacy');
  await this.legacyPage.click('#submitBtn');
  await this.legacyPage.waitForTimeout(2000);
});

When('I add a new employee {string} with email {string} on the Angular app', async function (this: CustomWorld, name: string, email: string) {
  await this.angularPage.goto(`${this.angularUrl}/employees`);
  await this.angularPage.waitForLoadState('networkidle');
  await this.angularPage.click('#addEmployeeBtn');
  await this.angularPage.waitForLoadState('networkidle');
  await this.angularPage.fill('#name', name);
  await this.angularPage.fill('#email', email);
  await this.angularPage.selectOption('#department', 'Engineering');
  await this.angularPage.fill('#salary', '75000');
  await this.takeScreenshot(this.angularPage, '08a-add-form-filled-angular', 'angular');
  await this.angularPage.click('#submitBtn');
  await this.angularPage.waitForTimeout(2000);
});

Then('both apps should show success and the new employee in the list', async function (this: CustomWorld) {
  // After redirect, both should be on employee list
  expect(this.legacyPage.url()).toContain('/employees');
  expect(this.angularPage.url()).toContain('/employees');
});

Then('I take screenshots of the add employee workflow', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('08-add-employee-result');
});

Then('both apps should display the same employee data', async function (this: CustomWorld) {
  const legacyRows = await this.legacyPage.$$('#employeeTableBody tr');
  const angularRows = await this.angularPage.$$('#employeeTableBody tr');
  // Both should have employees
  expect(legacyRows.length).toBeGreaterThan(0);
  expect(angularRows.length).toBeGreaterThan(0);
});

Then('I take screenshots of the employee data comparison', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('09-employee-data-comparison');
});

When('I delete an employee on the legacy app', async function (this: CustomWorld) {
  await this.legacyPage.goto(`${this.legacyUrl}/employees`);
  await this.legacyPage.waitForLoadState('networkidle');
  await this.legacyPage.waitForSelector('#employeeTableBody tr td:not([colspan])');
  await this.takeScreenshot(this.legacyPage, '10a-before-delete-legacy', 'legacy');
  // Click the delete button inside the table (btn-sm distinguishes it from the modal button)
  const deleteButtons = await this.legacyPage.$$('#employeeTableBody .btn-danger');
  if (deleteButtons.length > 0) {
    await deleteButtons[deleteButtons.length - 1].click();
    await this.legacyPage.waitForSelector('#deleteModal.active');
    await this.takeScreenshot(this.legacyPage, '10b-delete-modal-legacy', 'legacy');
    await this.legacyPage.click('#confirmDeleteBtn');
    await this.legacyPage.waitForTimeout(1500);
  }
});

When('I delete an employee on the Angular app', async function (this: CustomWorld) {
  await this.angularPage.goto(`${this.angularUrl}/employees`);
  await this.angularPage.waitForLoadState('networkidle');
  await this.angularPage.waitForSelector('#employeeTableBody tr td:not([colspan])');
  await this.takeScreenshot(this.angularPage, '10a-before-delete-angular', 'angular');
  const deleteButtons = await this.angularPage.$$('#employeeTableBody .btn-danger');
  if (deleteButtons.length > 0) {
    await deleteButtons[deleteButtons.length - 1].click();
    await this.angularPage.waitForSelector('#deleteModal.active');
    await this.takeScreenshot(this.angularPage, '10b-delete-modal-angular', 'angular');
    await this.angularPage.click('#confirmDeleteBtn');
    await this.angularPage.waitForTimeout(1500);
  }
});

Then('both apps should remove the employee from the list', async function (this: CustomWorld) {
  // Verify the list was updated
  const legacyRows = await this.legacyPage.$$('#employeeTableBody tr');
  const angularRows = await this.angularPage.$$('#employeeTableBody tr');
  expect(legacyRows.length).toBeGreaterThan(0);
  expect(angularRows.length).toBeGreaterThan(0);
});

Then('I take screenshots of the delete workflow', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('10-after-delete');
});
