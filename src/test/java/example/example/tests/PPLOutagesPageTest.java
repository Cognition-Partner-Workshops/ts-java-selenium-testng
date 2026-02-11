package example.example.tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import example.example.factory.PageinstancesFactory;
import example.example.pages.PPLOutagesPage;

@Test(testName = "PPL Electric Outages Page Test", description = "Tests for PPL Electric Utilities Outages and Issues page")
public class PPLOutagesPageTest extends BaseTest {

	private static final String PPL_OUTAGES_URL = "https://www.pplelectric.com/site/Outages-and-Issues";

	@Test(priority = 1)
	public void verifyOutagesPageLoads() {
		driver.get(PPL_OUTAGES_URL);
		PPLOutagesPage outagesPage = PageinstancesFactory.getInstance(PPLOutagesPage.class);
		String heading = outagesPage.getPageHeadingText();
		Assert.assertEquals(heading, "Outages and Issues", "Page heading should be 'Outages and Issues'");
	}

	@Test(priority = 2)
	public void verifyOutageDataSectionDisplayed() {
		driver.get(PPL_OUTAGES_URL);
		PPLOutagesPage outagesPage = PageinstancesFactory.getInstance(PPLOutagesPage.class);
		Assert.assertTrue(outagesPage.isOutageDataSectionDisplayed(), "Outage data section should be displayed");
	}

	@Test(priority = 3)
	public void verifyOutageCountDisplayed() {
		driver.get(PPL_OUTAGES_URL);
		PPLOutagesPage outagesPage = PageinstancesFactory.getInstance(PPLOutagesPage.class);
		String outageText = outagesPage.getOutageCountText();
		Assert.assertTrue(outageText.contains("Customers currently without power"),
				"Outage count text should contain 'Customers currently without power', found: " + outageText);
	}

	@Test(priority = 4)
	public void verifyCheckOrReportIssueButton() {
		driver.get(PPL_OUTAGES_URL);
		PPLOutagesPage outagesPage = PageinstancesFactory.getInstance(PPLOutagesPage.class);
		Assert.assertTrue(outagesPage.isCheckOrReportIssueButtonDisplayed(),
				"Check or Report Issue button should be displayed");
	}

	@Test(priority = 5)
	public void verifyOutageMapLinkDisplayed() {
		driver.get(PPL_OUTAGES_URL);
		PPLOutagesPage outagesPage = PageinstancesFactory.getInstance(PPLOutagesPage.class);
		Assert.assertTrue(outagesPage.isViewOutageMapLinkDisplayed(),
				"View Outage Map link should be displayed");
	}

	@Test(priority = 6)
	public void verifyTabsPresent() {
		driver.get(PPL_OUTAGES_URL);
		PPLOutagesPage outagesPage = PageinstancesFactory.getInstance(PPLOutagesPage.class);
		int tabCount = outagesPage.getTabCount();
		Assert.assertEquals(tabCount, 2, "Should have 2 tabs (Outages and Downed Wire)");
		Assert.assertEquals(outagesPage.getTabText(0), "Outages", "First tab should be 'Outages'");
		Assert.assertEquals(outagesPage.getTabText(1), "Downed Wire", "Second tab should be 'Downed Wire'");
	}

	@Test(priority = 7)
	public void verifyPowerOutageSection() {
		driver.get(PPL_OUTAGES_URL);
		PPLOutagesPage outagesPage = PageinstancesFactory.getInstance(PPLOutagesPage.class);
		Assert.assertTrue(outagesPage.isPowerOutageHeadingDisplayed(),
				"Power outage section heading should be displayed");
	}
}
