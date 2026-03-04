package example.example.cucumber.runner;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;
import org.testng.annotations.DataProvider;

/**
 * Cucumber TestNG runner for Verizon BDD tests.
 * This class integrates Cucumber with TestNG to run feature files.
 */
@CucumberOptions(
	features = "src/test/resources/features",
	glue = "example.example.cucumber.stepdefinitions",
	plugin = {
		"pretty",
		"html:target/cucumber-reports/cucumber.html",
		"json:target/cucumber-reports/cucumber.json"
	},
	tags = "@verizon",
	monochrome = true
)
public class VerizonTestRunner extends AbstractTestNGCucumberTests {

	/**
	 * Provides scenarios as data for parallel execution support.
	 *
	 * @return array of scenario data
	 */
	@Override
	@DataProvider(parallel = false)
	public Object[][] scenarios() {
		return super.scenarios();
	}
}
