package example.example.pages.verizon;

import org.openqa.selenium.WebDriver;

import example.example.pages.BasePage;

/**
 * Page Object for the Verizon Contact Us Page.
 */
public class VerizonContactUsPage extends BasePage {

	/** The expected URL fragment for the Contact Us page. */
	private static final String CONTACT_US_URL_FRAGMENT = "contactus";

	/**
	 * Instantiates a new Verizon Contact Us Page.
	 *
	 * @param driver the WebDriver instance
	 */
	public VerizonContactUsPage(WebDriver driver) {
		super(driver);
	}

	/**
	 * Gets the page title.
	 *
	 * @return the page title
	 */
	public String getPageTitle() {
		return driver.getTitle();
	}

	/**
	 * Gets the current URL.
	 *
	 * @return the current URL
	 */
	public String getCurrentUrl() {
		return driver.getCurrentUrl();
	}

	/**
	 * Checks if the Contact Us page is displayed by verifying the URL.
	 *
	 * @return true if the Contact Us page is displayed
	 */
	public boolean isContactUsPageDisplayed() {
		return driver.getCurrentUrl().toLowerCase().contains(CONTACT_US_URL_FRAGMENT);
	}
}
