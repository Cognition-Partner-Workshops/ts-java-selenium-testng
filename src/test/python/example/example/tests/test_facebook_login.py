import pytest

from example.example.factory.page_instances_factory import get_instance
from example.example.pages.facebook_login_page import FacebookLoginPage


@pytest.mark.usefixtures("driver")
class TestFaceBookLogin:

    def test_facebook_login(self, driver):
        """Facebook login test - Facebook login test"""
        driver.get("https://www.facebook.com/")
        facebook_login_page = get_instance(FacebookLoginPage)
        facebook_login_page.enter_email("abc").enter_password("abc").click_sign_in()
        assert False, "Login failed : Test failed"
