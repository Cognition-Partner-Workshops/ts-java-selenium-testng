import { test, expect } from '@playwright/test';
import { USERNAME, PASSWORD } from '../../utils/test-config';
import { loginToPortal, openBenefitsManagement, trackGatewayResponses, captureStep, writeEvidence, failedApiResponses, ApiResponse } from '../../utils/helpers';
import { ManageClientsPage } from '../../pages/ManageClientsPage';

test.describe('Manage Clients Tests', () => {
  test('TC#4 - Add a new client', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = {
      screen: 'Benefits Management / Manage Clients',
      scenario: 'TC#4: Add New Client',
      clientCreated: false,
    };
    trackGatewayResponses(page.context(), apiResponses);

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const clientsPage = new ManageClientsPage(benefitsPage);

    try {
      const clientName = await clientsPage.addNewClient();
      evidence.clientName = clientName;
      evidence.clientCreated = true;
      await captureStep(benefitsPage, testInfo, 'client-created');
      await clientsPage.verifyClientExists(clientName);
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'add-client-evidence.json', evidence);
    }

    expect(failedApiResponses(apiResponses), `API errors: ${JSON.stringify(apiResponses)}`).toEqual([]);
  });

  test('TC#5 - Edit an existing client', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = {
      screen: 'Benefits Management / Manage Clients',
      scenario: 'TC#5: Edit Client',
      clientEdited: false,
    };
    trackGatewayResponses(page.context(), apiResponses);

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    const clientsPage = new ManageClientsPage(benefitsPage);

    try {
      const clientName = await clientsPage.addNewClient();
      evidence.originalName = clientName;
      const editedName = `${clientName}_Edited`;
      await clientsPage.editClient(clientName, editedName);
      evidence.editedName = editedName;
      evidence.clientEdited = true;
      await captureStep(benefitsPage, testInfo, 'client-edited');
      await clientsPage.verifyClientExists(editedName);
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'edit-client-evidence.json', evidence);
    }

    expect(failedApiResponses(apiResponses), `API errors: ${JSON.stringify(apiResponses)}`).toEqual([]);
  });
});
