import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/login-page";

test.describe("Invalid Login Tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.visit();
  });

  test.describe("when submitting with empty fields", () => {
    test("shows error when both username and password are empty", async () => {
      await loginPage.clickSignin();

      expect(await loginPage.getMessageText()).toBe("Username is required");
      expect(await loginPage.isErrorMessage()).toBe(true);
    });

    test("shows error when username is empty but password is provided", async () => {
      await loginPage.enterPassword("somepassword");
      await loginPage.clickSignin();

      expect(await loginPage.getMessageText()).toBe("Username is required");
      expect(await loginPage.isErrorMessage()).toBe(true);
    });

    test("shows error when password is empty but username is provided", async () => {
      await loginPage.enterUsername("someuser");
      await loginPage.clickSignin();

      expect(await loginPage.getMessageText()).toBe("Password is required");
      expect(await loginPage.isErrorMessage()).toBe(true);
    });
  });

  test.describe("when submitting with invalid credentials", () => {
    test("shows error for wrong username", async () => {
      await loginPage.login("wronguser", "admin123");

      expect(await loginPage.getMessageText()).toBe("Invalid username or password");
      expect(await loginPage.isErrorMessage()).toBe(true);
    });

    test("shows error for wrong password", async () => {
      await loginPage.login("admin", "wrongpassword");

      expect(await loginPage.getMessageText()).toBe("Invalid username or password");
      expect(await loginPage.isErrorMessage()).toBe(true);
    });

    test("shows error for both wrong username and password", async () => {
      await loginPage.login("wronguser", "wrongpassword");

      expect(await loginPage.getMessageText()).toBe("Invalid username or password");
      expect(await loginPage.isErrorMessage()).toBe(true);
    });
  });

  test.describe("when submitting with case-sensitive credentials", () => {
    test("shows error for username with wrong case", async () => {
      await loginPage.login("Admin", "admin123");

      expect(await loginPage.getMessageText()).toBe("Invalid username or password");
      expect(await loginPage.isErrorMessage()).toBe(true);
    });

    test("shows error for password with wrong case", async () => {
      await loginPage.login("admin", "Admin123");

      expect(await loginPage.getMessageText()).toBe("Invalid username or password");
      expect(await loginPage.isErrorMessage()).toBe(true);
    });
  });

  test.describe("when submitting with special characters", () => {
    test("shows error for username with special characters", async () => {
      await loginPage.login("<script>alert('xss')</script>", "admin123");

      expect(await loginPage.getMessageText()).toBe("Invalid username or password");
      expect(await loginPage.isErrorMessage()).toBe(true);
    });

    test("shows error for SQL injection attempt in username", async () => {
      await loginPage.login("' OR 1=1 --", "password");

      expect(await loginPage.getMessageText()).toBe("Invalid username or password");
      expect(await loginPage.isErrorMessage()).toBe(true);
    });
  });

  test.describe("when submitting with whitespace-only input", () => {
    test("shows error when username is only spaces", async () => {
      await loginPage.login("   ", "admin123");

      expect(await loginPage.getMessageText()).toBe("Username is required");
      expect(await loginPage.isErrorMessage()).toBe(true);
    });

    test("shows error when password is only spaces", async () => {
      await loginPage.login("admin", "   ");

      expect(await loginPage.getMessageText()).toBe("Password is required");
      expect(await loginPage.isErrorMessage()).toBe(true);
    });
  });

  test.describe("when login fails user stays on login page", () => {
    test("does not redirect to welcome page on invalid login", async () => {
      await loginPage.login("wronguser", "wrongpassword");

      await loginPage.isDisplayed();
      await expect(loginPage.signinButton).toBeVisible();
    });

    test("preserves username field value after failed login", async () => {
      await loginPage.enterUsername("testinput");
      await loginPage.enterPassword("wrongpass");
      await loginPage.clickSignin();

      await expect(loginPage.usernameField).toHaveValue("testinput");
    });
  });
});
