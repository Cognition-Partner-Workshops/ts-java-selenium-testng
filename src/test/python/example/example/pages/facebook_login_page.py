from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webdriver import WebDriver

from example.example.pages.base_page import BasePage


class FacebookLoginPage(BasePage):

    EMAIL_INPUT = (By.ID, "email")
    PASSWORD_INPUT = (By.ID, "pass")

    def __init__(self, driver: WebDriver) -> None:
        super().__init__(driver)

    def enter_email(self, email: str) -> "FacebookLoginPage":
        email_input = self.driver.find_element(*self.EMAIL_INPUT)
        email_input.send_keys(email)
        return self

    def enter_password(self, password: str) -> "FacebookLoginPage":
        pass_input = self.driver.find_element(*self.PASSWORD_INPUT)
        pass_input.send_keys(password)
        return self

    def click_sign_in(self) -> None:
        pass_input = self.driver.find_element(*self.PASSWORD_INPUT)
        pass_input.submit()
