require_relative "spec_helper"

RSpec.describe "Invalid Login Tests" do
  let(:login_page) { LoginPage.new(@browser) }

  before(:each) do
    login_page.visit
  end

  context "when submitting with empty fields" do
    it "shows error when both username and password are empty" do
      login_page.click_signin

      expect(login_page.message_text).to eq("Username is required")
      expect(login_page).to be_error_message
    end

    it "shows error when username is empty but password is provided" do
      login_page.enter_password("somepassword")
      login_page.click_signin

      expect(login_page.message_text).to eq("Username is required")
      expect(login_page).to be_error_message
    end

    it "shows error when password is empty but username is provided" do
      login_page.enter_username("someuser")
      login_page.click_signin

      expect(login_page.message_text).to eq("Password is required")
      expect(login_page).to be_error_message
    end
  end

  context "when submitting with invalid credentials" do
    it "shows error for wrong username" do
      login_page.login("wronguser", "admin123")

      expect(login_page.message_text).to eq("Invalid username or password")
      expect(login_page).to be_error_message
    end

    it "shows error for wrong password" do
      login_page.login("admin", "wrongpassword")

      expect(login_page.message_text).to eq("Invalid username or password")
      expect(login_page).to be_error_message
    end

    it "shows error for both wrong username and password" do
      login_page.login("wronguser", "wrongpassword")

      expect(login_page.message_text).to eq("Invalid username or password")
      expect(login_page).to be_error_message
    end
  end

  context "when submitting with case-sensitive credentials" do
    it "shows error for username with wrong case" do
      login_page.login("Admin", "admin123")

      expect(login_page.message_text).to eq("Invalid username or password")
      expect(login_page).to be_error_message
    end

    it "shows error for password with wrong case" do
      login_page.login("admin", "Admin123")

      expect(login_page.message_text).to eq("Invalid username or password")
      expect(login_page).to be_error_message
    end
  end

  context "when submitting with special characters" do
    it "shows error for username with special characters" do
      login_page.login("<script>alert('xss')</script>", "admin123")

      expect(login_page.message_text).to eq("Invalid username or password")
      expect(login_page).to be_error_message
    end

    it "shows error for SQL injection attempt in username" do
      login_page.login("' OR 1=1 --", "password")

      expect(login_page.message_text).to eq("Invalid username or password")
      expect(login_page).to be_error_message
    end
  end

  context "when submitting with whitespace-only input" do
    it "shows error when username is only spaces" do
      login_page.login("   ", "admin123")

      expect(login_page.message_text).to eq("Username is required")
      expect(login_page).to be_error_message
    end

    it "shows error when password is only spaces" do
      login_page.login("admin", "   ")

      expect(login_page.message_text).to eq("Password is required")
      expect(login_page).to be_error_message
    end
  end

  context "when login fails user stays on login page" do
    it "does not redirect to welcome page on invalid login" do
      login_page.login("wronguser", "wrongpassword")

      # Should still be on login page
      expect(login_page).to be_displayed
      expect(login_page.signin_button).to be_present
    end

    it "preserves username field value after failed login" do
      login_page.enter_username("testinput")
      login_page.enter_password("wrongpass")
      login_page.click_signin

      # Username should still have its value
      expect(login_page.username_field.value).to eq("testinput")
    end
  end
end
