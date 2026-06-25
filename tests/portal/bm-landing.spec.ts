import { test, expect } from '@playwright/test';
import { USERNAME, PASSWORD } from '../../utils/test-config';
import { loginToPortal, openBenefitsManagement, captureStep, writeEvidence } from '../../utils/helpers';

test.describe('Benefits Management Landing', () => {
  test('TC#3 - Verify BM Dashboard loads after clicking Benefits Management', async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const evidence: Record<string, unknown> = {
      screen: 'BM Dashboard',
      scenario: 'TC#3: BM Dashboard Load',
      dashboardLoaded: false,
    };

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await benefitsPage.waitForLoadState('domcontentloaded');
    evidence.dashboardLoaded = true;
    await captureStep(benefitsPage, testInfo, 'bm-dashboard-loaded');

    await writeEvidence(testInfo, 'bm-landing-evidence.json', evidence);
  });
});
