@accessibility
Feature: Accessibility Testing - Tab Order, ARIA, Screen Reader Compatibility
  As a QA engineer migrating from .NET to Angular
  I want to verify accessibility standards are maintained in the Angular app
  So that I can ensure the migrated app is accessible to all users

  Scenario: Login page tab order comparison
    Given I open the legacy .NET login page
    And I open the Angular login page
    When I tab through the login form elements on the legacy app
    And I tab through the login form elements on the Angular app
    Then both apps should follow the same tab order: username, password, submit
    And I take screenshots of tab focus states on both apps

  Scenario: Form labels and ARIA attributes comparison
    Given I am logged into the legacy .NET application
    And I am logged into the Angular application
    When I navigate to the add employee form on both apps
    And I inspect form labels and ARIA attributes on the legacy app
    And I inspect form labels and ARIA attributes on the Angular app
    Then both apps should have proper label-input associations
    And I take screenshots of accessibility inspection results

  Scenario: Navigation keyboard accessibility comparison
    Given I am logged into the legacy .NET application
    And I am logged into the Angular application
    When I navigate using only keyboard on the legacy app
    And I navigate using only keyboard on the Angular app
    Then all interactive elements should be keyboard accessible on both apps
    And I take screenshots of keyboard navigation comparison

  Scenario: Color contrast and readability comparison
    Given I open the legacy .NET login page
    And I open the Angular login page
    Then both apps should use readable font sizes
    And both apps should have sufficient color contrast
    And I take screenshots of accessibility visual comparison
