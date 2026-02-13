import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// ==================== Performance Steps ====================

Given('I launch a browser for performance testing', async function (this: CustomWorld) {
  // Browser already launched in hooks
});

When('I measure the load time of the legacy .NET login page', async function (this: CustomWorld) {
  const start = Date.now();
  await this.legacyPage.goto(`${this.legacyUrl}/login`);
  await this.legacyPage.waitForLoadState('networkidle');
  const loadTime = Date.now() - start;
  this.performanceMetrics.set('legacy-login-load', loadTime);
  console.log(`Legacy Login page load time: ${loadTime}ms`);
});

When('I measure the load time of the Angular login page', async function (this: CustomWorld) {
  const start = Date.now();
  await this.angularPage.goto(`${this.angularUrl}/login`);
  await this.angularPage.waitForLoadState('networkidle');
  const loadTime = Date.now() - start;
  this.performanceMetrics.set('angular-login-load', loadTime);
  console.log(`Angular Login page load time: ${loadTime}ms`);
});

Then('both pages should load within {int} seconds', async function (this: CustomWorld, maxSeconds: number) {
  const maxMs = maxSeconds * 1000;
  for (const [key, value] of this.performanceMetrics) {
    if (key.includes('load')) {
      expect(value, `${key} took ${value}ms, exceeding ${maxMs}ms limit`).toBeLessThan(maxMs);
    }
  }
});

Then('I record the performance metrics for comparison', async function (this: CustomWorld) {
  console.log('\n=== Performance Metrics ===');
  for (const [key, value] of this.performanceMetrics) {
    console.log(`  ${key}: ${value}ms`);
  }
  console.log('===========================\n');
});

Then('I take screenshots of both login pages after load', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('20-performance-login');
});

When('I measure the load time of the legacy dashboard', async function (this: CustomWorld) {
  const start = Date.now();
  await this.legacyPage.goto(`${this.legacyUrl}/dashboard`);
  await this.legacyPage.waitForLoadState('networkidle');
  await this.legacyPage.waitForSelector('#statsGrid');
  const loadTime = Date.now() - start;
  this.performanceMetrics.set('legacy-dashboard-load', loadTime);
  console.log(`Legacy Dashboard load time: ${loadTime}ms`);
});

When('I measure the load time of the Angular dashboard', async function (this: CustomWorld) {
  const start = Date.now();
  await this.angularPage.goto(`${this.angularUrl}/dashboard`);
  await this.angularPage.waitForLoadState('networkidle');
  await this.angularPage.waitForSelector('#statsGrid');
  const loadTime = Date.now() - start;
  this.performanceMetrics.set('angular-dashboard-load', loadTime);
  console.log(`Angular Dashboard load time: ${loadTime}ms`);
});

Then('I take screenshots of both dashboards after load', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('21-performance-dashboard');
});

When('I measure the load time of the legacy employee list', async function (this: CustomWorld) {
  const start = Date.now();
  await this.legacyPage.goto(`${this.legacyUrl}/employees`);
  await this.legacyPage.waitForLoadState('networkidle');
  await this.legacyPage.waitForSelector('#employeeTable');
  const loadTime = Date.now() - start;
  this.performanceMetrics.set('legacy-employees-load', loadTime);
  console.log(`Legacy Employee List load time: ${loadTime}ms`);
});

When('I measure the load time of the Angular employee list', async function (this: CustomWorld) {
  const start = Date.now();
  await this.angularPage.goto(`${this.angularUrl}/employees`);
  await this.angularPage.waitForLoadState('networkidle');
  await this.angularPage.waitForSelector('#employeeTable');
  const loadTime = Date.now() - start;
  this.performanceMetrics.set('angular-employees-load', loadTime);
  console.log(`Angular Employee List load time: ${loadTime}ms`);
});

When('I measure form input responsiveness on the legacy app', async function (this: CustomWorld) {
  await this.legacyPage.goto(`${this.legacyUrl}/employees/add`);
  await this.legacyPage.waitForLoadState('networkidle');
  const start = Date.now();
  await this.legacyPage.fill('#name', 'Performance Test');
  await this.legacyPage.fill('#email', 'perf@test.com');
  await this.legacyPage.selectOption('#department', 'Engineering');
  await this.legacyPage.fill('#salary', '80000');
  const elapsed = Date.now() - start;
  this.performanceMetrics.set('legacy-form-responsiveness', elapsed);
  console.log(`Legacy form input responsiveness: ${elapsed}ms`);
});

When('I measure form input responsiveness on the Angular app', async function (this: CustomWorld) {
  await this.angularPage.goto(`${this.angularUrl}/employees/add`);
  await this.angularPage.waitForLoadState('networkidle');
  const start = Date.now();
  await this.angularPage.fill('#name', 'Performance Test');
  await this.angularPage.fill('#email', 'perf@test.com');
  await this.angularPage.selectOption('#department', 'Engineering');
  await this.angularPage.fill('#salary', '80000');
  const elapsed = Date.now() - start;
  this.performanceMetrics.set('angular-form-responsiveness', elapsed);
  console.log(`Angular form input responsiveness: ${elapsed}ms`);
});

Then('both apps should respond to input within {int} milliseconds', async function (this: CustomWorld, maxMs: number) {
  for (const [key, value] of this.performanceMetrics) {
    if (key.includes('responsiveness')) {
      expect(value, `${key} took ${value}ms, exceeding ${maxMs}ms limit`).toBeLessThan(maxMs);
    }
  }
});

Then('I record the responsiveness metrics for comparison', async function (this: CustomWorld) {
  console.log('\n=== Responsiveness Metrics ===');
  for (const [key, value] of this.performanceMetrics) {
    if (key.includes('responsiveness')) {
      console.log(`  ${key}: ${value}ms`);
    }
  }
  console.log('==============================\n');
});
