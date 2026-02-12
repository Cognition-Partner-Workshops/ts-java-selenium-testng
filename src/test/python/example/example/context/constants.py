import os

WORKING_DIRECTORY = os.getcwd()

REPORT_DIRECTORY = os.path.join(WORKING_DIRECTORY, "ExtentReports", "AutomationResult.html")

PROJECT_NAME = "Your_Project_Name"

EXTENT_CONFIG_PATH = os.path.join(WORKING_DIRECTORY, "src", "test", "resources", "config", "extent-config.xml")

PROPERTY_FILE_PATH = os.path.join(WORKING_DIRECTORY, "src", "test", "resources", "config", "test.properties")
