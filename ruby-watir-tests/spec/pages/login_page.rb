# Page Object Model - Login Page
# Encapsulates all interactions with the login page
class LoginPage
  attr_reader :browser

  def initialize(browser)
    @browser = browser
  end

  # ---- Page URL ----
  def visit
    browser.goto("#{BASE_URL}/")
    self
  end

  # ---- Element Accessors ----
  def username_field
    browser.text_field(id: "username")
  end

  def password_field
    browser.text_field(id: "password")
  end

  def signin_button
    browser.button(id: "signin-button")
  end

  def message_element
    browser.element(id: "message")
  end

  def page_title
    browser.h1
  end

  # ---- Actions ----
  def enter_username(username)
    username_field.set(username)
    self
  end

  def enter_password(password)
    password_field.set(password)
    self
  end

  def click_signin
    signin_button.click
    self
  end

  def login(username, password)
    enter_username(username)
    enter_password(password)
    click_signin
    self
  end

  # ---- Assertions / Queries ----
  def displayed?
    username_field.present? && password_field.present? && signin_button.present?
  end

  def message_text
    # Wait for message to appear
    browser.wait_until(timeout: 5) { message_element.present? }
    message_element.text
  end

  def error_message?
    message_element.present? && message_element.class_name.include?("error-message")
  end

  def success_message?
    message_element.present? && message_element.class_name.include?("success-message")
  end

  def title_text
    page_title.text
  end
end
