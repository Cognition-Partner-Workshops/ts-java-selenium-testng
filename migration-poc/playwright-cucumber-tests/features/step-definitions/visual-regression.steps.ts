import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// ==================== Visual Regression Steps ====================

Given('I open the legacy .NET login page', async function (this: CustomWorld) {
  await this.legacyPage.goto(`${this.legacyUrl}/login`);
  await this.legacyPage.waitForLoadState('networkidle');
});

Given('I open the Angular login page', async function (this: CustomWorld) {
  await this.angularPage.goto(`${this.angularUrl}/login`);
  await this.angularPage.waitForLoadState('networkidle');
});

Given('I am logged into the legacy .NET application', async function (this: CustomWorld) {
  await this.legacyPage.goto(`${this.legacyUrl}/login`);
  await this.legacyPage.waitForLoadState('networkidle');
  await this.legacyPage.fill('#username', 'admin');
  await this.legacyPage.fill('#password', 'admin123');
  await this.legacyPage.click('#loginBtn');
  await this.legacyPage.waitForURL('**/dashboard');
  await this.legacyPage.waitForLoadState('networkidle');
});

Given('I am logged into the Angular application', async function (this: CustomWorld) {
  await this.angularPage.goto(`${this.angularUrl}/login`);
  await this.angularPage.waitForLoadState('networkidle');
  await this.angularPage.fill('#username', 'admin');
  await this.angularPage.fill('#password', 'admin123');
  await this.angularPage.click('#loginBtn');
  await this.angularPage.waitForURL('**/dashboard');
  await this.angularPage.waitForLoadState('networkidle');
});

When('I take screenshots of both login pages', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('01-login-page');
});

When('I navigate to the dashboard on both apps', async function (this: CustomWorld) {
  // Already on dashboard after login
  await this.legacyPage.waitForSelector('#statsGrid');
  await this.angularPage.waitForSelector('#statsGrid');
});

When('I take screenshots of both dashboard pages', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('02-dashboard-page');
});

When('I navigate to the employee list on both apps', async function (this: CustomWorld) {
  await this.legacyPage.click('#nav-employees');
  await this.legacyPage.waitForLoadState('networkidle');
  await this.angularPage.click('#nav-employees');
  await this.angularPage.waitForLoadState('networkidle');
});

When('I take screenshots of both employee list pages', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('03-employee-list-page');
});

When('I navigate to the add employee form on both apps', async function (this: CustomWorld) {
  await this.legacyPage.goto(`${this.legacyUrl}/employees`);
  await this.legacyPage.waitForLoadState('networkidle');
  await this.legacyPage.click('#addEmployeeBtn');
  await this.legacyPage.waitForLoadState('networkidle');

  await this.angularPage.goto(`${this.angularUrl}/employees`);
  await this.angularPage.waitForLoadState('networkidle');
  await this.angularPage.click('#addEmployeeBtn');
  await this.angularPage.waitForLoadState('networkidle');
});

When('I take screenshots of both employee form pages', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('04-employee-form-page');
});

Then('both login pages should have similar visual structure', async function (this: CustomWorld) {
  // Verify both pages have the same key elements
  const legacyLoginBox = await this.legacyPage.$('#loginBox');
  const angularLoginBox = await this.angularPage.$('#loginBox');
  expect(legacyLoginBox).toBeTruthy();
  expect(angularLoginBox).toBeTruthy();

  const legacyUsername = await this.legacyPage.$('#username');
  const angularUsername = await this.angularPage.$('#username');
  expect(legacyUsername).toBeTruthy();
  expect(angularUsername).toBeTruthy();
});

Then('screenshots should be saved for comparison', async function (this: CustomWorld) {
  // Screenshots already saved during When steps
  console.log('Screenshots saved successfully for visual comparison');
});

Then('both dashboards should display stats cards', async function (this: CustomWorld) {
  const legacyStats = await this.legacyPage.$('#statsGrid');
  const angularStats = await this.angularPage.$('#statsGrid');
  expect(legacyStats).toBeTruthy();
  expect(angularStats).toBeTruthy();

  const legacyTotal = await this.legacyPage.textContent('#totalEmployees');
  const angularTotal = await this.angularPage.textContent('#totalEmployees');
  expect(legacyTotal).toBeTruthy();
  expect(angularTotal).toBeTruthy();
});

Then('both pages should display an employee table', async function (this: CustomWorld) {
  const legacyTable = await this.legacyPage.$('#employeeTable');
  const angularTable = await this.angularPage.$('#employeeTable');
  expect(legacyTable).toBeTruthy();
  expect(angularTable).toBeTruthy();
});

Then('both forms should have name, email, department, and salary fields', async function (this: CustomWorld) {
  for (const page of [this.legacyPage, this.angularPage]) {
    expect(await page.$('#name')).toBeTruthy();
    expect(await page.$('#email')).toBeTruthy();
    expect(await page.$('#department')).toBeTruthy();
    expect(await page.$('#salary')).toBeTruthy();
  }
});
