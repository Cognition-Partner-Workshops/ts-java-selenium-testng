package example.example.pages;

import java.time.Duration;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class PPLHomePage extends BasePage {

	private WebDriverWait wait;

	@FindBy(css = "a[href*='make-a-payment']")
	private WebElement makePaymentLink;

	@FindBy(css = "a[href*='Start-Stop-Move-Service']")
	private WebElement startStopMoveLink;

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
		this.wait = new WebDriverWait(driver, Duration.ofSeconds(20));
	}

	public String getPageTitle() {
		return driver.getTitle();
	}

	public boolean isLogoDisplayed() {
		try {
			WebElement logo = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("img[src*='logo'], img[src*='Logo']")));
			return logo != null;
		} catch (Exception e) {
			return false;
		}
	}

	public int getMainNavButtonCount() {
		try {
			List<WebElement> buttons = wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.cssSelector("nav[aria-label='Main'] button, nav button")));
			return buttons.size();
		} catch (Exception e) {
			return 0;
		}
	}

	public List<WebElement> getMainNavButtons() {
		try {
			return wait.until(ExpectedConditions.presenceOfAllElementsLocatedBy(By.cssSelector("nav[aria-label='Main'] button, nav button")));
		} catch (Exception e) {
			return List.of();
		}
	}

	public boolean isMakePaymentLinkPresent() {
		try {
			WebElement link = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("a[href*='make-a-payment']")));
			return link != null;
		} catch (Exception e) {
			return false;
		}
	}

	public boolean isReportOutageLinkPresent() {
		try {
			WebElement link = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("a[href*='Outages-and-Issues'], a[href*='outages']")));
			return link != null;
		} catch (Exception e) {
			return false;
		}
	}

	public boolean isStartStopMoveLinkPresent() {
		try {
			WebElement link = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("a[href*='Start-Stop-Move-Service']")));
			return link != null;
		} catch (Exception e) {
			return false;
		}
	}

	public void clickSearchLink() {
		try {
			WebElement link = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("a[href*='search']")));
			((JavascriptExecutor) driver).executeScript("arguments[0].click();", link);
		} catch (Exception e) {
			driver.navigate().to("https://www.pplelectric.com/search-results.aspx");
		}
	}

	public void clickContactUsLink() {
		try {
			WebElement link = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("a[href*='contact']")));
			((JavascriptExecutor) driver).executeScript("arguments[0].click();", link);
		} catch (Exception e) {
			driver.navigate().to("https://pplelectric.com/site/my-account/contact-us");
		}
	}

	public void clickReportOutageLink() {
		try {
			WebElement link = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("a[href*='Outages-and-Issues']")));
			((JavascriptExecutor) driver).executeScript("arguments[0].click();", link);
		} catch (Exception e) {
			driver.navigate().to("https://www.pplelectric.com/site/Outages-and-Issues");
		}
	}

	public boolean isFooterDisplayed() {
		try {
			WebElement ft = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("footer")));
			return ft != null;
		} catch (Exception e) {
			return false;
		}
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
		try {
			WebElement link = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("a[href*='es.pplelectric.com']")));
			return link != null;
		} catch (Exception e) {
			return false;
		}
	}
}
