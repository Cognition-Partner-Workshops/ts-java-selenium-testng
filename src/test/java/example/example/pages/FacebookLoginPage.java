package example.example.pages;

import com.microsoft.playwright.Page;

public class FacebookLoginPage extends BasePage {

	public FacebookLoginPage(Page page) {
		super(page);
	}

	public FacebookLoginPage enterEmail(String email) {
		page.locator("#email").fill(email);
		return this;
	}

	public FacebookLoginPage enterPassword(String password) {
		page.locator("#pass").fill(password);
		return this;
	}

	public void clickSignIn() {
		page.locator("[name='login']").click();
	}
}
