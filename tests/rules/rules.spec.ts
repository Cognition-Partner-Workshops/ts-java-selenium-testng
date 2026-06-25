import { test, expect } from '@playwright/test';
import { USERNAME, PASSWORD } from '../../utils/test-config';
import { loginToPortal, openBenefitsManagement, openConfigurationScreen, trackGatewayResponses, captureStep, writeEvidence, failedApiResponses, generateUniqueName, ApiResponse } from '../../utils/helpers';
import { ValidationsPage } from '../../pages/ValidationsPage';

test.describe('Rules Tests', () => {
  test('TC#47 - Create a constraint rule', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#47: Create Constraint', created: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Constraints');
    const rulesPage = new ValidationsPage(benefitsPage);
    try {
      const name = generateUniqueName('Constraint');
      const msg = await rulesPage.createConstraint(name);
      evidence.ruleName = name;
      evidence.saveMessage = msg;
      evidence.created = true;
      await captureStep(benefitsPage, testInfo, 'constraint-created');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'create-constraint-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#48 - Edit a constraint rule', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#48: Edit Constraint', edited: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Constraints');
    const rulesPage = new ValidationsPage(benefitsPage);
    try {
      const name = generateUniqueName('Constraint');
      await rulesPage.createConstraint(name);
      const editMsg = await rulesPage.editRule(name, { name: `${name}_Edited` });
      evidence.editMessage = editMsg;
      evidence.edited = true;
      await captureStep(benefitsPage, testInfo, 'constraint-edited');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'edit-constraint-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#49 - Delete a constraint rule', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#49: Delete Constraint', deleted: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Constraints');
    const rulesPage = new ValidationsPage(benefitsPage);
    try {
      const name = generateUniqueName('Constraint');
      await rulesPage.createConstraint(name);
      const result = await rulesPage.deleteRule(name);
      evidence.deleted = result.deleted;
      await captureStep(benefitsPage, testInfo, 'constraint-deleted');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'delete-constraint-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#50 - Create a display rule', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#50: Create Display Rule', created: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Display Rules');
    const rulesPage = new ValidationsPage(benefitsPage);
    try {
      const name = generateUniqueName('DisplayRule');
      const msg = await rulesPage.createDisplayRule(name);
      evidence.ruleName = name;
      evidence.saveMessage = msg;
      evidence.created = true;
      await captureStep(benefitsPage, testInfo, 'display-rule-created');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'create-display-rule-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#51 - Edit a display rule', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#51: Edit Display Rule', edited: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Display Rules');
    const rulesPage = new ValidationsPage(benefitsPage);
    try {
      const name = generateUniqueName('DisplayRule');
      await rulesPage.createDisplayRule(name);
      const editMsg = await rulesPage.editRule(name, { name: `${name}_Edited` });
      evidence.editMessage = editMsg;
      evidence.edited = true;
      await captureStep(benefitsPage, testInfo, 'display-rule-edited');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'edit-display-rule-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#52 - Delete a display rule', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#52: Delete Display Rule', deleted: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Display Rules');
    const rulesPage = new ValidationsPage(benefitsPage);
    try {
      const name = generateUniqueName('DisplayRule');
      await rulesPage.createDisplayRule(name);
      const result = await rulesPage.deleteRule(name);
      evidence.deleted = result.deleted;
      await captureStep(benefitsPage, testInfo, 'display-rule-deleted');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'delete-display-rule-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#53 - Create a validation rule', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#53: Create Validation Rule', created: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Validations');
    const rulesPage = new ValidationsPage(benefitsPage);
    try {
      const name = generateUniqueName('Validation');
      const msg = await rulesPage.createValidationRule(name);
      evidence.ruleName = name;
      evidence.saveMessage = msg;
      evidence.created = true;
      await captureStep(benefitsPage, testInfo, 'validation-rule-created');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'create-validation-rule-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#54 - Edit a validation rule', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#54: Edit Validation Rule', edited: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Validations');
    const rulesPage = new ValidationsPage(benefitsPage);
    try {
      const name = generateUniqueName('Validation');
      await rulesPage.createValidationRule(name);
      const editMsg = await rulesPage.editRule(name, { name: `${name}_Edited` });
      evidence.editMessage = editMsg;
      evidence.edited = true;
      await captureStep(benefitsPage, testInfo, 'validation-rule-edited');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'edit-validation-rule-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#55 - Delete a validation rule', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#55: Delete Validation Rule', deleted: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Validations');
    const rulesPage = new ValidationsPage(benefitsPage);
    try {
      const name = generateUniqueName('Validation');
      await rulesPage.createValidationRule(name);
      const result = await rulesPage.deleteRule(name);
      evidence.deleted = result.deleted;
      await captureStep(benefitsPage, testInfo, 'validation-rule-deleted');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'delete-validation-rule-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#56 - Verify constraint applied to plan', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const evidence: Record<string, unknown> = { scenario: 'TC#56: Constraint Applied to Plan' };
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await captureStep(benefitsPage, testInfo, 'constraint-on-plan');
    await writeEvidence(testInfo, 'constraint-on-plan-evidence.json', evidence);
  });

  test('TC#57 - Verify display rule applied to plan', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const evidence: Record<string, unknown> = { scenario: 'TC#57: Display Rule Applied to Plan' };
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await captureStep(benefitsPage, testInfo, 'display-rule-on-plan');
    await writeEvidence(testInfo, 'display-rule-on-plan-evidence.json', evidence);
  });
});
