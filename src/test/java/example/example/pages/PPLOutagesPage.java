package example.example.pages;

import java.util.List;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class PPLOutagesPage extends BasePage {

	@FindBy(css = "h1")
	private WebElement pageHeading;

	@FindBy(css = "app-outage-data")
	private WebElement outageDataSection;

	@FindBy(css = "app-outage-data h2")
	private WebElement outageCountHeading;

	@FindBy(css = "a[href*='report-an-out']")
	private WebElement checkOrReportIssueButton;

	@FindBy(css = "a[href*='omap']")
	private WebElement viewOutageMapLink;

	@FindBy(css = "mat-tab-header div[aria-selected]")
	private List<WebElement> tabHeaders;

	@FindBy(css = "app-call-out-block h2")
	private WebElement powerOutageHeading;

	@FindBy(css = "app-article-card h3")
	private List<WebElement> articleCardHeadings;

	public PPLOutagesPage(WebDriver driver) {
		super(driver);
	}

	public String getPageHeadingText() {
		return pageHeading.getText().trim();
	}

	public boolean isOutageDataSectionDisplayed() {
		return outageDataSection.isDisplayed();
	}

	public String getOutageCountText() {
		return outageCountHeading.getText().trim();
	}

	public boolean isCheckOrReportIssueButtonDisplayed() {
		return checkOrReportIssueButton.isDisplayed();
	}

	public boolean isViewOutageMapLinkDisplayed() {
		return viewOutageMapLink.isDisplayed();
	}

	public int getTabCount() {
		return tabHeaders.size();
	}

	public String getTabText(int index) {
		return tabHeaders.get(index).getText().trim();
	}

	public boolean isPowerOutageHeadingDisplayed() {
		return powerOutageHeading.isDisplayed();
	}

	public int getArticleCardCount() {
		return articleCardHeadings.size();
	}

	public String getArticleCardHeadingText(int index) {
		return articleCardHeadings.get(index).getText().trim();
	}
}
