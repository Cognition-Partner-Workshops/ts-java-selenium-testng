package example.example.cucumber.stepdefinitions;

import java.util.concurrent.TimeUnit;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import example.example.context.WebDriverContext;
import example.example.util.LoggerUtil;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.github.bonigarcia.wdm.WebDriverManager;

/**
 * Cucumber hooks for WebDriver setup and teardown.
 */
public class Hooks {

	/** The driver. */
	private WebDriver driver;

	/**
	 * Sets up the WebDriver before each scenario.
	 */
	@Before
	public void setUp() {
		LoggerUtil.log("Setting up WebDriver for Cucumber scenario");
		WebDriverManager.chromedriver().setup();
		ChromeOptions options = new ChromeOptions();
		options.addArguments("disable-infobars");
		options.addArguments("--headless");
		options.addArguments("--no-sandbox");
		options.addArguments("--disable-dev-shm-usage");
		driver = new ChromeDriver(options);
		driver.manage().window().maximize();
		driver.manage().timeouts().implicitlyWait(10, TimeUnit.SECONDS);
		WebDriverContext.setDriver(driver);
	}

	/**
	 * Tears down the WebDriver after each scenario.
	 */
	@After
	public void tearDown() {
		LoggerUtil.log("Tearing down WebDriver after Cucumber scenario");
		if (driver != null) {
			driver.close();
			driver.quit();
		}
	}
}
