package example.example.cucumber.stepdefinitions;

import org.openqa.selenium.WebDriver;
import org.testng.Assert;

import example.example.context.WebDriverContext;
import example.example.pages.verizon.VerizonContactUsPage;
import example.example.pages.verizon.VerizonHomePage;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

/**
 * Step definitions for the Verizon Contact Us feature.
 */
public class VerizonContactUsSteps {

	/** The Verizon home page object. */
	private VerizonHomePage verizonHomePage;

	/** The Verizon contact us page object. */
	private VerizonContactUsPage verizonContactUsPage;

	@Given("the user launches the Verizon website")
	public void theUserLaunchesTheVerizonWebsite() {
		WebDriver driver = WebDriverContext.getDriver();
		verizonHomePage = new VerizonHomePage(driver);
		verizonHomePage.navigateToHomePage();
	}

	@Then("the Verizon home page should be displayed")
	public void theVerizonHomePageShouldBeDisplayed() {
		Assert.assertTrue(verizonHomePage.isHomePageDisplayed(),
				"Verizon home page is not displayed. Current URL: " + verizonHomePage.getCurrentUrl());
	}

	@When("the user clicks on the Contact Us link")
	public void theUserClicksOnTheContactUsLink() {
		verizonHomePage.clickContactUs();
	}

	@Then("the Contact Us page should be displayed")
	public void theContactUsPageShouldBeDisplayed() {
		WebDriver driver = WebDriverContext.getDriver();
		verizonContactUsPage = new VerizonContactUsPage(driver);
		Assert.assertTrue(verizonContactUsPage.isContactUsPageDisplayed(),
				"Contact Us page is not displayed. Current URL: " + verizonContactUsPage.getCurrentUrl());
	}
}
