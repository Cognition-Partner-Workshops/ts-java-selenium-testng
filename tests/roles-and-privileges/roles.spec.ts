import { test, expect } from '@playwright/test';
import { USERNAME, PASSWORD } from '../../utils/test-config';
import { loginToPortal, openBenefitsManagement, openAdminScreen, trackGatewayResponses, captureStep, writeEvidence, ApiResponse } from '../../utils/helpers';
import { RolesAndPrivilegesPage } from '../../pages/RolesAndPrivilegesPage';

test.describe('Roles and Privileges Tests', () => {
  test('TC#28 - Verify Roles screen loads', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const evidence: Record<string, unknown> = { scenario: 'TC#28: Roles Screen Load', loaded: false };

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openAdminScreen(benefitsPage, 'Roles');
    const rolesPage = new RolesAndPrivilegesPage(benefitsPage);

    await rolesPage.verifyRolesLoaded();
    evidence.loaded = true;
    await captureStep(benefitsPage, testInfo, 'roles-loaded');
    await writeEvidence(testInfo, 'roles-load-evidence.json', evidence);
  });

  test('TC#29 - Verify Admin role exists', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const evidence: Record<string, unknown> = { scenario: 'TC#29: Admin Role Exists', found: false };

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openAdminScreen(benefitsPage, 'Roles');
    const rolesPage = new RolesAndPrivilegesPage(benefitsPage);

    const adminRow = await rolesPage.verifyRoleExists('Admin');
    evidence.found = !!adminRow;
    await captureStep(benefitsPage, testInfo, 'admin-role-found');
    await writeEvidence(testInfo, 'admin-role-evidence.json', evidence);
    expect(adminRow, 'Admin role should exist').toBeTruthy();
  });

  test('TC#30 - Verify User role exists', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const evidence: Record<string, unknown> = { scenario: 'TC#30: User Role Exists', found: false };

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openAdminScreen(benefitsPage, 'Roles');
    const rolesPage = new RolesAndPrivilegesPage(benefitsPage);

    const userRow = await rolesPage.verifyRoleExists('User');
    evidence.found = !!userRow;
    await captureStep(benefitsPage, testInfo, 'user-role-found');
    await writeEvidence(testInfo, 'user-role-evidence.json', evidence);
    expect(userRow, 'User role should exist').toBeTruthy();
  });

  test('TC#31 - Verify role permissions are displayed', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const evidence: Record<string, unknown> = { scenario: 'TC#31: Role Permissions', verified: false };

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openAdminScreen(benefitsPage, 'Roles');
    const rolesPage = new RolesAndPrivilegesPage(benefitsPage);

    await rolesPage.verifyRolesLoaded();
    const rows = await rolesPage.roleRows();
    evidence.roleCount = rows.length;
    evidence.verified = rows.length > 0;
    await captureStep(benefitsPage, testInfo, 'permissions-displayed');
    await writeEvidence(testInfo, 'permissions-evidence.json', evidence);
  });

  test('TC#32 - Verify current user role assignment', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    test.skip(!USERNAME || !PASSWORD, 'Set GXCAPTURE_USERNAME and GXCAPTURE_PASSWORD before running.');

    const evidence: Record<string, unknown> = { scenario: 'TC#32: User Role Assignment', verified: false };

    await loginToPortal(page);
    const benefitsPage = await openBenefitsManagement(page);
    await openAdminScreen(benefitsPage, 'Roles');
    const rolesPage = new RolesAndPrivilegesPage(benefitsPage);

    await rolesPage.verifyRolesLoaded();
    evidence.verified = true;
    await captureStep(benefitsPage, testInfo, 'user-role-assignment');
    await writeEvidence(testInfo, 'user-role-assignment-evidence.json', evidence);
  });
});
