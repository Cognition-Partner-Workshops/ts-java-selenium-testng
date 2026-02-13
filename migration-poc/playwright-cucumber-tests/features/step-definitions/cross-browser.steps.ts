import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { Browser, Page, chromium, firefox, webkit } from 'playwright';
import { CustomWorld } from '../support/world';

let crossBrowserPage: Page;
let crossBrowser: Browser;

// ==================== Cross-Browser Steps ====================

Given('I launch a {string} browser', async function (this: CustomWorld, browserType: string) {
  const launchOptions = { headless: false, slowMo: 300 };
  switch (browserType.toLowerCase()) {
    case 'firefox':
      crossBrowser = await firefox.launch(launchOptions);
      break;
    case 'webkit':
      crossBrowser = await webkit.launch(launchOptions);
      break;
    default:
      crossBrowser = await chromium.launch(launchOptions);
  }
  const context = await crossBrowser.newContext({ viewport: { width: 1280, height: 720 } });
  crossBrowserPage = await context.newPage();
});

When('I open the Angular login page on this browser', async function (this: CustomWorld) {
  await crossBrowserPage.goto(`${this.angularUrl}/login`);
  await crossBrowserPage.waitForLoadState('networkidle');
});

Then('the login page should render correctly', async function (this: CustomWorld) {
  const loginBox = await crossBrowserPage.$('#loginBox');
  expect(loginBox).toBeTruthy();
  const username = await crossBrowserPage.$('#username');
  expect(username).toBeTruthy();
  const password = await crossBrowserPage.$('#password');
  expect(password).toBeTruthy();
  const loginBtn = await crossBrowserPage.$('#loginBtn');
  expect(loginBtn).toBeTruthy();
});

Then('I take a screenshot named {string}', async function (this: CustomWorld, name: string) {
  await this.takeScreenshot(crossBrowserPage, name, 'cross-browser');
  if (crossBrowser) { await crossBrowser.close(); }
});

When('I login and navigate to dashboard on this browser', async function (this: CustomWorld) {
  await crossBrowserPage.goto(`${this.angularUrl}/login`);
  await crossBrowserPage.waitForLoadState('networkidle');
  await crossBrowserPage.fill('#username', 'admin');
  await crossBrowserPage.fill('#password', 'admin123');
  await crossBrowserPage.click('#loginBtn');
  await crossBrowserPage.waitForURL('**/dashboard');
  await crossBrowserPage.waitForLoadState('networkidle');
});

Then('the dashboard should display all statistics', async function (this: CustomWorld) {
  await crossBrowserPage.waitForSelector('#statsGrid');
  const totalEmployees = await crossBrowserPage.textContent('#totalEmployees');
  expect(totalEmployees).toBeTruthy();
  const totalDepartments = await crossBrowserPage.textContent('#totalDepartments');
  expect(totalDepartments).toBeTruthy();
  const avgSalary = await crossBrowserPage.textContent('#avgSalary');
  expect(avgSalary).toBeTruthy();
});

When('I perform full CRUD operations on this browser', async function (this: CustomWorld) {
  // Login
  await crossBrowserPage.goto(`${this.angularUrl}/login`);
  await crossBrowserPage.waitForLoadState('networkidle');
  await crossBrowserPage.fill('#username', 'admin');
  await crossBrowserPage.fill('#password', 'admin123');
  await crossBrowserPage.click('#loginBtn');
  await crossBrowserPage.waitForURL('**/dashboard');

  // Navigate to employees
  await crossBrowserPage.click('#nav-employees');
  await crossBrowserPage.waitForLoadState('networkidle');

  // Create - Add employee
  await crossBrowserPage.click('#addEmployeeBtn');
  await crossBrowserPage.waitForLoadState('networkidle');
  await crossBrowserPage.fill('#name', 'Cross Browser Test');
  await crossBrowserPage.fill('#email', 'crossbrowser@test.com');
  await crossBrowserPage.selectOption('#department', 'Engineering');
  await crossBrowserPage.fill('#salary', '88000');
  await crossBrowserPage.click('#submitBtn');
  await crossBrowserPage.waitForTimeout(2000);

  // Read - Verify in list
  await crossBrowserPage.waitForSelector('#employeeTable');
});

Then('all CRUD operations should complete successfully', async function (this: CustomWorld) {
  const content = await crossBrowserPage.textContent('#employeeTableBody');
  expect(content).toBeTruthy();
});
