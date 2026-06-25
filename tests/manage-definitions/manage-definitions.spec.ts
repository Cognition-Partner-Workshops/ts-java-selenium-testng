import { test, expect } from '@playwright/test';
import { USERNAME, PASSWORD } from '../../utils/test-config';
import { loginToPortal, openBenefitsManagement, openConfigurationScreen, trackGatewayResponses, captureStep, writeEvidence, failedApiResponses, generateUniqueName, ApiResponse } from '../../utils/helpers';
import { ManageDefinitionsPage } from '../../pages/ManageDefinitionsPage';

test.describe('Manage Definitions Tests', () => {
  test('TC#8 - Create a new benefit definition with validation', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const stamp = generateUniqueName('def');
    const definition = {
      name: `AutoDef_${stamp}`,
      label: `Auto Label ${stamp}`,
      xmlNode: `auto_xml_${stamp}`,
      description: `Auto generated definition ${stamp}`,
      order: '1',
    };
    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = {
      screen: 'Benefits Management / Configurations / Benefit Definitions',
      scenario: 'TC#8: Create Benefit Definition',
      definition,
      validationMessages: [],
      saveMessage: '',
      created: false,
      deleted: false,
    };
    let created = false;
    trackGatewayResponses(page.context(), apiResponses);

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Benefit Definitions');
    const defPage = new ManageDefinitionsPage(benefitsPage);

    try {
      // Test required field validation
      await defPage.openAddForm();
      const requiredMsg = await defPage.clickSaveAndReadMessage();
      evidence.requiredNotification = requiredMsg;
      evidence.validationMessages = await defPage.getValidationMessages();
      await captureStep(benefitsPage, testInfo, 'required-field-validation');

      // Fill form and save
      await defPage.fillForm(definition);
      evidence.saveMessage = await defPage.save();
      created = true;
      evidence.created = true;
      await captureStep(benefitsPage, testInfo, 'definition-created');

      // Verify in grid
      const rows = await defPage.definitionRows();
      const found = rows.some((row) => row.some((cell) => cell.includes(definition.name)));
      expect(found, `Definition "${definition.name}" should appear in the grid`).toBe(true);
    } finally {
      if (created) {
        const cleanup = await defPage.deleteDefinition(definition.name).catch((e) => ({
          deleted: false,
          dialogMessage: '',
          message: (e as Error).message,
        }));
        evidence.deleted = cleanup.deleted;
      }
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'create-definition-evidence.json', evidence);
    }

    expect(failedApiResponses(apiResponses), `API errors: ${JSON.stringify(apiResponses)}`).toEqual([]);
  });
});
