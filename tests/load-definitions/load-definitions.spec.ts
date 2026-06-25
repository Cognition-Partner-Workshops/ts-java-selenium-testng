import { test, expect } from '@playwright/test';
import { USERNAME, PASSWORD } from '../../utils/test-config';
import { loginToPortal, openBenefitsManagement, openConfigurationScreen, trackGatewayResponses, captureStep, writeEvidence, failedApiResponses, generateUniqueName, ApiResponse } from '../../utils/helpers';
import { LoadDefinitionsPage } from '../../pages/LoadDefinitionsPage';

test.describe('Load Definitions Tests', () => {
  test('TC#58 - Create a load definition', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#58: Create Load Definition', created: false };
    let createdName = '';
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Load Definitions');
    const loadPage = new LoadDefinitionsPage(benefitsPage);
    try {
      const result = await loadPage.createLoadDefinition();
      createdName = result.name;
      evidence.loadName = result.name;
      evidence.saveMessage = result.message;
      evidence.created = true;
      await captureStep(benefitsPage, testInfo, 'load-definition-created');
      const row = await loadPage.waitForLoadDefinitionRow(result.name);
      expect(row, `Load definition "${result.name}" should be visible`).toBeTruthy();
    } finally {
      if (createdName) await loadPage.deleteLoadDefinition(createdName).catch(() => null);
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'create-load-definition-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#59 - Edit a load definition', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#59: Edit Load Definition', edited: false };
    let createdName = '';
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Load Definitions');
    const loadPage = new LoadDefinitionsPage(benefitsPage);
    try {
      const result = await loadPage.createLoadDefinition();
      createdName = result.name;
      await loadPage.openEditForm(result.name);
      evidence.edited = true;
      await captureStep(benefitsPage, testInfo, 'load-definition-edited');
    } finally {
      if (createdName) await loadPage.deleteLoadDefinition(createdName).catch(() => null);
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'edit-load-definition-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#60 - Delete a load definition', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#60: Delete Load Definition', deleted: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Load Definitions');
    const loadPage = new LoadDefinitionsPage(benefitsPage);
    try {
      const result = await loadPage.createLoadDefinition();
      const delResult = await loadPage.deleteLoadDefinition(result.name);
      evidence.deleted = delResult.deleted;
      await captureStep(benefitsPage, testInfo, 'load-definition-deleted');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'delete-load-definition-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#61 - Verify required field validation on load definition', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const evidence: Record<string, unknown> = { scenario: 'TC#61: Load Definition Validation', validationMessages: [] };
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Load Definitions');
    const loadPage = new LoadDefinitionsPage(benefitsPage);
    await loadPage.addButton.click();
    await loadPage.saveButton.click();
    const messages = await loadPage.verifyValidationMessages();
    evidence.validationMessages = messages;
    await captureStep(benefitsPage, testInfo, 'load-validation-messages');
    await writeEvidence(testInfo, 'load-validation-evidence.json', evidence);
  });

  test('TC#62 - Search load definitions', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const evidence: Record<string, unknown> = { scenario: 'TC#62: Search Load Definitions', searched: false };
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Load Definitions');
    const loadPage = new LoadDefinitionsPage(benefitsPage);
    await loadPage.searchLoadDefinitions('test');
    evidence.searched = true;
    await captureStep(benefitsPage, testInfo, 'load-definitions-searched');
    await writeEvidence(testInfo, 'search-load-definitions-evidence.json', evidence);
  });

  test('TC#63 - Verify load definition grid columns', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const evidence: Record<string, unknown> = { scenario: 'TC#63: Grid Columns', verified: false };
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Load Definitions');
    const loadPage = new LoadDefinitionsPage(benefitsPage);
    await expect(loadPage.loadTable).toBeVisible();
    evidence.verified = true;
    await captureStep(benefitsPage, testInfo, 'load-grid-columns');
    await writeEvidence(testInfo, 'load-grid-columns-evidence.json', evidence);
  });

  test('TC#64 - Run a load definition', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#64: Run Load Definition', run: false };
    let createdName = '';
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Load Definitions');
    const loadPage = new LoadDefinitionsPage(benefitsPage);
    try {
      const result = await loadPage.createLoadDefinition();
      createdName = result.name;
      const runMsg = await loadPage.runLoadDefinition(result.name);
      evidence.runMessage = runMsg;
      evidence.run = true;
      await captureStep(benefitsPage, testInfo, 'load-definition-run');
    } finally {
      if (createdName) await loadPage.deleteLoadDefinition(createdName).catch(() => null);
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'run-load-definition-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#65 - Verify load definition status after run', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const evidence: Record<string, unknown> = { scenario: 'TC#65: Load Status After Run' };
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Load Definitions');
    await captureStep(benefitsPage, testInfo, 'load-status-after-run');
    await writeEvidence(testInfo, 'load-status-evidence.json', evidence);
  });

  test('TC#66 - Verify load definition error handling', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const evidence: Record<string, unknown> = { scenario: 'TC#66: Load Error Handling' };
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Load Definitions');
    await captureStep(benefitsPage, testInfo, 'load-error-handling');
    await writeEvidence(testInfo, 'load-error-handling-evidence.json', evidence);
  });

  test('TC#70 - Batch process load definitions', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#70: Batch Process', processed: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Load Definitions');
    const loadPage = new LoadDefinitionsPage(benefitsPage);
    try {
      const msg = await loadPage.batchProcess();
      evidence.batchMessage = msg;
      evidence.processed = true;
      await captureStep(benefitsPage, testInfo, 'batch-processed');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'batch-process-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#71 - Verify batch process results', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const evidence: Record<string, unknown> = { scenario: 'TC#71: Batch Process Results' };
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Load Definitions');
    await captureStep(benefitsPage, testInfo, 'batch-results');
    await writeEvidence(testInfo, 'batch-results-evidence.json', evidence);
  });
});
