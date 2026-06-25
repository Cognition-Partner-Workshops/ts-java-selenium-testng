import { test, expect } from '@playwright/test';
import { USERNAME, PASSWORD } from '../../utils/test-config';
import { loginToPortal, openBenefitsManagement, trackGatewayResponses, captureStep, writeEvidence, failedApiResponses, ApiResponse } from '../../utils/helpers';
import { PlansPage } from '../../pages/PlansPage';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Exports Tests', () => {
  test('TC#69 - Export plans in available formats', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#69: Export Plans', exported: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);
    try {
      await plansPage.exportPlans('Excel');
      evidence.exported = true;
      await captureStep(benefitsPage, testInfo, 'plans-exported');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'export-plans-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });
});
