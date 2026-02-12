from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import NoSuchElementException, WebDriverException


class BasePage:

    def __init__(self, driver: WebDriver) -> None:
        self.driver = driver
        self.waiter = WebDriverWait(
            driver,
            timeout=10,
            poll_frequency=2,
            ignored_exceptions=[NoSuchElementException, WebDriverException],
        )
