@verizon
Feature: Verizon Contact Us Page Navigation
  As a user
  I want to navigate to the Verizon website
  And click on the Contact Us page
  So that I can find ways to contact Verizon support

  Scenario: Navigate to Verizon home page and click Contact Us
    Given the user launches the Verizon website
    Then the Verizon home page should be displayed
    When the user clicks on the Contact Us link
    Then the Contact Us page should be displayed
