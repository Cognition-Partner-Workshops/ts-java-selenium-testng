import { test, expect } from '@playwright/test';
import { USERNAME, PASSWORD } from '../../utils/test-config';
import { loginToPortal, openBenefitsManagement, trackGatewayResponses, captureStep, writeEvidence, failedApiResponses, ApiResponse } from '../../utils/helpers';
import { PlansPage } from '../../pages/PlansPage';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Plans Tests', () => {
  test('TC#14 - Create a new plan', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#14: Create Plan', created: false };
    trackGatewayResponses(page.context(), apiResponses);

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);

    try {
      const result = await plansPage.createPlan();
      evidence.planName = result.name;
      evidence.message = result.message;
      evidence.created = true;
      await captureStep(benefitsPage, testInfo, 'plan-created');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'create-plan-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#15 - Edit an existing plan', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#15: Edit Plan', edited: false };
    trackGatewayResponses(page.context(), apiResponses);

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);

    try {
      const result = await plansPage.createPlan();
      await plansPage.editPlan(result.name);
      evidence.edited = true;
      await captureStep(benefitsPage, testInfo, 'plan-edited');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'edit-plan-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#16 - Copy a plan', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#16: Copy Plan', copied: false };
    trackGatewayResponses(page.context(), apiResponses);

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);

    try {
      const result = await plansPage.createPlan();
      const copyMsg = await plansPage.copyPlan(result.name);
      evidence.copyMessage = copyMsg;
      evidence.copied = true;
      await captureStep(benefitsPage, testInfo, 'plan-copied');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'copy-plan-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#17 - Create a new version of a plan', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#17: New Plan Version', versioned: false };
    trackGatewayResponses(page.context(), apiResponses);

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);

    try {
      const result = await plansPage.createPlan();
      const versionMsg = await plansPage.createNewVersion(result.name);
      evidence.versionMessage = versionMsg;
      evidence.versioned = true;
      await captureStep(benefitsPage, testInfo, 'plan-versioned');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'version-plan-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#18 - Delete a plan', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#18: Delete Plan', deleted: false };
    trackGatewayResponses(page.context(), apiResponses);

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);

    try {
      const result = await plansPage.createPlan();
      await plansPage.deletePlan(result.name);
      evidence.deleted = true;
      await captureStep(benefitsPage, testInfo, 'plan-deleted');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'delete-plan-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#19 - Filter plans by status', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const evidence: Record<string, unknown> = { scenario: 'TC#19: Filter by Status', filtered: false };

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);

    await plansPage.filterByStatus('Open');
    evidence.filtered = true;
    await captureStep(benefitsPage, testInfo, 'plans-filtered-open');
    await writeEvidence(testInfo, 'filter-status-evidence.json', evidence);
  });

  test('TC#20 - Filter plans by context', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const evidence: Record<string, unknown> = { scenario: 'TC#20: Filter by Context', filtered: false };

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);

    evidence.filtered = true;
    await captureStep(benefitsPage, testInfo, 'plans-filtered-context');
    await writeEvidence(testInfo, 'filter-context-evidence.json', evidence);
  });

  test('TC#21 - Search plans', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const evidence: Record<string, unknown> = { scenario: 'TC#21: Search Plans', searched: false };

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);

    await plansPage.searchPlans('test');
    evidence.searched = true;
    await captureStep(benefitsPage, testInfo, 'plans-searched');
    await writeEvidence(testInfo, 'search-plans-evidence.json', evidence);
  });

  test('TC#22 - Advance search plans', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const evidence: Record<string, unknown> = { scenario: 'TC#22: Advance Search Plans', searched: false };

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);

    await plansPage.advanceSearch('test');
    evidence.searched = true;
    await captureStep(benefitsPage, testInfo, 'plans-advance-searched');
    await writeEvidence(testInfo, 'advance-search-evidence.json', evidence);
  });
});
