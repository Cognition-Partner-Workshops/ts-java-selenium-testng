@e2e
Feature: End-to-End Functional Tests - .NET vs Angular Comparison
  As a QA engineer migrating from .NET to Angular
  I want to verify all user workflows work identically in both apps
  So that I can ensure functional parity after migration

  @user-workflows
  Scenario: Login workflow comparison between .NET and Angular
    Given I open the legacy .NET login page
    And I open the Angular login page
    When I login with "admin" and "admin123" on the legacy app
    And I login with "admin" and "admin123" on the Angular app
    Then both apps should navigate to the dashboard
    And I take screenshots of both apps after login

  @user-workflows
  Scenario: Failed login error handling comparison
    Given I open the legacy .NET login page
    And I open the Angular login page
    When I login with "wronguser" and "wrongpass" on the legacy app
    And I login with "wronguser" and "wrongpass" on the Angular app
    Then both apps should display an error message
    And I take screenshots of both login error states

  @user-workflows
  Scenario: Navigation workflow comparison between .NET and Angular
    Given I am logged into the legacy .NET application
    And I am logged into the Angular application
    When I navigate to each page on the legacy app
    And I navigate to each page on the Angular app
    Then all navigation links should work on both apps
    And I take screenshots of navigation comparison

  @user-workflows
  Scenario: Add Employee form submission comparison
    Given I am logged into the legacy .NET application
    And I am logged into the Angular application
    When I add a new employee "Test User" with email "test@company.com" on the legacy app
    And I add a new employee "Test User" with email "test@company.com" on the Angular app
    Then both apps should show success and the new employee in the list
    And I take screenshots of the add employee workflow

  @user-workflows
  Scenario: Employee data display comparison
    Given I am logged into the legacy .NET application
    And I am logged into the Angular application
    When I navigate to the employee list on both apps
    Then both apps should display the same employee data
    And I take screenshots of the employee data comparison

  @user-workflows
  Scenario: Delete Employee workflow comparison
    Given I am logged into the legacy .NET application
    And I am logged into the Angular application
    When I delete an employee on the legacy app
    And I delete an employee on the Angular app
    Then both apps should remove the employee from the list
    And I take screenshots of the delete workflow
