Feature: Login functionality

  Scenario: Successful login
    Given I navigate to login page
    When I enter valid username and password
    And I click on login button
    Then I should see the dashboard page

  Scenario: Invalid login
    Given I navigate to login page
    When I enter invalid credentials
    And I click on login button
    Then I should see an error message

  Scenario: Login with empty fields
    Given I navigate to login page
    When I click on login button
    Then I should see validation errors

  Scenario: Logout from dashboard
    Given I navigate to login page
    When I enter valid username and password
    And I click on login button
    Then I should see the dashboard page
    When I click on logout button
    Then I should be redirected to login page
