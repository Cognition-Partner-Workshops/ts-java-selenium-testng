import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/login-page";
import { WelcomePage } from "./pages/welcome-page";

test.describe("Valid Login Tests", () => {
  let loginPage: LoginPage;
  let welcomePage: WelcomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    welcomePage = new WelcomePage(page);
    await loginPage.visit();
  });

  test.describe("when login page loads", () => {
    test("displays the login form with all elements", async () => {
      await loginPage.isDisplayed();
      expect(await loginPage.getTitleText()).toBe("Sign In");
      await expect(loginPage.usernameField).toBeVisible();
      await expect(loginPage.passwordField).toBeVisible();
      await expect(loginPage.signinButton).toBeVisible();
      await expect(loginPage.signinButton).toHaveText("Sign In");
    });

    test("has the correct page title", async ({ page }) => {
      await expect(page).toHaveTitle(/Login/);
    });

    test("shows placeholder text in input fields", async () => {
      await expect(loginPage.usernameField).toHaveAttribute("placeholder", "Enter your username");
      await expect(loginPage.passwordField).toHaveAttribute("placeholder", "Enter your password");
    });

    test("has the password field masked", async () => {
      await expect(loginPage.passwordField).toHaveAttribute("type", "password");
    });
  });

  test.describe("when logging in with valid credentials (admin)", () => {
    test("successfully logs in and shows the welcome page", async () => {
      await loginPage.login("admin", "admin123");

      await welcomePage.isDisplayed();
      expect(await welcomePage.getTitleText()).toBe("Welcome!");
      expect(await welcomePage.isLoggedInAs("admin")).toBe(true);
    });
  });

  test.describe("when logging in with valid credentials (testuser)", () => {
    test("successfully logs in and shows the welcome page", async () => {
      await loginPage.login("testuser", "Test@1234");

      await welcomePage.isDisplayed();
      expect(await welcomePage.getTitleText()).toBe("Welcome!");
      expect(await welcomePage.isLoggedInAs("testuser")).toBe(true);
    });
  });

  test.describe("when logging out after successful login", () => {
    test("returns to the login page after logout", async () => {
      await loginPage.login("admin", "admin123");
      await welcomePage.isDisplayed();

      await welcomePage.clickLogout();

      await loginPage.isDisplayed();
      expect(await loginPage.getTitleText()).toBe("Sign In");
    });

    test("clears the form fields after logout", async () => {
      await loginPage.login("admin", "admin123");
      await welcomePage.isDisplayed();

      await welcomePage.clickLogout();

      await expect(loginPage.usernameField).toHaveValue("");
      await expect(loginPage.passwordField).toHaveValue("");
    });
  });

  test.describe("when entering text into form fields", () => {
    test("accepts text in the username field", async () => {
      await loginPage.enterUsername("testuser");
      await expect(loginPage.usernameField).toHaveValue("testuser");
    });

    test("accepts text in the password field", async () => {
      await loginPage.enterPassword("mypassword");
      await expect(loginPage.passwordField).toHaveValue("mypassword");
    });
  });
});
