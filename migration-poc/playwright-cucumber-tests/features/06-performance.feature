@performance
Feature: Performance Testing - Page Load Times and Responsiveness
  As a QA engineer migrating from .NET to Angular
  I want to compare performance metrics between both applications
  So that I can ensure the Angular app performs as well or better

  Scenario: Login page load time comparison
    Given I launch a browser for performance testing
    When I measure the load time of the legacy .NET login page
    And I measure the load time of the Angular login page
    Then both pages should load within 5 seconds
    And I record the performance metrics for comparison
    And I take screenshots of both login pages after load

  Scenario: Dashboard page load time comparison
    Given I am logged into the legacy .NET application
    And I am logged into the Angular application
    When I measure the load time of the legacy dashboard
    And I measure the load time of the Angular dashboard
    Then both pages should load within 5 seconds
    And I record the performance metrics for comparison
    And I take screenshots of both dashboards after load

  Scenario: Employee list page load time comparison
    Given I am logged into the legacy .NET application
    And I am logged into the Angular application
    When I measure the load time of the legacy employee list
    And I measure the load time of the Angular employee list
    Then both pages should load within 5 seconds
    And I record the performance metrics for comparison

  Scenario: Form interaction responsiveness comparison
    Given I am logged into the legacy .NET application
    And I am logged into the Angular application
    When I measure form input responsiveness on the legacy app
    And I measure form input responsiveness on the Angular app
    Then both apps should respond to input within 2000 milliseconds
    And I record the responsiveness metrics for comparison
