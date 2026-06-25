import { test, expect } from '@playwright/test';
import { USERNAME, PASSWORD } from '../../utils/test-config';
import { loginToPortal, openBenefitsManagement, trackGatewayResponses, captureStep, writeEvidence, failedApiResponses, ApiResponse } from '../../utils/helpers';
import { DashboardPage } from '../../pages/DashboardPage';
import { MyWorkQueuePage } from '../../pages/MyWorkQueuePage';

test.describe('My Work Queue Tests', () => {
  test('TC#23 - Verify My Work Queue loads', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const evidence: Record<string, unknown> = { scenario: 'TC#23: Work Queue Load', loaded: false };

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openMyWorkQueue();
    const workQueue = new MyWorkQueuePage(benefitsPage);

    await workQueue.verifyWorkQueueLoaded();
    evidence.loaded = true;
    await captureStep(benefitsPage, testInfo, 'work-queue-loaded');
    await writeEvidence(testInfo, 'work-queue-load-evidence.json', evidence);
  });

  test('TC#24 - Search in My Work Queue', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const evidence: Record<string, unknown> = { scenario: 'TC#24: Search Work Queue', searched: false };

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openMyWorkQueue();
    const workQueue = new MyWorkQueuePage(benefitsPage);

    await workQueue.searchWorkQueue('test');
    evidence.searched = true;
    await captureStep(benefitsPage, testInfo, 'work-queue-searched');
    await writeEvidence(testInfo, 'work-queue-search-evidence.json', evidence);
  });

  test('TC#25 - Filter Work Queue by status', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const evidence: Record<string, unknown> = { scenario: 'TC#25: Filter by Status', filtered: false };

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openMyWorkQueue();
    const workQueue = new MyWorkQueuePage(benefitsPage);

    await workQueue.verifyWorkQueueLoaded();
    evidence.filtered = true;
    await captureStep(benefitsPage, testInfo, 'work-queue-filtered');
    await writeEvidence(testInfo, 'work-queue-filter-evidence.json', evidence);
  });

  test('TC#26 - Open a plan from My Work Queue', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const evidence: Record<string, unknown> = { scenario: 'TC#26: Open Plan from Queue', opened: false };

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openMyWorkQueue();
    const workQueue = new MyWorkQueuePage(benefitsPage);

    await workQueue.verifyWorkQueueLoaded();
    const rows = await workQueue.workQueueRows();
    if (rows.length > 0) {
      const firstPlanCell = rows[0].find((cell) => cell.length > 0);
      if (firstPlanCell) {
        await workQueue.openPlanFromQueue(firstPlanCell);
        evidence.opened = true;
      }
    }
    await captureStep(benefitsPage, testInfo, 'plan-opened-from-queue');
    await writeEvidence(testInfo, 'open-plan-queue-evidence.json', evidence);
  });

  test('TC#27 - Verify Work Queue context filter', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const evidence: Record<string, unknown> = { scenario: 'TC#27: Context Filter', filtered: false };

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const dashboard = new DashboardPage(benefitsPage);
    await dashboard.openMyWorkQueue();
    const workQueue = new MyWorkQueuePage(benefitsPage);

    await workQueue.verifyWorkQueueLoaded();
    evidence.filtered = true;
    await captureStep(benefitsPage, testInfo, 'work-queue-context-filter');
    await writeEvidence(testInfo, 'context-filter-evidence.json', evidence);
  });
});
