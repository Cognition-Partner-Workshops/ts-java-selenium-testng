package example.example.tests;

import java.util.Arrays;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;

import org.testng.ITestContext;
import org.testng.annotations.AfterClass;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.Listeners;

import example.example.context.WebDriverContext;
import example.example.listeners.LogListener;
import example.example.listeners.ReportListener;
import example.example.util.LoggerUtil;
import example.example.util.MailUtil;
import example.example.util.TestProperties;

@Listeners({ ReportListener.class, LogListener.class })
public class BaseTest {

	protected Page page;

	@BeforeSuite(alwaysRun = true)
	public void globalSetup() {
		LoggerUtil.log("************************** Test Execution Started ************************************");
		TestProperties.loadAllPropertie();
	}

	@AfterSuite(alwaysRun = true)
	public void wrapAllUp(ITestContext context) {
		int total = context.getAllTestMethods().length;
		int passed = context.getPassedTests().size();
		int failed = context.getFailedTests().size();
		int skipped = context.getSkippedTests().size();
		LoggerUtil.log("Total number of testcases : " + total);
		LoggerUtil.log("Number of testcases Passed : " + passed);
		LoggerUtil.log("Number of testcases Failed : " + failed);
		LoggerUtil.log("Number of testcases Skipped  : " + skipped);
		boolean mailSent = MailUtil.sendMail(total, passed, failed, skipped);
		LoggerUtil.log("Mail sent : " + mailSent);
		LoggerUtil.log("************************** Test Execution Finished ************************************");
	}

	@BeforeClass
	protected void setup() {
		Playwright playwright = Playwright.create();
		Browser browser = playwright.chromium().launch(
				new BrowserType.LaunchOptions()
						.setHeadless(true)
						.setArgs(Arrays.asList("--no-sandbox", "--disable-dev-shm-usage")));
		BrowserContext browserContext = browser.newContext(
				new Browser.NewContextOptions().setViewportSize(1920, 1080));
		page = browserContext.newPage();
		page.setDefaultTimeout(10000);
		WebDriverContext.setPlaywright(playwright);
		WebDriverContext.setBrowser(browser);
		WebDriverContext.setBrowserContext(browserContext);
		WebDriverContext.setDriver(page);
	}

	@AfterClass
	public void wrapUp() {
		if (page != null) {
			page.close();
		}
		BrowserContext ctx = WebDriverContext.getBrowserContext();
		if (ctx != null) {
			ctx.close();
		}
		Browser browser = WebDriverContext.getBrowser();
		if (browser != null) {
			browser.close();
		}
		Playwright pw = WebDriverContext.getPlaywright();
		if (pw != null) {
			pw.close();
		}
		WebDriverContext.removeDriver();
		WebDriverContext.removeBrowserContext();
		WebDriverContext.removeBrowser();
		WebDriverContext.removePlaywright();
	}
}
