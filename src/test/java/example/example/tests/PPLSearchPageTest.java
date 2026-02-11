package example.example.tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import example.example.factory.PageinstancesFactory;
import example.example.pages.PPLSearchPage;

@Test(testName = "PPL Electric Search Page Test", description = "Tests for PPL Electric Utilities search functionality")
public class PPLSearchPageTest extends BaseTest {

	private static final String PPL_SEARCH_URL = "https://www.pplelectric.com/search-results.aspx";

	@Test(priority = 1)
	public void verifySearchPageLoads() {
		driver.get(PPL_SEARCH_URL);
		PPLSearchPage searchPage = PageinstancesFactory.getInstance(PPLSearchPage.class);
		String heading = searchPage.getSearchResultsHeadingText();
		Assert.assertEquals(heading, "Search Results", "Page heading should be 'Search Results'");
	}

	@Test(priority = 2)
	public void verifySearchInputPresent() {
		driver.get(PPL_SEARCH_URL);
		PPLSearchPage searchPage = PageinstancesFactory.getInstance(PPLSearchPage.class);
		Assert.assertTrue(searchPage.isSearchInputDisplayed(), "Search input field should be displayed");
	}

	@Test(priority = 3)
	public void verifySearchButtonPresent() {
		driver.get(PPL_SEARCH_URL);
		PPLSearchPage searchPage = PageinstancesFactory.getInstance(PPLSearchPage.class);
		Assert.assertTrue(searchPage.isSearchButtonDisplayed(), "Search button should be displayed");
	}

	@Test(priority = 4)
	public void verifySearchInputPlaceholder() {
		driver.get(PPL_SEARCH_URL);
		PPLSearchPage searchPage = PageinstancesFactory.getInstance(PPLSearchPage.class);
		String placeholder = searchPage.getSearchInputPlaceholder();
		Assert.assertEquals(placeholder, "Search...", "Search input placeholder should be 'Search...'");
	}

	@Test(priority = 5)
	public void verifySearchFunctionality() {
		driver.get(PPL_SEARCH_URL);
		PPLSearchPage searchPage = PageinstancesFactory.getInstance(PPLSearchPage.class);
		searchPage.enterSearchQuery("outage");
		searchPage.clickSearchButton();
		String currentUrl = driver.getCurrentUrl();
		Assert.assertTrue(currentUrl.contains("search") || currentUrl.contains("Search"),
				"After search, URL should contain 'search', found: " + currentUrl);
	}

	@Test(priority = 6)
	public void verifyFooterOnSearchPage() {
		driver.get(PPL_SEARCH_URL);
		PPLSearchPage searchPage = PageinstancesFactory.getInstance(PPLSearchPage.class);
		Assert.assertTrue(searchPage.isFooterDisplayed(), "Footer should be displayed on search page");
	}
}
