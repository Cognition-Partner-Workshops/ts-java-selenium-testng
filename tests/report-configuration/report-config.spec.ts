import { test, expect } from '@playwright/test';
import { USERNAME, PASSWORD } from '../../utils/test-config';
import { loginToPortal, openBenefitsManagement, openConfigurationScreen, trackGatewayResponses, captureStep, writeEvidence, failedApiResponses, ApiResponse } from '../../utils/helpers';
import { ReportConfigurationPage } from '../../pages/ReportConfigurationPage';

test.describe('Report Configuration Tests', () => {
  test('TC#67 - Create a report configuration', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#67: Create Report Config', created: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Report Configuration');
    const reportPage = new ReportConfigurationPage(benefitsPage);
    try {
      const result = await reportPage.createReportConfig();
      evidence.reportName = result.name;
      evidence.saveMessage = result.message;
      evidence.created = true;
      await captureStep(benefitsPage, testInfo, 'report-config-created');
      await reportPage.verifyReportExists(result.name);
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'create-report-config-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#68 - Edit a report configuration', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#68: Edit Report Config', edited: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Report Configuration');
    const reportPage = new ReportConfigurationPage(benefitsPage);
    try {
      const result = await reportPage.createReportConfig();
      const editMsg = await reportPage.editReportConfig(result.name, `${result.name}_Edited`);
      evidence.editMessage = editMsg;
      evidence.edited = true;
      await captureStep(benefitsPage, testInfo, 'report-config-edited');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'edit-report-config-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });
});
