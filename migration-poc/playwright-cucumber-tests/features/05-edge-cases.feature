@edge-cases
Feature: Edge Cases Testing - Error Handling, Empty States, Validation
  As a QA engineer migrating from .NET to Angular
  I want to verify edge cases are handled identically in both apps
  So that I can ensure the Angular app handles errors and validation correctly

  @error-handling
  Scenario: Invalid login credentials error handling comparison
    Given I open the legacy .NET login page
    And I open the Angular login page
    When I submit empty credentials on the legacy app
    And I submit empty credentials on the Angular app
    Then both apps should show validation errors
    And I take screenshots of empty credential validation

  @error-handling
  Scenario: Wrong password error message comparison
    Given I open the legacy .NET login page
    And I open the Angular login page
    When I login with "admin" and "wrongpassword" on the legacy app
    And I login with "admin" and "wrongpassword" on the Angular app
    Then both apps should display "Invalid credentials" error
    And I take screenshots of wrong password error states

  @validation
  Scenario: Employee form required field validation comparison
    Given I am logged into the legacy .NET application
    And I am logged into the Angular application
    When I navigate to the add employee form on both apps
    And I submit the employee form without filling required fields on both apps
    Then both apps should show required field validation errors
    And I take screenshots of form validation errors

  @validation
  Scenario: Employee form email validation comparison
    Given I am logged into the legacy .NET application
    And I am logged into the Angular application
    When I navigate to the add employee form on both apps
    And I enter an invalid email format on both apps
    Then both apps should indicate the email is invalid
    And I take screenshots of email validation comparison

  @empty-states
  Scenario: Empty employee list state comparison
    Given I am logged into the legacy .NET application
    And I am logged into the Angular application
    When all employees are deleted from the database
    And I navigate to the employee list on both apps
    Then both apps should show an empty state message
    And I take screenshots of empty state comparison
