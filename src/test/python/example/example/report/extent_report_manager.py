import os
import threading
from datetime import datetime
from typing import Optional

from example.example.context.constants import REPORT_DIRECTORY


class ExtentReportManager:

    _lock = threading.Lock()
    _test_results: list[dict[str, str]] = []
    _current_test: threading.local = threading.local()

    @classmethod
    def start_test(cls, test_name: str, desc: str) -> None:
        with cls._lock:
            cls._current_test.name = test_name
            cls._current_test.desc = desc
            cls._current_test.logs = []

    @classmethod
    def get_current_test_name(cls) -> Optional[str]:
        return getattr(cls._current_test, "name", None)

    @classmethod
    def add_log(cls, status: str, message: str, screenshot: str = "") -> None:
        with cls._lock:
            logs = getattr(cls._current_test, "logs", [])
            logs.append({
                "status": status,
                "message": message,
                "screenshot": screenshot,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            })
            cls._current_test.logs = logs

    @classmethod
    def end_current_test(cls, result: str = "PASS") -> None:
        with cls._lock:
            test_name = getattr(cls._current_test, "name", "Unknown")
            test_desc = getattr(cls._current_test, "desc", "")
            test_logs = getattr(cls._current_test, "logs", [])
            cls._test_results.append({
                "name": test_name,
                "description": test_desc,
                "result": result,
                "logs": test_logs,
            })

    @classmethod
    def flush(cls) -> None:
        report_dir = os.path.dirname(REPORT_DIRECTORY)
        os.makedirs(report_dir, exist_ok=True)

    @classmethod
    def get_test_results(cls) -> list[dict[str, str]]:
        return cls._test_results
