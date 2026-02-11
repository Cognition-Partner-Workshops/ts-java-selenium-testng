package example.example.tests;

import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;

import example.example.factory.PageinstancesFactory;
import example.example.pages.PPLHomePage;

@Test(testName = "PPL Electric Navigation Test", description = "Tests for PPL Electric Utilities site navigation")
public class PPLNavigationTest extends BaseTest {

	private static final String PPL_HOME_URL = "https://www.pplelectric.com/";

	@Test(priority = 1)
	public void verifyNavigationToOutagesPage() {
		driver.get(PPL_HOME_URL);
		PPLHomePage homePage = PageinstancesFactory.getInstance(PPLHomePage.class);
		homePage.clickReportOutageLink();
		String currentUrl = driver.getCurrentUrl();
		Assert.assertTrue(currentUrl.contains("Outages"),
				"Should navigate to Outages page, current URL: " + currentUrl);
	}

	@Test(priority = 2)
	public void verifyNavigationToSearchPage() {
		driver.get(PPL_HOME_URL);
		PPLHomePage homePage = PageinstancesFactory.getInstance(PPLHomePage.class);
		homePage.clickSearchLink();
		String currentUrl = driver.getCurrentUrl();
		Assert.assertTrue(currentUrl.contains("search"),
				"Should navigate to Search page, current URL: " + currentUrl);
	}

	@Test(priority = 3)
	public void verifyContactUsNavigation() {
		driver.get(PPL_HOME_URL);
		PPLHomePage homePage = PageinstancesFactory.getInstance(PPLHomePage.class);
		homePage.clickContactUsLink();
		String currentUrl = driver.getCurrentUrl();
		Assert.assertTrue(currentUrl.contains("contact"),
				"Should navigate to Contact Us page, current URL: " + currentUrl);
	}

	@Test(priority = 4)
	public void verifyFooterLinksAreClickable() {
		driver.get(PPL_HOME_URL);
		PPLHomePage homePage = PageinstancesFactory.getInstance(PPLHomePage.class);
		List<WebElement> footerLinks = homePage.getFooterLinks();
		for (WebElement link : footerLinks) {
			String href = link.getAttribute("href");
			Assert.assertNotNull(href, "Footer link should have an href attribute");
			Assert.assertFalse(href.isEmpty(), "Footer link href should not be empty");
		}
	}

	@Test(priority = 5)
	public void verifyMainNavMenuItems() {
		driver.get(PPL_HOME_URL);
		PPLHomePage homePage = PageinstancesFactory.getInstance(PPLHomePage.class);
		List<WebElement> navButtons = homePage.getMainNavButtons();
		String[] expectedMenuItems = {"My Account", "Outages and Issues", "Ways to Save", "More"};
		Assert.assertTrue(navButtons.size() >= expectedMenuItems.length,
				"Should have at least " + expectedMenuItems.length + " nav items");
		for (int i = 0; i < expectedMenuItems.length; i++) {
			String buttonText = navButtons.get(i).getText().trim();
			Assert.assertTrue(buttonText.contains(expectedMenuItems[i]),
					"Nav button " + i + " should contain '" + expectedMenuItems[i] + "', found: '" + buttonText + "'");
		}
	}

	@Test(priority = 6)
	public void verifyPageTitleContainsPPL() {
		driver.get(PPL_HOME_URL);
		String title = driver.getTitle();
		Assert.assertTrue(title.toLowerCase().contains("ppl") || title.toLowerCase().contains("electric"),
				"Page title should contain 'PPL' or 'electric', found: " + title);
	}

	@Test(priority = 7)
	public void verifyMakePaymentLinkHref() {
		driver.get(PPL_HOME_URL);
		WebElement paymentLink = driver.findElement(By.cssSelector("a[href*='make-a-payment']"));
		String href = paymentLink.getAttribute("href");
		Assert.assertTrue(href.contains("make-a-payment"),
				"Make a Payment link should point to payment page, found: " + href);
	}

	@Test(priority = 8)
	public void verifyAllImagesHaveSrc() {
		driver.get(PPL_HOME_URL);
		List<WebElement> images = driver.findElements(By.tagName("img"));
		for (WebElement img : images) {
			String src = img.getAttribute("src");
			Assert.assertNotNull(src, "Image should have a src attribute");
			Assert.assertFalse(src.isEmpty(), "Image src should not be empty");
		}
	}
}
