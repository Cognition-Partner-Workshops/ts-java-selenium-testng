import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager

from example.example.context import web_driver_context
from example.example.listeners.pytest_listeners import (
    report_on_test_start,
    report_on_test_success,
    report_on_test_failure,
    report_on_test_skipped,
    report_on_test_finish,
)
from example.example.util.logger_util import log
from example.example.util.mail_util import send_mail
from example.example.util.test_properties import load_all_properties


_session_stats = {"total": 0, "passed": 0, "failed": 0, "skipped": 0}


@pytest.fixture(scope="session", autouse=True)
def global_setup():
    log("************************** Test Execution Started ************************************")
    load_all_properties()
    yield
    total = _session_stats["total"]
    passed = _session_stats["passed"]
    failed = _session_stats["failed"]
    skipped = _session_stats["skipped"]
    log(f"Total number of testcases : {total}")
    log(f"Number of testcases Passed : {passed}")
    log(f"Number of testcases Failed : {failed}")
    log(f"Number of testcases Skipped  : {skipped}")
    mail_sent = send_mail(total, passed, failed, skipped)
    log(f"Mail sent : {mail_sent}")
    log("************************** Test Execution Finished ************************************")


@pytest.fixture(scope="class")
def driver():
    options = webdriver.ChromeOptions()
    options.add_argument("disable-infobars")
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    chrome_driver = webdriver.Chrome(
        service=ChromeService(ChromeDriverManager().install()),
        options=options,
    )
    chrome_driver.maximize_window()
    chrome_driver.implicitly_wait(10)
    web_driver_context.set_driver(chrome_driver)
    yield chrome_driver
    if chrome_driver is not None:
        chrome_driver.close()
        chrome_driver.quit()
        web_driver_context.remove_driver()


@pytest.hookimpl(tryfirst=True)
def pytest_runtest_setup(item):
    report_on_test_start(item)


@pytest.hookimpl(trylast=True)
def pytest_runtest_makereport(item, call):
    if call.when == "call":
        _session_stats["total"] += 1
        if call.excinfo is None:
            _session_stats["passed"] += 1
            report_on_test_success(item)
            report_on_test_finish(item, "PASS")
        elif call.excinfo.typename == "Skipped":
            _session_stats["skipped"] += 1
            report_on_test_skipped(item)
            report_on_test_finish(item, "SKIP")
        else:
            _session_stats["failed"] += 1
            cause = str(call.excinfo.value) if call.excinfo.value else ""
            report_on_test_failure(item, cause)
            report_on_test_finish(item, "FAIL")
