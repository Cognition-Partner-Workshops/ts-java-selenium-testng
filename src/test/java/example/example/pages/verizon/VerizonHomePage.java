package example.example.pages.verizon;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;

import example.example.pages.BasePage;

/**
 * Page Object for the Verizon Home Page (www.verizon.com).
 */
public class VerizonHomePage extends BasePage {

	/** The Contact Us link in the footer. */
	@FindBy(xpath = "//a[contains(@href, 'contactus') or contains(text(), 'Contact Us') or contains(text(), 'Contact us')]")
	private WebElement contactUsLink;

	/**
	 * Instantiates a new Verizon Home Page.
	 *
	 * @param driver the WebDriver instance
	 */
	public VerizonHomePage(WebDriver driver) {
		super(driver);
	}

	/**
	 * Navigates to the Verizon home page.
	 */
	public void navigateToHomePage() {
		driver.get("https://www.verizon.com");
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
	 * Checks if the home page is displayed by verifying the URL contains verizon.com.
	 *
	 * @return true if the home page is displayed
	 */
	public boolean isHomePageDisplayed() {
		return driver.getCurrentUrl().contains("verizon.com");
	}

	/**
	 * Clicks the Contact Us link on the page.
	 */
	public void clickContactUs() {
		waiter.until(ExpectedConditions.elementToBeClickable(contactUsLink));
		contactUsLink.click();
	}
}
