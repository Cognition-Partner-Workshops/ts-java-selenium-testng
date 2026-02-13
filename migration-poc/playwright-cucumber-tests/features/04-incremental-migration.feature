@incremental-migration
Feature: Incremental Migration Testing - Page-by-Page Validation
  As a QA engineer migrating from .NET to Angular
  I want to validate each migrated page individually
  So that I can catch regressions early during incremental migration

  Scenario: Login page migration validation
    Given I open the legacy .NET login page
    And I open the Angular login page
    Then the Angular login page should have all elements from the legacy page
    And the Angular login form should accept the same inputs
    And I take screenshots of login page migration comparison

  Scenario: Dashboard page migration validation
    Given I am logged into the legacy .NET application
    And I am logged into the Angular application
    When I navigate to the dashboard on both apps
    Then the Angular dashboard should display the same statistics
    And the Angular dashboard should have the same navigation elements
    And I take screenshots of dashboard migration comparison

  Scenario: Employee list page migration validation
    Given I am logged into the legacy .NET application
    And I am logged into the Angular application
    When I navigate to the employee list on both apps
    Then the Angular employee list should display the same columns
    And the Angular employee list should have the same action buttons
    And I take screenshots of employee list migration comparison

  Scenario: Employee form page migration validation
    Given I am logged into the legacy .NET application
    And I am logged into the Angular application
    When I navigate to the add employee form on both apps
    Then the Angular form should have the same input fields
    And the Angular form should have the same validation rules
    And I take screenshots of employee form migration comparison
