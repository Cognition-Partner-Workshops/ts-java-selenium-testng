import configparser
import os

from example.example.context.constants import PROPERTY_FILE_PATH
from example.example.util.logger_util import get_logger

_props: dict[str, str] = {}


def load_all_properties() -> None:
    global _props
    try:
        if os.path.exists(PROPERTY_FILE_PATH):
            config = configparser.ConfigParser()
            config.read(PROPERTY_FILE_PATH)
            for section in config.sections():
                for key, value in config.items(section):
                    _props[key] = value
    except Exception as e:
        get_logger().fatal("Could not load properties : %s", str(e))


def get_property(key: str) -> str:
    return _props.get(key, "")


def put_property(key: str, value: str) -> None:
    _props[key] = value
