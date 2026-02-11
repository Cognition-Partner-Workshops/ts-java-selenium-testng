package example.example.pages;

import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class PPLSearchPage extends BasePage {

	@FindBy(css = "h2")
	private WebElement searchResultsHeading;

	@FindBy(css = "input[type='text']")
	private WebElement searchInput;

	@FindBy(css = "button[name='Search']")
	private WebElement searchButton;

	@FindBy(css = "footer")
	private WebElement footer;

	public PPLSearchPage(WebDriver driver) {
		super(driver);
	}

	public String getSearchResultsHeadingText() {
		return searchResultsHeading.getText().trim();
	}

	public boolean isSearchInputDisplayed() {
		return searchInput.isDisplayed();
	}

	public boolean isSearchButtonDisplayed() {
		return searchButton.isDisplayed();
	}

	public void enterSearchQuery(String query) {
		searchInput.clear();
		searchInput.sendKeys(query);
	}

	public void clickSearchButton() {
		searchButton.click();
	}

	public void searchFor(String query) {
		enterSearchQuery(query);
		searchInput.sendKeys(Keys.ENTER);
	}

	public String getSearchInputPlaceholder() {
		return searchInput.getAttribute("placeholder");
	}

	public boolean isFooterDisplayed() {
		return footer.isDisplayed();
	}
}
