from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.remote.webdriver import WebDriver

from example.example.pages.base_page import BasePage


class GooglePage(BasePage):

    SEARCH_INPUT = (By.NAME, "q")

    def __init__(self, driver: WebDriver) -> None:
        super().__init__(driver)

    def search_text(self, key: str) -> None:
        search_input = self.driver.find_element(*self.SEARCH_INPUT)
        search_input.send_keys(key + Keys.ENTER)
