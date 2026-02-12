package example.example.pages;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PPLSearchPage extends BasePage {

	private WebDriverWait wait;

	@FindBy(css = "footer")
	private WebElement footer;

	public PPLSearchPage(WebDriver driver) {
		super(driver);
		this.wait = new WebDriverWait(driver, Duration.ofSeconds(20));
	}

	public String getSearchResultsHeadingText() {
		try {
			WebElement heading = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//h2[contains(text(),'Search')]")));
			return heading.getText().trim();
		} catch (Exception e) {
			return "";
		}
	}

	public boolean isSearchInputDisplayed() {
		try {
			WebElement input = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("input[type='text'], input[name*='Search'], input[placeholder*='Search']")));
			return input != null;
		} catch (Exception e) {
			return false;
		}
	}

	public boolean isSearchButtonDisplayed() {
		try {
			WebElement button = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("button[name='Search'], button[title='Search'], input[type='submit']")));
			return button != null;
		} catch (Exception e) {
			return false;
		}
	}

	public void enterSearchQuery(String query) {
		WebElement input = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("input[type='text'], input[name*='Search'], input[placeholder*='Search']")));
		((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", input);
		((JavascriptExecutor) driver).executeScript("arguments[0].focus();", input);
		((JavascriptExecutor) driver).executeScript("arguments[0].value = arguments[1];", input, query);
	}

	public void clickSearchButton() {
		WebElement button = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("button[name='Search'], button[title='Search'], input[type='submit']")));
		((JavascriptExecutor) driver).executeScript("arguments[0].click();", button);
	}

	public void searchFor(String query) {
		enterSearchQuery(query);
		clickSearchButton();
	}

	public String getSearchInputPlaceholder() {
		WebElement input = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("input[type='text'], input[name*='Search'], input[placeholder*='Search']")));
		return input.getAttribute("placeholder");
	}

	public boolean isFooterDisplayed() {
		try {
			WebElement ft = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("footer")));
			return ft != null;
		} catch (Exception e) {
			return false;
		}
	}
}
