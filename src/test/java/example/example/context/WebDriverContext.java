package example.example.context;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;

public class WebDriverContext {

	private static InheritableThreadLocal<Page> pageInstance = new InheritableThreadLocal<>();
	private static InheritableThreadLocal<Browser> browserInstance = new InheritableThreadLocal<>();
	private static InheritableThreadLocal<BrowserContext> browserContextInstance = new InheritableThreadLocal<>();
	private static InheritableThreadLocal<Playwright> playwrightInstance = new InheritableThreadLocal<>();

	public static Page getDriver() {
		if (pageInstance.get() == null)
			throw new IllegalStateException(
					"Page has not been set, Please set Page instance by WebDriverContext.setDriver...");
		else
			return pageInstance.get();
	}

	public static void setDriver(Page page) {
		pageInstance.set(page);
	}

	public static void removeDriver() {
		pageInstance.remove();
	}

	public static Browser getBrowser() {
		return browserInstance.get();
	}

	public static void setBrowser(Browser browser) {
		browserInstance.set(browser);
	}

	public static void removeBrowser() {
		browserInstance.remove();
	}

	public static BrowserContext getBrowserContext() {
		return browserContextInstance.get();
	}

	public static void setBrowserContext(BrowserContext context) {
		browserContextInstance.set(context);
	}

	public static void removeBrowserContext() {
		browserContextInstance.remove();
	}

	public static Playwright getPlaywright() {
		return playwrightInstance.get();
	}

	public static void setPlaywright(Playwright playwright) {
		playwrightInstance.set(playwright);
	}

	public static void removePlaywright() {
		playwrightInstance.remove();
	}
}
