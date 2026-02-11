package example.example.util;

import java.util.Base64;

import com.relevantcodes.extentreports.LogStatus;

import example.example.context.WebDriverContext;
import example.example.report.ExtentReportManager;

public class ReportUtil {

	public static void addScreenShot(String message) {
		byte[] screenshotBytes = WebDriverContext.getDriver().screenshot();
		String base64Image = "data:image/png;base64," + Base64.getEncoder().encodeToString(screenshotBytes);
		ExtentReportManager.getCurrentTest().log(LogStatus.INFO, message,
				ExtentReportManager.getCurrentTest().addBase64ScreenShot(base64Image));
	}

	public static void addScreenShot(LogStatus status, String message) {
		byte[] screenshotBytes = WebDriverContext.getDriver().screenshot();
		String base64Image = "data:image/png;base64," + Base64.getEncoder().encodeToString(screenshotBytes);
		ExtentReportManager.getCurrentTest().log(status, message,
				ExtentReportManager.getCurrentTest().addBase64ScreenShot(base64Image));
	}

	public static void logMessage(String message, String details) {
		ExtentReportManager.getCurrentTest().log(LogStatus.INFO, message, details);
	}

	public static void logMessage(LogStatus status, String message, String details) {
		ExtentReportManager.getCurrentTest().log(status, message, details);
	}
}
