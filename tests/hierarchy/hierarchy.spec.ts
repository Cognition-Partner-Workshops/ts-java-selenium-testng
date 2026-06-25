import { test, expect } from '@playwright/test';
import { USERNAME, PASSWORD } from '../../utils/test-config';
import { loginToPortal, openBenefitsManagement, openConfigurationScreen, trackGatewayResponses, captureStep, writeEvidence, failedApiResponses, ApiResponse } from '../../utils/helpers';
import { HierarchyPage } from '../../pages/HierarchyPage';

test.describe('Hierarchy Tests', () => {
  test('TC#9 - Create hierarchy with Category, Component, and Attribute', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const apiResponses: ApiResponse[] = [];
    const evidence: Record<string, unknown> = {
      screen: 'Benefits Management / Configurations / Hierarchy',
      scenario: 'TC#9: Create Hierarchy',
      categoryCreated: false,
      componentCreated: false,
      attributeCreated: false,
    };
    trackGatewayResponses(page.context(), apiResponses);

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openConfigurationScreen(benefitsPage, 'Hierarchy');
    const hierarchyPage = new HierarchyPage(benefitsPage);

    try {
      const categoryName = await hierarchyPage.createCategory();
      evidence.categoryName = categoryName;
      evidence.categoryCreated = true;
      await captureStep(benefitsPage, testInfo, 'category-created');

      const componentName = await hierarchyPage.createComponent(categoryName);
      evidence.componentName = componentName;
      evidence.componentCreated = true;
      await captureStep(benefitsPage, testInfo, 'component-created');

      const attributeName = await hierarchyPage.createAttribute(componentName);
      evidence.attributeName = attributeName;
      evidence.attributeCreated = true;
      await captureStep(benefitsPage, testInfo, 'attribute-created');

      await hierarchyPage.verifyHierarchyNodeExists(categoryName);
      await hierarchyPage.verifyHierarchyNodeExists(componentName);
      await hierarchyPage.verifyHierarchyNodeExists(attributeName);
    } finally {
      evidence.apiResponses = apiResponses;
      await writeEvidence(testInfo, 'hierarchy-evidence.json', evidence);
    }

    expect(failedApiResponses(apiResponses), `API errors: ${JSON.stringify(apiResponses)}`).toEqual([]);
  });
});
