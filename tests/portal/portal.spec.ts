import { test, expect } from '@playwright/test';
import { USERNAME, PASSWORD } from '../../utils/test-config';
import { loginToPortal, trackGatewayResponses, captureStep, writeEvidence, ApiResponse } from '../../utils/helpers';

test.describe('Portal Tests', () => {
  test('TC#1 - Verify Portal Admin permissions and portal home page', async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = {
      screen: 'Portal Home',
      scenario: 'TC#1: Portal Admin Permissions',
      portalHomeVerified: false,
    };
    trackGatewayResponses(page.context(), apiResponses);

    await loginToPortal(page);
    await expect(page).toHaveURL(/\/portal#\/home$/);
    await expect(page.getByText('What would you like to work on today?')).toBeVisible();
    evidence.portalHomeVerified = true;
    await captureStep(page, testInfo, 'portal-home-verified');

    evidence.apiResponses = apiResponses;
    await writeEvidence(testInfo, 'portal-admin-evidence.json', evidence);
  });

  test('TC#2 - Verify SRP and M3P instances not visible', async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const evidence: Record<string, unknown> = {
      screen: 'Portal Home',
      scenario: 'TC#2: SRP/M3P Instance Removal',
      srpHidden: false,
      m3pHidden: false,
    };

    await loginToPortal(page);
    await expect(page.getByText('SRP', { exact: true })).not.toBeVisible();
    evidence.srpHidden = true;
    await expect(page.getByText('M3P', { exact: true })).not.toBeVisible();
    evidence.m3pHidden = true;
    await captureStep(page, testInfo, 'srp-m3p-hidden');

    await writeEvidence(testInfo, 'srp-m3p-removal-evidence.json', evidence);
  });
});
