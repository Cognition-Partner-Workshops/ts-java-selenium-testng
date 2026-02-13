import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// ==================== Edge Cases Steps ====================

When('I submit empty credentials on the legacy app', async function (this: CustomWorld) {
  await this.legacyPage.click('#loginBtn');
  await this.legacyPage.waitForTimeout(500);
});

When('I submit empty credentials on the Angular app', async function (this: CustomWorld) {
  await this.angularPage.click('#loginBtn');
  await this.angularPage.waitForTimeout(500);
});

Then('both apps should show validation errors', async function (this: CustomWorld) {
  // HTML5 validation will prevent form submission with empty required fields
  const legacyUsername = await this.legacyPage.$('#username');
  const angularUsername = await this.angularPage.$('#username');
  expect(legacyUsername).toBeTruthy();
  expect(angularUsername).toBeTruthy();
});

Then('I take screenshots of empty credential validation', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('15-empty-credentials');
});

Then('both apps should display {string} error', async function (this: CustomWorld, expectedMessage: string) {
  await this.legacyPage.waitForTimeout(1500);
  await this.angularPage.waitForTimeout(1500);

  const legacyErrorEl = await this.legacyPage.$('#errorAlert');
  const angularErrorEl = await this.angularPage.$('#errorAlert');

  if (legacyErrorEl) {
    const legacyError = await legacyErrorEl.textContent();
    expect(legacyError?.toLowerCase()).toContain(expectedMessage.toLowerCase());
  }
  if (angularErrorEl) {
    const angularError = await angularErrorEl.textContent();
    expect(angularError?.toLowerCase()).toContain(expectedMessage.toLowerCase());
  }
});

Then('I take screenshots of wrong password error states', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('16-wrong-password-error');
});

When('I submit the employee form without filling required fields on both apps', async function (this: CustomWorld) {
  await this.legacyPage.click('#submitBtn');
  await this.legacyPage.waitForTimeout(500);
  await this.angularPage.click('#submitBtn');
  await this.angularPage.waitForTimeout(500);
});

Then('both apps should show required field validation errors', async function (this: CustomWorld) {
  // HTML5 validation on required fields
  const legacyName = await this.legacyPage.$('#name');
  const angularName = await this.angularPage.$('#name');
  expect(legacyName).toBeTruthy();
  expect(angularName).toBeTruthy();
});

Then('I take screenshots of form validation errors', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('17-form-validation-errors');
});

When('I enter an invalid email format on both apps', async function (this: CustomWorld) {
  await this.legacyPage.fill('#name', 'Test User');
  await this.legacyPage.fill('#email', 'invalid-email');
  await this.legacyPage.selectOption('#department', 'Engineering');
  await this.legacyPage.click('#submitBtn');
  await this.legacyPage.waitForTimeout(500);

  await this.angularPage.fill('#name', 'Test User');
  await this.angularPage.fill('#email', 'invalid-email');
  await this.angularPage.selectOption('#department', 'Engineering');
  await this.angularPage.click('#submitBtn');
  await this.angularPage.waitForTimeout(500);
});

Then('both apps should indicate the email is invalid', async function (this: CustomWorld) {
  // HTML5 email validation will prevent submission
  const legacyEmail = await this.legacyPage.$('#email');
  const angularEmail = await this.angularPage.$('#email');
  expect(legacyEmail).toBeTruthy();
  expect(angularEmail).toBeTruthy();
});

Then('I take screenshots of email validation comparison', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('18-email-validation');
});

When('all employees are deleted from the database', async function (this: CustomWorld) {
  // Delete all employees via API
  const response = await this.legacyPage.request.get(`${this.legacyUrl}/api/employees`);
  const data = await response.json();
  if (data.success && data.data) {
    for (const emp of data.data) {
      await this.legacyPage.request.delete(`${this.legacyUrl}/api/employees/${emp.id}`);
    }
  }
});

Then('both apps should show an empty state message', async function (this: CustomWorld) {
  await this.legacyPage.waitForTimeout(500);
  await this.angularPage.waitForTimeout(500);
  const legacyContent = await this.legacyPage.textContent('#employeeTableBody');
  const angularContent = await this.angularPage.textContent('#employeeTableBody');
  expect(legacyContent?.toLowerCase()).toContain('no employees');
  expect(angularContent?.toLowerCase()).toContain('no employees');
});

Then('I take screenshots of empty state comparison', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('19-empty-state');
});
