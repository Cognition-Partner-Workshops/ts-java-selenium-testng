import pytest

from example.example.factory.page_instances_factory import get_instance
from example.example.pages.google_page import GooglePage


@pytest.mark.usefixtures("driver")
class TestGoogleSearch:

    def test_google_search(self, driver):
        """Google search test - Test description"""
        driver.get("https://www.google.co.in/")
        google_page = get_instance(GooglePage)
        google_page.search_text("abc")
        assert "abc" in driver.title, "Title doesn't contain abc : Test Failed"
