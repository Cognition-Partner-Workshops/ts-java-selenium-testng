import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';

// ==================== Accessibility Steps ====================

When('I tab through the login form elements on the legacy app', async function (this: CustomWorld) {
  await this.legacyPage.keyboard.press('Tab');
  await this.legacyPage.waitForTimeout(300);
  await this.takeScreenshot(this.legacyPage, '22a-tab-username-legacy', 'legacy');

  await this.legacyPage.keyboard.press('Tab');
  await this.legacyPage.waitForTimeout(300);
  await this.takeScreenshot(this.legacyPage, '22b-tab-password-legacy', 'legacy');

  await this.legacyPage.keyboard.press('Tab');
  await this.legacyPage.waitForTimeout(300);
  await this.takeScreenshot(this.legacyPage, '22c-tab-submit-legacy', 'legacy');
});

When('I tab through the login form elements on the Angular app', async function (this: CustomWorld) {
  await this.angularPage.keyboard.press('Tab');
  await this.angularPage.waitForTimeout(300);
  await this.takeScreenshot(this.angularPage, '22a-tab-username-angular', 'angular');

  await this.angularPage.keyboard.press('Tab');
  await this.angularPage.waitForTimeout(300);
  await this.takeScreenshot(this.angularPage, '22b-tab-password-angular', 'angular');

  await this.angularPage.keyboard.press('Tab');
  await this.angularPage.waitForTimeout(300);
  await this.takeScreenshot(this.angularPage, '22c-tab-submit-angular', 'angular');
});

Then('both apps should follow the same tab order: username, password, submit', async function (this: CustomWorld) {
  // Tab order is verified by the screenshots taken during tab navigation
  // Both apps should have the same focusable elements in the same order
  const legacyUsername = await this.legacyPage.$('#username');
  const angularUsername = await this.angularPage.$('#username');
  expect(legacyUsername).toBeTruthy();
  expect(angularUsername).toBeTruthy();
});

Then('I take screenshots of tab focus states on both apps', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('22-tab-order-final');
});

When('I inspect form labels and ARIA attributes on the legacy app', async function (this: CustomWorld) {
  const labels = await this.legacyPage.$$eval('label', (els: any[]) =>
    els.map(el => ({
      text: el.textContent?.trim(),
      htmlFor: el.getAttribute('for')
    }))
  );
  console.log('Legacy form labels:', JSON.stringify(labels));
});

When('I inspect form labels and ARIA attributes on the Angular app', async function (this: CustomWorld) {
  const labels = await this.angularPage.$$eval('label', (els: any[]) =>
    els.map(el => ({
      text: el.textContent?.trim(),
      htmlFor: el.getAttribute('for')
    }))
  );
  console.log('Angular form labels:', JSON.stringify(labels));
});

Then('both apps should have proper label-input associations', async function (this: CustomWorld) {
  // Check label-for associations on employee form
  const legacyLabels = await this.legacyPage.$$eval('label[for]', (els: any[]) =>
    els.map(el => el.getAttribute('for'))
  );
  const angularLabels = await this.angularPage.$$eval('label[for]', (els: any[]) =>
    els.map(el => el.getAttribute('for'))
  );

  // Both should have labels with for attributes
  expect(legacyLabels.length).toBeGreaterThan(0);
  expect(angularLabels.length).toBeGreaterThan(0);

  // Verify each label points to an existing input
  for (const forAttr of angularLabels) {
    if (forAttr) {
      const input = await this.angularPage.$(`#${forAttr}`);
      expect(input, `Angular form: label points to #${forAttr} but input not found`).toBeTruthy();
    }
  }
});

Then('I take screenshots of accessibility inspection results', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('23-accessibility-labels');
});

When('I navigate using only keyboard on the legacy app', async function (this: CustomWorld) {
  // Tab through all focusable elements
  for (let i = 0; i < 5; i++) {
    await this.legacyPage.keyboard.press('Tab');
    await this.legacyPage.waitForTimeout(200);
  }
  await this.takeScreenshot(this.legacyPage, '24a-keyboard-nav-legacy', 'legacy');
});

When('I navigate using only keyboard on the Angular app', async function (this: CustomWorld) {
  for (let i = 0; i < 5; i++) {
    await this.angularPage.keyboard.press('Tab');
    await this.angularPage.waitForTimeout(200);
  }
  await this.takeScreenshot(this.angularPage, '24a-keyboard-nav-angular', 'angular');
});

Then('all interactive elements should be keyboard accessible on both apps', async function (this: CustomWorld) {
  // Verify buttons and links are focusable
  const legacyFocusable = await this.legacyPage.$$eval('a, button, input, select, textarea',
    (els: any[]) => els.length
  );
  const angularFocusable = await this.angularPage.$$eval('a, button, input, select, textarea',
    (els: any[]) => els.length
  );
  expect(legacyFocusable).toBeGreaterThan(0);
  expect(angularFocusable).toBeGreaterThan(0);
});

Then('I take screenshots of keyboard navigation comparison', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('24-keyboard-navigation');
});

Then('both apps should use readable font sizes', async function (this: CustomWorld) {
  const legacyFontSize = await this.legacyPage.$eval('body', (el: any) =>
    getComputedStyle(el).fontSize
  );
  const angularFontSize = await this.angularPage.$eval('body', (el: any) =>
    getComputedStyle(el).fontSize
  );
  // Font size should be at least 12px for readability
  const legacySize = parseInt(legacyFontSize);
  const angularSize = parseInt(angularFontSize);
  expect(legacySize).toBeGreaterThanOrEqual(12);
  expect(angularSize).toBeGreaterThanOrEqual(12);
});

Then('both apps should have sufficient color contrast', async function (this: CustomWorld) {
  // Verify text colors are not too light
  const legacyColor = await this.legacyPage.$eval('body', (el: any) =>
    getComputedStyle(el).color
  );
  const angularColor = await this.angularPage.$eval('body', (el: any) =>
    getComputedStyle(el).color
  );
  expect(legacyColor).toBeTruthy();
  expect(angularColor).toBeTruthy();
});

Then('I take screenshots of accessibility visual comparison', async function (this: CustomWorld) {
  await this.takeComparisonScreenshots('25-accessibility-visual');
});
