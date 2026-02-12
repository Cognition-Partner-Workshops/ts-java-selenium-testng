from selenium.webdriver.remote.webdriver import WebDriver

from example.example.context.web_driver_context import get_driver
from example.example.util.logger_util import log


def add_screenshot(message: str, status: str = "INFO") -> str:
    try:
        driver: WebDriver = get_driver()
        screenshot_base64 = driver.get_screenshot_as_base64()
        base64_image = f"data:image/png;base64,{screenshot_base64}"
        log(f"[{status}] {message}")
        return base64_image
    except Exception as e:
        log(f"Failed to capture screenshot: {e}")
        return ""


def log_message(message: str, details: str, status: str = "INFO") -> None:
    log(f"[{status}] {message} - {details}")
