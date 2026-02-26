/**
 * Login Feature – Playwright TypeScript conversion of Katalon Groovy Login class.
 *
 * Original: com.BusinessFunctions.Login (Katalon Groovy)
 * Converted: Playwright + TypeScript with Page Object Model
 *
 * Each public static method from the original class is now an individual test
 * (or a reusable helper function called from tests).
 */

import { test, Page, BrowserContext } from '@playwright/test';
import { CommonFunctions } from '../utils/common-functions';
import { getTestData } from '../utils/test-data';
import { LoginPage } from '../pages/login.page';
import { OverviewPage } from '../pages/overview.page';
import { ProfilePage } from '../pages/profile.page';
import { YopMailPage } from '../pages/yopmail.page';

// ─────────────────────────────────────────────────────────────────────────────
// Reusable helper: fetch OTP from YopMail in a new tab
// ─────────────────────────────────────────────────────────────────────────────

async function fetchOtpFromYopMail(context: BrowserContext, userName: string): Promise<{ otp: string; yopMailPage: Page }> {
  const yopMailTab = await context.newPage();
  const yopMail = new YopMailPage(yopMailTab);
  await yopMail.openInbox(userName);
  const otp = await yopMail.extractOTP();
  return { otp, yopMailPage: yopMailTab };
}

// ─────────────────────────────────────────────────────────────────────────────
// Reusable helper: handle MFA flow (Show more → Email option → Next → get OTP)
// ─────────────────────────────────────────────────────────────────────────────

async function handleMfaFlow(
  page: Page,
  context: BrowserContext,
  common: CommonFunctions,
  profile: ProfilePage,
  overview: OverviewPage,
  options: { resendOtp?: boolean; sendAnotherWay?: boolean; waitBeforeResend?: number } = {}
): Promise<void> {
  // MFA Account - show more options and select email
  await common.fnClickIfObjectExists(profile.lnkShowMore);
  await common.fnClickIfObjectExists(profile.chkEmailOption);
  await common.fnClickIfObjectExists(profile.btnMFANext);

  if (options.sendAnotherWay) {
    await common.wait(3);
    await common.fnClickIfObjectExists(profile.lnkSendAnotherWay);
    await common.wait(5);
    // Re-select email option after "Send another way"
    await common.fnClickIfObjectExists(profile.lnkShowMore);
    await common.fnClickIfObjectExists(profile.chkEmailOption);
    await common.fnClickIfObjectExists(profile.btnMFANext);
  }

  if (options.resendOtp) {
    const waitTime = options.waitBeforeResend ?? 65;
    await common.wait(waitTime);
    await common.fnClick(profile.lnkResendOtp);
    await common.wait(5);
  } else {
    await common.wait(5);
  }

  // Open YopMail in a new tab and extract OTP
  const { otp, yopMailPage } = await fetchOtpFromYopMail(context, getTestData('UserName'));
  common.fnPrintCustomMessage(`OTP Generated - Successfully Captured : ${otp}`, true);

  // Close YopMail tab and switch back to original page
  await yopMailPage.close();

  // Enter OTP on the original page
  await common.fnClick(profile.editEnterOneTimeCode);
  await common.fnSetText(profile.editEnterOneTimeCode, otp);
  common.fnPrintCustomMessage('Profile - Change Recovery email Enter OTP', true);

  // Optionally check "Remember this device"
  await common.fnClickIfObjectExists(profile.chkRememberThisDevice);

  // Click Next on the YopMail / OTP page
  const yopMailNextBtn = page.locator('button:has-text("Next"), [data-testid="next-btn"]');
  await common.fnClick(yopMailNextBtn);
}

// ─────────────────────────────────────────────────────────────────────────────
// Reusable helper: reset password flow after OTP entry
// ─────────────────────────────────────────────────────────────────────────────

async function completePasswordReset(
  common: CommonFunctions,
  profile: ProfilePage,
  loginPage: LoginPage,
  overview: OverviewPage
): Promise<void> {
  await common.fnClick(profile.editPassword);
  await common.fnSetText(profile.editPassword, getTestData('Password'));

  await common.fnClick(profile.editRetypeNewPassword);
  await common.fnSetText(profile.editRetypeNewPassword, getTestData('Password'));

  await common.fnClick(loginPage.btnNEXT);
  await common.wait(6);

  await common.fnClick(loginPage.btnGoToAccountOverviewForgotPassword);
  await common.wait(6);

  await common.fnClickIfObjectExists(overview.btnLooksGood);
  await common.fnWaitForElementPresent(overview.lnkAccountOverview, 10);
}

// ═════════════════════════════════════════════════════════════════════════════
// TESTS
// ═════════════════════════════════════════════════════════════════════════════

test.describe('Login Feature', () => {
  let common: CommonFunctions;
  let loginPage: LoginPage;
  let overview: OverviewPage;
  let profile: ProfilePage;

  test.beforeEach(async ({ page }) => {
    common = new CommonFunctions(page);
    loginPage = new LoginPage(page);
    overview = new OverviewPage(page);
    profile = new ProfilePage(page);
  });

  // ── LoginApplication ────────────────────────────────────────────
  test('LoginApplication - Standard login with continue button', async ({ page }) => {
    await common.navigateTo(getTestData('URL'));
    common.fnPrintCustomMessage(`Successfully Opened the URL :- ${getTestData('URL')}`, false);

    await common.fnWaitForElementPresent(loginPage.editUserID, 10);
    console.log(`Before Sign in URL:- ${common.getUrl()}`);

    await common.fnSetText(loginPage.editUserID, getTestData('UserName'));
    await common.fnClick(loginPage.btnContinue);
    await common.fnSetText(loginPage.editPassword, getTestData('Password'));
    await common.fnClick(loginPage.btnSignin);

    await page.waitForLoadState('load');
    await page.reload();

    // Wait for skeleton loader to disappear
    const skeletonLoader = page.locator('[data-testid="skeleton-loader"], .skeleton-loader');
    await common.fnWaitUntilElementIsGone(skeletonLoader);

    await common.takeScreenshot();
    common.fnPrintCustomMessage('CBR Validation', true);

    await common.fnClickIfObjectExists(overview.btnLooksGood);

    const accountStatus = getTestData('AccountStatus');
    if (accountStatus.toUpperCase() !== 'STREAM ALONE') {
      await common.fnWaitForElementPresent(overview.lblWelcome, 10);
      await common.scrollToTop();
      console.log(`After Sign in URL:- ${common.getUrl()}`);
      await common.fnClickIfObjectExists(overview.btnIllDoThisLater);
    }

    await common.fnWaitUntilPageLoadComplete();
    common.fnPrintCustomMessage('Successfully Logged into application', true);
  });

  // ── LoginApplications ───────────────────────────────────────────
  test('LoginApplications - Login with Next button', async () => {
    await common.navigateTo(getTestData('URL'));
    await common.fnSetText(loginPage.editUserID, getTestData('UserName'));
    await common.fnClick(loginPage.btnNext);
    await common.fnSetText(loginPage.editPassword, getTestData('Password'));
    await common.fnClick(loginPage.btnNext);
    await common.fnClickIfObjectExists(overview.btnLooksGood);
    await common.fnWaitForElementPresent(overview.lnkAccountOverview, 10);
  });

  // ── LoginApplicationsTemp ───────────────────────────────────────
  test('LoginApplicationsTemp - Temporary login with hardcoded user prefix', async () => {
    await common.navigateTo(getTestData('URL'));
    await common.fnSetText(loginPage.editUserID, 'carollessnau');
    await common.fnClick(loginPage.btnNext);
    await common.wait(3);

    await common.fnClick(loginPage.editUserIDTemp);
    await common.fnSetText(loginPage.editUserIDTemp, getTestData('UserName'));
    await common.fnClick(loginPage.btnContinue);
    await common.fnSetText(loginPage.editPassword, getTestData('Password'));
    await common.fnClick(loginPage.btnSignin);

    await common.fnClickIfObjectExists(overview.btnLooksGood);
  });

  // ── LoginApplicationStreamRR ────────────────────────────────────
  test('LoginApplicationStreamRR - Stream RR login', async () => {
    await common.navigateTo(getTestData('URL'));
    await common.wait(3);

    await common.fnClick(loginPage.editUserIDTemp);
    await common.fnSetText(loginPage.editUserIDTemp, getTestData('UserName'));
    await common.fnClick(loginPage.btnContinue);
    await common.fnSetText(loginPage.editPassword, getTestData('Password'));
    await common.fnClick(loginPage.btnSignin);

    await common.fnClickIfObjectExists(overview.btnLooksGood);
  });

  // ── LoginApplicationStreamATTVNOW ───────────────────────────────
  test('LoginApplicationStreamATTVNOW - Stream ATT TV NOW login', async ({ page }) => {
    await common.navigateTo(getTestData('URL'));
    await common.wait(3);

    await common.fnClick(loginPage.editUserIDTemp);
    await common.fnSetText(loginPage.editUserIDTemp, getTestData('UserName'));
    await common.fnClick(loginPage.btnContinue);
    await common.fnSetText(loginPage.editPassword, getTestData('Password'));
    await common.fnClick(loginPage.btnSignin);

    await page.goto('https://test2.directv.com/accounts/stream/overview');
    await common.fnClickIfObjectExists(overview.btnLooksGood);
  });

  // ── LoginApplicationStreamRRGenre ───────────────────────────────
  test('LoginApplicationStreamRRGenre - Stream RR Genre login', async ({ page }) => {
    await common.navigateTo(getTestData('URL'));
    await common.wait(3);

    await common.fnClick(loginPage.editUserIDTemp);
    await common.fnSetText(loginPage.editUserIDTemp, getTestData('UserName'));
    await common.fnClick(loginPage.btnContinue);
    await common.fnSetText(loginPage.editPassword, getTestData('Password'));
    await common.fnClick(loginPage.btnSignin);

    await page.goto('https://test2.directv.com/accounts/stream/overview');
    await common.fnClickIfObjectExists(overview.btnLooksGood);
  });

  // ── LoginApplicationStream ──────────────────────────────────────
  test('LoginApplicationStream - Stream login', async ({ page }) => {
    await common.navigateTo(getTestData('URL'));
    await common.wait(3);

    await common.fnClick(loginPage.editUserIDTemp);
    await common.fnSetText(loginPage.editUserIDTemp, getTestData('UserName'));
    await common.fnClick(loginPage.btnContinue);
    await common.fnSetText(loginPage.editPassword, getTestData('Password'));
    await common.fnClick(loginPage.btnSignin);

    await common.fnClickIfObjectExists(overview.btnLooksGood);
    await page.goto('https://test2.directv.com/accounts/stream/overview');
  });

  // ── ResetYourPassword ───────────────────────────────────────────
  test('ResetYourPassword - Forgot password with OTP via YopMail', async ({ page, context }) => {
    await common.navigateTo(getTestData('URL'));
    await common.fnSetText(loginPage.editUserID, getTestData('UserName'));
    await common.fnClick(loginPage.editLastName);
    await common.fnSetText(loginPage.editLastName, getTestData('LastName') ?? '');
    await common.fnClick(loginPage.btnNEXT);

    await handleMfaFlow(page, context, common, profile, overview);
    await completePasswordReset(common, profile, loginPage, overview);
  });

  // ── ResetYourPasswordResendOTP ──────────────────────────────────
  test('ResetYourPasswordResendOTP - Forgot password with resent OTP', async ({ page, context }) => {
    await common.navigateTo(getTestData('URL'));
    await common.fnSetText(loginPage.editUserID, getTestData('UserName'));
    await common.fnClick(loginPage.editLastName);
    await common.fnSetText(loginPage.editLastName, getTestData('LastName') ?? '');
    await common.fnClick(loginPage.btnNEXT);

    await handleMfaFlow(page, context, common, profile, overview, {
      resendOtp: true,
      waitBeforeResend: 65,
    });
    await completePasswordReset(common, profile, loginPage, overview);
  });

  // ── fn_forgotPasswordSendAnotherWay ─────────────────────────────
  test('ForgotPasswordSendAnotherWay - Forgot password via alternate method', async ({ page, context }) => {
    await common.navigateTo(getTestData('URL'));
    await common.fnSetText(loginPage.editUserID, getTestData('UserName'));
    await common.fnClick(loginPage.editLastName);
    await common.fnSetText(loginPage.editLastName, getTestData('LastName') ?? '');
    await common.fnClick(loginPage.btnNEXT);

    await handleMfaFlow(page, context, common, profile, overview, {
      sendAnotherWay: true,
    });
    await completePasswordReset(common, profile, loginPage, overview);
  });

  // ── LoginApplicationsMFASendAnotherWay ──────────────────────────
  test('LoginApplicationsMFASendAnotherWay - MFA login via alternate method', async ({ page, context }) => {
    await common.navigateTo(getTestData('URL'));
    await common.fnSetText(loginPage.editUserID, getTestData('UserName'));
    await common.fnClick(loginPage.btnNext);
    await common.fnSetText(loginPage.editPassword, getTestData('Password'));
    await common.fnClick(loginPage.btnNext);

    await handleMfaFlow(page, context, common, profile, overview, {
      sendAnotherWay: true,
    });

    await common.fnClickIfObjectExists(overview.btnLooksGood);
    await common.fnWaitForElementPresent(overview.lnkAccountOverview, 10);
  });

  // ── LoginApplicationsMFAResendOTP ───────────────────────────────
  test('LoginApplicationsMFAResendOTP - MFA login with resent OTP', async ({ page, context }) => {
    await common.navigateTo(getTestData('URL'));
    await common.fnSetText(loginPage.editUserID, getTestData('UserName'));
    await common.fnClick(loginPage.btnNext);
    await common.fnSetText(loginPage.editPassword, getTestData('Password'));
    await common.fnClick(loginPage.btnNext);

    await handleMfaFlow(page, context, common, profile, overview, {
      resendOtp: true,
      waitBeforeResend: 65,
    });

    await common.fnClickIfObjectExists(overview.btnLooksGood);
    await common.fnWaitForElementPresent(overview.lnkAccountOverview, 10);
  });

  // ── LoginApplicationsMFANewProd ─────────────────────────────────
  test('LoginApplicationsMFANewProd - MFA login for new prod', async ({ page, context }) => {
    await common.navigateTo(getTestData('URL'));
    await common.fnSetText(loginPage.editUserID, getTestData('UserName'));
    await common.fnClick(loginPage.btnNext);
    await common.fnSetText(loginPage.editPassword, getTestData('Password'));
    await common.fnClick(loginPage.btnNext);

    await handleMfaFlow(page, context, common, profile, overview);

    await common.fnClickIfObjectExists(overview.btnLooksGood);
    await common.fnWaitForElementPresent(overview.lnkAccountOverview, 10);
  });

  // ── LoginApplicationsGenreAccountMFA ────────────────────────────
  test('LoginApplicationsGenreAccountMFA - Genre account MFA login', async ({ page, context }) => {
    await common.navigateTo(getTestData('URL'));
    await common.fnSetText(loginPage.editUserID, getTestData('UserName'));
    await common.fnClick(loginPage.btnNext);
    await common.fnSetText(loginPage.editPassword, getTestData('Password'));
    await common.fnClick(loginPage.btnNext);

    await handleMfaFlow(page, context, common, profile, overview);

    await common.wait(5);
    await common.fnClickIfObjectExists(overview.btnLooksGood);
    await common.fnWaitForElementPresent(overview.lnkAccountOverview, 10);
  });
});
