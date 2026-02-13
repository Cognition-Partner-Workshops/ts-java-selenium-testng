import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';

Given('I navigate to login page', async function () {
  const loginPage = new LoginPage(this['page']);
  await loginPage.navigate();
});

When('I enter valid username and password', async function () {
  const loginPage = new LoginPage(this['page']);
  await loginPage.enterUsername('admin');
  await loginPage.enterPassword('password123');
});

When('I enter invalid credentials', async function () {
  const loginPage = new LoginPage(this['page']);
  await loginPage.enterUsername('wronguser');
  await loginPage.enterPassword('wrongpass');
});

When('I click on login button', async function () {
  const loginPage = new LoginPage(this['page']);
  await loginPage.clickLogin();
});

When('I click on logout button', async function () {
  const dashboardPage = new DashboardPage(this['page']);
  await dashboardPage.clickLogout();
});

Then('I should see the dashboard page', async function () {
  const dashboardPage = new DashboardPage(this['page']);
  const isOnDashboard = await dashboardPage.isOnDashboardPage();
  expect(isOnDashboard).toBeTruthy();

  const welcomeMessage = await dashboardPage.getWelcomeMessage();
  expect(welcomeMessage).toContain('Welcome');
});

Then('I should see an error message', async function () {
  const loginPage = new LoginPage(this['page']);
  const isVisible = await loginPage.isErrorMessageVisible();
  expect(isVisible).toBeTruthy();

  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toContain('Invalid username or password');
});

Then('I should see validation errors', async function () {
  const loginPage = new LoginPage(this['page']);
  const usernameErrorVisible = await loginPage.isUsernameErrorVisible();
  const passwordErrorVisible = await loginPage.isPasswordErrorVisible();
  expect(usernameErrorVisible || passwordErrorVisible).toBeTruthy();
});

Then('I should be redirected to login page', async function () {
  const loginPage = new LoginPage(this['page']);
  const isOnLogin = await loginPage.isOnLoginPage();
  expect(isOnLogin).toBeTruthy();
});
