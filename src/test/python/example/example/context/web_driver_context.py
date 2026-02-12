import threading

from selenium.webdriver.remote.webdriver import WebDriver


_driver_instance: threading.local = threading.local()


def get_driver() -> WebDriver:
    driver = getattr(_driver_instance, "driver", None)
    if driver is None:
        raise RuntimeError(
            "WebDriver has not been set. "
            "Please set WebDriver instance by calling set_driver first."
        )
    return driver


def set_driver(driver: WebDriver) -> None:
    _driver_instance.driver = driver


def remove_driver() -> None:
    _driver_instance.driver = None
