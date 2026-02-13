@api-contract
Feature: API Contract Testing - .NET vs Angular API Validation
  As a QA engineer migrating from .NET to Angular
  I want to verify both apps make the same API calls
  So that I can ensure the Angular app interacts with the backend correctly

  Scenario: Login API contract comparison
    Given the legacy .NET backend is running
    When I send a login request with "admin" and "admin123" to the API
    Then the response should contain success, user object, and token
    And the response structure should match the expected contract

  Scenario: Get Employees API contract validation
    Given the legacy .NET backend is running
    When I request the employees list from the API
    Then the response should contain an array of employee objects
    And each employee should have id, name, email, department, and salary fields

  Scenario: Create Employee API contract validation
    Given the legacy .NET backend is running
    When I create a new employee via the API
    Then the response should contain the created employee with an id
    And the response status should be 201

  Scenario: Update Employee API contract validation
    Given the legacy .NET backend is running
    When I update an existing employee via the API
    Then the response should contain the updated employee data
    And the modified fields should reflect the changes

  Scenario: Delete Employee API contract validation
    Given the legacy .NET backend is running
    When I delete an employee via the API
    Then the response should confirm successful deletion
    And the employee should no longer appear in the list

  Scenario: Dashboard Stats API contract validation
    Given the legacy .NET backend is running
    When I request the dashboard statistics from the API
    Then the response should contain totalEmployees, totalDepartments, and averageSalary
