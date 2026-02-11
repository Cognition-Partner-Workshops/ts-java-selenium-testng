package example.example.tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import example.example.factory.PageinstancesFactory;
import example.example.pages.GooglePage;

@Test(testName = "Google search test", description = "Test description")
public class GoogleSearchTest extends BaseTest {

	@Test
	public void googleSearchTest() {
		page.navigate("https://www.google.co.in/");
		GooglePage googlePage = PageinstancesFactory.getInstance(GooglePage.class);
		googlePage.searchText("abc");
		Assert.assertTrue(page.title().contains("abc"), "Title doesn't contain abc : Test Failed");
	}
}
