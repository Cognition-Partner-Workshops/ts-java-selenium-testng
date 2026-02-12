import pytest

from example.example.report.extent_report_manager import ExtentReportManager
from example.example.util.logger_util import log, get_logger
from example.example.util.report_util import add_screenshot


def report_on_test_start(item: pytest.Item) -> None:
    test_name = item.name
    test_desc = item.obj.__doc__ or test_name
    ExtentReportManager.start_test(test_name, test_desc)
    log(f"{test_name}: Test started")


def report_on_test_success(item: pytest.Item) -> None:
    test_name = item.name
    screenshot = add_screenshot("Test Passed", status="PASS")
    ExtentReportManager.add_log("PASS", "Test Passed", screenshot)
    log(f"{test_name} : Test Passed")


def report_on_test_failure(item: pytest.Item, cause: str = "") -> None:
    test_name = item.name
    screenshot = add_screenshot(f"Test Failed : {cause}", status="FAIL")
    ExtentReportManager.add_log("FAIL", f"Test Failed : {cause}", screenshot)
    get_logger().fatal("%s : Test Failed : %s", test_name, cause)


def report_on_test_skipped(item: pytest.Item) -> None:
    test_name = item.name
    log(f"{test_name} : Test Skipped")


def report_on_test_finish(item: pytest.Item, result: str = "PASS") -> None:
    ExtentReportManager.end_current_test(result)
    ExtentReportManager.flush()
