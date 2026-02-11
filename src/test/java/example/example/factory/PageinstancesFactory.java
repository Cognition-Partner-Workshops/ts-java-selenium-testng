package example.example.factory;

import java.lang.reflect.InvocationTargetException;

import com.microsoft.playwright.Page;

import example.example.context.WebDriverContext;
import example.example.pages.BasePage;

public class PageinstancesFactory {

	public static <T extends BasePage> T getInstance(Class<T> type) {
		try {
			return type.getConstructor(Page.class).newInstance(WebDriverContext.getDriver());
		} catch (InstantiationException | IllegalAccessException | IllegalArgumentException | InvocationTargetException
				| NoSuchMethodException | SecurityException e) {
			e.printStackTrace();
			return null;
		}
	}
}
