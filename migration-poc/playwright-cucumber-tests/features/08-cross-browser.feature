@cross-browser
Feature: Cross-Browser Testing - Chromium, Firefox, and WebKit
  As a QA engineer migrating from .NET to Angular
  I want to verify the Angular app works across all major browsers
  So that I can ensure cross-browser compatibility after migration

  Scenario: Login page renders correctly on Chromium
    Given I launch a "chromium" browser
    When I open the Angular login page on this browser
    Then the login page should render correctly
    And I take a screenshot named "angular-login-chromium"

  Scenario: Login page renders correctly on Firefox
    Given I launch a "firefox" browser
    When I open the Angular login page on this browser
    Then the login page should render correctly
    And I take a screenshot named "angular-login-firefox"

  Scenario: Login page renders correctly on WebKit
    Given I launch a "webkit" browser
    When I open the Angular login page on this browser
    Then the login page should render correctly
    And I take a screenshot named "angular-login-webkit"

  Scenario: Dashboard works correctly on Chromium
    Given I launch a "chromium" browser
    When I login and navigate to dashboard on this browser
    Then the dashboard should display all statistics
    And I take a screenshot named "angular-dashboard-chromium"

  Scenario: Dashboard works correctly on Firefox
    Given I launch a "firefox" browser
    When I login and navigate to dashboard on this browser
    Then the dashboard should display all statistics
    And I take a screenshot named "angular-dashboard-firefox"

  Scenario: Dashboard works correctly on WebKit
    Given I launch a "webkit" browser
    When I login and navigate to dashboard on this browser
    Then the dashboard should display all statistics
    And I take a screenshot named "angular-dashboard-webkit"

  Scenario: Employee CRUD works on Chromium
    Given I launch a "chromium" browser
    When I perform full CRUD operations on this browser
    Then all CRUD operations should complete successfully
    And I take a screenshot named "angular-crud-chromium"

  Scenario: Employee CRUD works on Firefox
    Given I launch a "firefox" browser
    When I perform full CRUD operations on this browser
    Then all CRUD operations should complete successfully
    And I take a screenshot named "angular-crud-firefox"

  Scenario: Employee CRUD works on WebKit
    Given I launch a "webkit" browser
    When I perform full CRUD operations on this browser
    Then all CRUD operations should complete successfully
    And I take a screenshot named "angular-crud-webkit"
