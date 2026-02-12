import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("logfile.log"),
        logging.StreamHandler(),
    ],
)

logger = logging.getLogger("selenium_pytest_framework")


def log(message: str) -> None:
    logger.info(message)


def get_logger() -> logging.Logger:
    return logger
