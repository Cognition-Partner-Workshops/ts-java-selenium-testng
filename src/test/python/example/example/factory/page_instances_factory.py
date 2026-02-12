from typing import Type, TypeVar

from example.example.context.web_driver_context import get_driver
from example.example.pages.base_page import BasePage

T = TypeVar("T", bound=BasePage)


def get_instance(page_class: Type[T]) -> T:
    driver = get_driver()
    return page_class(driver)
