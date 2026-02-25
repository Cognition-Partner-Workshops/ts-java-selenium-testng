require_relative "spec_helper"

RSpec.describe "Valid Login Tests" do
  let(:login_page) { LoginPage.new(@browser) }
  let(:welcome_page) { WelcomePage.new(@browser) }

  before(:each) do
    login_page.visit
  end

  context "when login page loads" do
    it "displays the login form with all elements" do
      expect(login_page).to be_displayed
      expect(login_page.title_text).to eq("Sign In")
      expect(login_page.username_field).to be_present
      expect(login_page.password_field).to be_present
      expect(login_page.signin_button).to be_present
      expect(login_page.signin_button.text).to eq("Sign In")
    end

    it "has the correct page title" do
      expect(@browser.title).to include("Login")
    end

    it "shows placeholder text in input fields" do
      expect(login_page.username_field.attribute_value("placeholder")).to eq("Enter your username")
      expect(login_page.password_field.attribute_value("placeholder")).to eq("Enter your password")
    end

    it "has the password field masked" do
      expect(login_page.password_field.attribute_value("type")).to eq("password")
    end
  end

  context "when logging in with valid credentials (admin)" do
    it "successfully logs in and shows the welcome page" do
      login_page.login("admin", "admin123")

      expect(welcome_page).to be_displayed
      expect(welcome_page.title_text).to eq("Welcome!")
      expect(welcome_page.logged_in_as?("admin")).to be true
    end
  end

  context "when logging in with valid credentials (testuser)" do
    it "successfully logs in and shows the welcome page" do
      login_page.login("testuser", "Test@1234")

      expect(welcome_page).to be_displayed
      expect(welcome_page.title_text).to eq("Welcome!")
      expect(welcome_page.logged_in_as?("testuser")).to be true
    end
  end

  context "when logging out after successful login" do
    it "returns to the login page after logout" do
      login_page.login("admin", "admin123")

      expect(welcome_page).to be_displayed

      welcome_page.click_logout

      # Should be back on login page
      expect(login_page).to be_displayed
      expect(login_page.title_text).to eq("Sign In")
    end

    it "clears the form fields after logout" do
      login_page.login("admin", "admin123")
      expect(welcome_page).to be_displayed

      welcome_page.click_logout

      expect(login_page.username_field.value).to eq("")
      expect(login_page.password_field.value).to eq("")
    end
  end

  context "when entering text into form fields" do
    it "accepts text in the username field" do
      login_page.enter_username("testuser")
      expect(login_page.username_field.value).to eq("testuser")
    end

    it "accepts text in the password field" do
      login_page.enter_password("mypassword")
      expect(login_page.password_field.value).to eq("mypassword")
    end
  end
end
