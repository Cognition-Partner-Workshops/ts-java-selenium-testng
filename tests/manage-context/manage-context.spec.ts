import { test, expect } from '@playwright/test';
import { USERNAME, PASSWORD } from '../../utils/test-config';
import { loginToPortal, openBenefitsManagement, openConfigurationScreen, trackGatewayResponses, captureStep, writeEvidence, failedApiResponses, ApiResponse } from '../../utils/helpers';
import { ManageContextPage } from '../../pages/ManageContextPage';

test.describe('Manage Context Tests', () => {
  test('TC#6 - Create a new context', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = {
      screen: 'Benefits Management / Manage Context',
      scenario: 'TC#6: Create Context',
      contextCreated: false,
    };
    trackGatewayResponses(page.context(), apiResponses);

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Context');
    const contextPage = new ManageContextPage(benefitsPage);

    try {
      const contextName = await contextPage.addNewContext();
      evidence.contextName = contextName;
      evidence.contextCreated = true;
      await captureStep(benefitsPage, testInfo, 'context-created');
      await contextPage.verifyContextExists(contextName);
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'create-context-evidence.json', evidence);
    }

    expect(failedApiResponses(apiResponses), `API errors: ${JSON.stringify(apiResponses)}`).toEqual([]);
  });

  test('TC#7 - Edit an existing context', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = {
      screen: 'Benefits Management / Manage Context',
      scenario: 'TC#7: Edit Context',
      contextEdited: false,
    };
    trackGatewayResponses(page.context(), apiResponses);

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Context');
    const contextPage = new ManageContextPage(benefitsPage);

    try {
      const contextName = await contextPage.addNewContext();
      evidence.originalName = contextName;
      const editedName = `${contextName}_Edited`;
      await contextPage.editContext(contextName, editedName);
      evidence.editedName = editedName;
      evidence.contextEdited = true;
      await captureStep(benefitsPage, testInfo, 'context-edited');
      await contextPage.verifyContextExists(editedName);
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'edit-context-evidence.json', evidence);
    }

    expect(failedApiResponses(apiResponses), `API errors: ${JSON.stringify(apiResponses)}`).toEqual([]);
  });
});
