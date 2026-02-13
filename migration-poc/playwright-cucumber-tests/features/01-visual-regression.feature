@visual-regression
Feature: Visual Regression Testing - .NET vs Angular UI Comparison
  As a QA engineer migrating from .NET to Angular
  I want to compare the visual appearance of both applications
  So that I can ensure the Angular app looks the same as the legacy .NET app

  @ui-rendering
  Scenario: Compare Login Page rendering between .NET and Angular
    Given I open the legacy .NET login page
    And I open the Angular login page
    When I take screenshots of both login pages
    Then both login pages should have similar visual structure
    And screenshots should be saved for comparison

  @ui-rendering
  Scenario: Compare Dashboard Page rendering between .NET and Angular
    Given I am logged into the legacy .NET application
    And I am logged into the Angular application
    When I navigate to the dashboard on both apps
    And I take screenshots of both dashboard pages
    Then both dashboards should display stats cards
    And screenshots should be saved for comparison

  @ui-rendering
  Scenario: Compare Employee List Page rendering between .NET and Angular
    Given I am logged into the legacy .NET application
    And I am logged into the Angular application
    When I navigate to the employee list on both apps
    And I take screenshots of both employee list pages
    Then both pages should display an employee table
    And screenshots should be saved for comparison

  @ui-rendering
  Scenario: Compare Employee Form Page rendering between .NET and Angular
    Given I am logged into the legacy .NET application
    And I am logged into the Angular application
    When I navigate to the add employee form on both apps
    And I take screenshots of both employee form pages
    Then both forms should have name, email, department, and salary fields
    And screenshots should be saved for comparison
