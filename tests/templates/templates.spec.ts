import { test, expect } from '@playwright/test';
import { USERNAME, PASSWORD } from '../../utils/test-config';
import { loginToPortal, openBenefitsManagement, openConfigurationScreen, trackGatewayResponses, captureStep, writeEvidence, failedApiResponses, generateUniqueName, ApiResponse } from '../../utils/helpers';
import { TemplatesPage } from '../../pages/TemplatesPage';

test.describe('Templates Tests', () => {
  test('TC#10 - Create a new plan template', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = {
      screen: 'Benefits Management / Configurations / Plan Templates',
      scenario: 'TC#10: Create Plan Template',
      created: false,
    };
    let createdName = '';
    trackGatewayResponses(page.context(), apiResponses);

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Plan Templates');
    const templatesPage = new TemplatesPage(benefitsPage);

    try {
      const result = await templatesPage.createTemplate();
      createdName = result.name;
      evidence.templateName = result.name;
      evidence.saveMessage = result.message;
      evidence.created = true;
      await captureStep(benefitsPage, testInfo, 'template-created');

      const row = await templatesPage.waitForTemplateRow(result.name);
      expect(row, `Template "${result.name}" should be visible in grid`).toBeTruthy();
    } finally {
      if (createdName) {
        await templatesPage.deleteTemplate(createdName).catch(() => null);
      }
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'create-template-evidence.json', evidence);
    }

    expect(failedApiResponses(apiResponses), `API errors: ${JSON.stringify(apiResponses)}`).toEqual([]);
  });

  test('TC#11 - Edit an existing plan template', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = {
      screen: 'Benefits Management / Configurations / Plan Templates',
      scenario: 'TC#11: Edit Plan Template',
      created: false,
      edited: false,
    };
    let createdName = '';
    trackGatewayResponses(page.context(), apiResponses);

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Plan Templates');
    const templatesPage = new TemplatesPage(benefitsPage);

    try {
      const result = await templatesPage.createTemplate();
      createdName = result.name;
      evidence.templateName = result.name;
      evidence.created = true;
      await captureStep(benefitsPage, testInfo, 'template-created-before-edit');

      await templatesPage.openEditForm(result.name);
      const editedName = `${result.name}_Edited`;
      await templatesPage.fillForm({ name: editedName, description: 'Edited description' });
      evidence.editMessage = await templatesPage.save();
      createdName = editedName;
      await captureStep(benefitsPage, testInfo, 'template-edited');

      const editedRow = await templatesPage.waitForTemplateRow(editedName);
      expect(editedRow, `Edited template "${editedName}" should be visible`).toBeTruthy();
      evidence.edited = true;
    } finally {
      if (createdName) {
        await templatesPage.deleteTemplate(createdName).catch(() => null);
      }
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'edit-template-evidence.json', evidence);
    }

    expect(failedApiResponses(apiResponses), `API errors: ${JSON.stringify(apiResponses)}`).toEqual([]);
  });

  test('TC#12 - Copy a plan template', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = {
      screen: 'Benefits Management / Configurations / Plan Templates',
      scenario: 'TC#12: Copy Plan Template',
      created: false,
      copied: false,
    };
    let createdName = '';
    trackGatewayResponses(page.context(), apiResponses);

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Plan Templates');
    const templatesPage = new TemplatesPage(benefitsPage);

    try {
      const result = await templatesPage.createTemplate();
      createdName = result.name;
      evidence.created = true;

      await templatesPage.copyTemplate(result.name);
      evidence.copied = true;
      await captureStep(benefitsPage, testInfo, 'template-copied');
    } finally {
      if (createdName) {
        await templatesPage.deleteTemplate(createdName).catch(() => null);
      }
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'copy-template-evidence.json', evidence);
    }

    expect(failedApiResponses(apiResponses), `API errors: ${JSON.stringify(apiResponses)}`).toEqual([]);
  });

  test('TC#13 - Create a new version of a plan template', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = {
      screen: 'Benefits Management / Configurations / Plan Templates',
      scenario: 'TC#13: Version Plan Template',
      created: false,
      versioned: false,
    };
    let createdName = '';
    trackGatewayResponses(page.context(), apiResponses);

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Plan Templates');
    const templatesPage = new TemplatesPage(benefitsPage);

    try {
      const result = await templatesPage.createTemplate();
      createdName = result.name;
      evidence.created = true;

      await templatesPage.createVersion(result.name);
      evidence.versioned = true;
      await captureStep(benefitsPage, testInfo, 'template-versioned');
    } finally {
      if (createdName) {
        await templatesPage.deleteTemplate(createdName).catch(() => null);
      }
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'version-template-evidence.json', evidence);
    }

    expect(failedApiResponses(apiResponses), `API errors: ${JSON.stringify(apiResponses)}`).toEqual([]);
  });
});
