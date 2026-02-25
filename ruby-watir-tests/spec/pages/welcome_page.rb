# Page Object Model - Welcome Page (after successful login)
# Encapsulates all interactions with the welcome/dashboard page
class WelcomePage
  attr_reader :browser

  def initialize(browser)
    @browser = browser
  end

  # ---- Element Accessors ----
  def welcome_title
    browser.h1(id: "welcome-title")
  end

  def welcome_message
    browser.element(id: "welcome-message")
  end

  def logout_button
    browser.button(id: "logout-button")
  end

  # ---- Actions ----
  def click_logout
    logout_button.click
    self
  end

  # ---- Assertions / Queries ----
  def displayed?
    browser.wait_until(timeout: 5) { welcome_title.present? }
    welcome_title.present? && logout_button.present?
  end

  def title_text
    welcome_title.text
  end

  def message_text
    welcome_message.text
  end

  def logged_in_as?(username)
    message_text.include?(username)
  end
end
