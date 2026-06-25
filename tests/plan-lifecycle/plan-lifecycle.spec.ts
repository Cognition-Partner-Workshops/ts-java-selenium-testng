import { test, expect } from '@playwright/test';
import { USERNAME, PASSWORD } from '../../utils/test-config';
import { loginToPortal, openBenefitsManagement, trackGatewayResponses, captureStep, writeEvidence, failedApiResponses, ApiResponse } from '../../utils/helpers';
import { PlansPage } from '../../pages/PlansPage';
import { DashboardPage } from '../../pages/DashboardPage';

test.describe('Plan Life Cycle Tests', () => {
  test('TC#33 - Create plan in Open status', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#33: Open Status Plan', created: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);
    try {
      const result = await plansPage.createPlan();
      evidence.planName = result.name;
      evidence.created = true;
      await captureStep(benefitsPage, testInfo, 'plan-open-created');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'plan-open-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#34 - Verify Open status plan displays correctly', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const evidence: Record<string, unknown> = { scenario: 'TC#34: Open Status Display' };
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);
    await plansPage.filterByStatus('Open');
    await captureStep(benefitsPage, testInfo, 'open-status-display');
    await writeEvidence(testInfo, 'open-status-display-evidence.json', evidence);
  });

  test('TC#35 - Submit plan for review', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#35: Submit for Review', submitted: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);
    try {
      const result = await plansPage.createPlan();
      await plansPage.editPlan(result.name);
      const msg = await plansPage.submitForReview();
      evidence.submitMessage = msg;
      evidence.submitted = true;
      await captureStep(benefitsPage, testInfo, 'plan-submitted-review');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'submit-review-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#36 - Verify Review Pending status', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const evidence: Record<string, unknown> = { scenario: 'TC#36: Review Pending Status' };
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);
    await plansPage.filterByStatus('Review Pending');
    await captureStep(benefitsPage, testInfo, 'review-pending-status');
    await writeEvidence(testInfo, 'review-pending-evidence.json', evidence);
  });

  test('TC#37 - Approve a plan', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#37: Approve Plan', approved: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);
    try {
      const result = await plansPage.createPlan();
      await plansPage.editPlan(result.name);
      await plansPage.submitForReview();
      const msg = await plansPage.approve();
      evidence.approveMessage = msg;
      evidence.approved = true;
      await captureStep(benefitsPage, testInfo, 'plan-approved');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'approve-plan-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#38 - Verify Approved status', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const evidence: Record<string, unknown> = { scenario: 'TC#38: Approved Status' };
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);
    await plansPage.filterByStatus('Approved');
    await captureStep(benefitsPage, testInfo, 'approved-status');
    await writeEvidence(testInfo, 'approved-status-evidence.json', evidence);
  });

  test('TC#39 - Reject a plan', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#39: Reject Plan', rejected: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);
    try {
      const result = await plansPage.createPlan();
      await plansPage.editPlan(result.name);
      await plansPage.submitForReview();
      const msg = await plansPage.reject();
      evidence.rejectMessage = msg;
      evidence.rejected = true;
      await captureStep(benefitsPage, testInfo, 'plan-rejected');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'reject-plan-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#40 - Verify Rejected status', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const evidence: Record<string, unknown> = { scenario: 'TC#40: Rejected Status' };
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);
    await plansPage.filterByStatus('Rejected');
    await captureStep(benefitsPage, testInfo, 'rejected-status');
    await writeEvidence(testInfo, 'rejected-status-evidence.json', evidence);
  });

  test('TC#41 - Publish a plan', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#41: Publish Plan', published: false };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);
    try {
      const result = await plansPage.createPlan();
      await plansPage.editPlan(result.name);
      await plansPage.submitForReview();
      await plansPage.approve();
      const msg = await plansPage.publish();
      evidence.publishMessage = msg;
      evidence.published = true;
      await captureStep(benefitsPage, testInfo, 'plan-published');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'publish-plan-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#42 - Verify Published status', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const evidence: Record<string, unknown> = { scenario: 'TC#42: Published Status' };
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);
    await plansPage.filterByStatus('Published');
    await captureStep(benefitsPage, testInfo, 'published-status');
    await writeEvidence(testInfo, 'published-status-evidence.json', evidence);
  });

  test('TC#43 - Mass status update', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const evidence: Record<string, unknown> = { scenario: 'TC#43: Mass Status Update' };
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);
    await plansPage.massStatusUpdate();
    await captureStep(benefitsPage, testInfo, 'mass-status-update');
    await writeEvidence(testInfo, 'mass-status-evidence.json', evidence);
  });

  test('TC#44 - Verify status color codes on plans grid', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const evidence: Record<string, unknown> = { scenario: 'TC#44: Status Color Codes' };
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    await captureStep(benefitsPage, testInfo, 'status-color-codes');
    await writeEvidence(testInfo, 'status-colors-evidence.json', evidence);
  });

  test('TC#45 - Full lifecycle: Open > Review > Approve > Publish', async ({ page }, testInfo) => {
    test.setTimeout(300_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#45: Full Lifecycle' };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);
    try {
      const result = await plansPage.createPlan();
      evidence.planName = result.name;
      await captureStep(benefitsPage, testInfo, 'lifecycle-plan-created');
      await plansPage.editPlan(result.name);
      evidence.submitMessage = await plansPage.submitForReview();
      await captureStep(benefitsPage, testInfo, 'lifecycle-submitted');
      evidence.approveMessage = await plansPage.approve();
      await captureStep(benefitsPage, testInfo, 'lifecycle-approved');
      evidence.publishMessage = await plansPage.publish();
      await captureStep(benefitsPage, testInfo, 'lifecycle-published');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'full-lifecycle-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });

  test('TC#46 - Full lifecycle: Open > Review > Reject > Edit > Review > Approve', async ({ page }, testInfo) => {
    test.setTimeout(300_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = { scenario: 'TC#46: Reject-Resubmit Lifecycle' };
    trackGatewayResponses(page.context(), apiResponses);
    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openPlans();
    const plansPage = new PlansPage(benefitsPage);
    try {
      const result = await plansPage.createPlan();
      evidence.planName = result.name;
      await plansPage.editPlan(result.name);
      await plansPage.submitForReview();
      evidence.rejectMessage = await plansPage.reject();
      await captureStep(benefitsPage, testInfo, 'lifecycle-rejected');
      await plansPage.editPlan(result.name);
      await plansPage.submitForReview();
      evidence.approveMessage = await plansPage.approve();
      await captureStep(benefitsPage, testInfo, 'lifecycle-reapproved');
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'reject-resubmit-evidence.json', evidence);
    }
    expect(failedApiResponses(apiResponses)).toEqual([]);
  });
});
