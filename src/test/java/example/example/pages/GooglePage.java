package example.example.pages;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;

public class GooglePage extends BasePage {

	public GooglePage(Page page) {
		super(page);
	}

	public void searchText(String key) {
		Locator searchInput = page.locator("[name='q']");
		searchInput.fill(key);
		searchInput.press("Enter");
		page.waitForLoadState();
	}

}
