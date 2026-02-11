package example.example.tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import example.example.factory.PageinstancesFactory;
import example.example.pages.PPLHomePage;

@Test(testName = "PPL Electric Home Page Test", description = "Tests for PPL Electric Utilities home page")
public class PPLHomePageTest extends BaseTest {

	private static final String PPL_HOME_URL = "https://www.pplelectric.com/";

	@Test(priority = 1)
	public void verifyHomePageLoads() {
		driver.get(PPL_HOME_URL);
		PPLHomePage homePage = PageinstancesFactory.getInstance(PPLHomePage.class);
		String title = homePage.getPageTitle();
		Assert.assertNotNull(title, "Page title should not be null");
		Assert.assertFalse(title.isEmpty(), "Page title should not be empty");
	}

	@Test(priority = 2)
	public void verifyLogoIsDisplayed() {
		driver.get(PPL_HOME_URL);
		PPLHomePage homePage = PageinstancesFactory.getInstance(PPLHomePage.class);
		Assert.assertTrue(homePage.isLogoDisplayed(), "PPL logo should be displayed on the home page");
	}

	@Test(priority = 3)
	public void verifyMainNavigationMenu() {
		driver.get(PPL_HOME_URL);
		PPLHomePage homePage = PageinstancesFactory.getInstance(PPLHomePage.class);
		int navButtonCount = homePage.getMainNavButtonCount();
		Assert.assertTrue(navButtonCount >= 4, "Should have at least 4 main navigation buttons, found: " + navButtonCount);
	}

	@Test(priority = 4)
	public void verifyQuickLinksPresent() {
		driver.get(PPL_HOME_URL);
		PPLHomePage homePage = PageinstancesFactory.getInstance(PPLHomePage.class);
		Assert.assertTrue(homePage.isMakePaymentLinkPresent(), "Make a Payment quick link should be present");
		Assert.assertTrue(homePage.isReportOutageLinkPresent(), "Report an Outage quick link should be present");
		Assert.assertTrue(homePage.isStartStopMoveLinkPresent(), "Start, Stop or Move Service quick link should be present");
	}

	@Test(priority = 5)
	public void verifyFooterIsDisplayed() {
		driver.get(PPL_HOME_URL);
		PPLHomePage homePage = PageinstancesFactory.getInstance(PPLHomePage.class);
		Assert.assertTrue(homePage.isFooterDisplayed(), "Footer should be displayed");
		int footerLinkCount = homePage.getFooterLinkCount();
		Assert.assertTrue(footerLinkCount > 0, "Footer should contain links, found: " + footerLinkCount);
	}

	@Test(priority = 6)
	public void verifyImagesLoaded() {
		driver.get(PPL_HOME_URL);
		PPLHomePage homePage = PageinstancesFactory.getInstance(PPLHomePage.class);
		int imageCount = homePage.getImageCount();
		Assert.assertTrue(imageCount > 0, "Home page should have images, found: " + imageCount);
	}

	@Test(priority = 7)
	public void verifyEspanolLinkPresent() {
		driver.get(PPL_HOME_URL);
		PPLHomePage homePage = PageinstancesFactory.getInstance(PPLHomePage.class);
		Assert.assertTrue(homePage.isEspanolLinkPresent(), "Espanol link should be present for Spanish language support");
	}

	@Test(priority = 8)
	public void verifyPageHasHeadings() {
		driver.get(PPL_HOME_URL);
		PPLHomePage homePage = PageinstancesFactory.getInstance(PPLHomePage.class);
		int headingCount = homePage.getHeadingCount();
		Assert.assertTrue(headingCount > 0, "Page should have headings, found: " + headingCount);
	}
}
