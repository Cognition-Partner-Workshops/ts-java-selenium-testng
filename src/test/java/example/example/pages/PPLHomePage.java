package example.example.pages;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class PPLHomePage extends BasePage {

	@FindBy(css = "nav[aria-label='Main'] button")
	private List<WebElement> mainNavButtons;

	@FindBy(css = "a[href='/']")
	private WebElement logoLink;

	@FindBy(css = "button")
	private List<WebElement> allButtons;

	@FindBy(css = "a[href*='make-a-payment']")
	private WebElement makePaymentLink;

	@FindBy(css = "a[href*='Outages-and-Issues']")
	private WebElement reportOutageLink;

	@FindBy(css = "a[href*='Start-Stop-Move-Service']")
	private WebElement startStopMoveLink;

	@FindBy(css = "a[href='/search-results.aspx']")
	private WebElement searchLink;

	@FindBy(css = "a[href*='contact-us']")
	private WebElement contactUsLink;

	@FindBy(css = "a[href*='es.pplelectric.com']")
	private WebElement espanolLink;

	@FindBy(css = "footer")
	private WebElement footer;

	@FindBy(css = "footer a")
	private List<WebElement> footerLinks;

	@FindBy(css = "h1, h2, h3")
	private List<WebElement> headings;

	@FindBy(css = "img")
	private List<WebElement> images;

	public PPLHomePage(WebDriver driver) {
		super(driver);
	}

	public String getPageTitle() {
		return driver.getTitle();
	}

	public boolean isLogoDisplayed() {
		return logoLink.isDisplayed();
	}

	public int getMainNavButtonCount() {
		return mainNavButtons.size();
	}

	public List<WebElement> getMainNavButtons() {
		return mainNavButtons;
	}

	public String getMainNavButtonText(int index) {
		return mainNavButtons.get(index).getText().trim();
	}

	public boolean isMakePaymentLinkPresent() {
		return makePaymentLink.isDisplayed();
	}

	public boolean isReportOutageLinkPresent() {
		return reportOutageLink.isDisplayed();
	}

	public boolean isStartStopMoveLinkPresent() {
		return startStopMoveLink.isDisplayed();
	}

	public void clickSearchLink() {
		searchLink.click();
	}

	public void clickContactUsLink() {
		contactUsLink.click();
	}

	public void clickReportOutageLink() {
		reportOutageLink.click();
	}

	public boolean isFooterDisplayed() {
		return footer.isDisplayed();
	}

	public int getFooterLinkCount() {
		return footerLinks.size();
	}

	public List<WebElement> getFooterLinks() {
		return footerLinks;
	}

	public int getHeadingCount() {
		return headings.size();
	}

	public int getImageCount() {
		return images.size();
	}

	public boolean isEspanolLinkPresent() {
		return espanolLink.isDisplayed();
	}
}
