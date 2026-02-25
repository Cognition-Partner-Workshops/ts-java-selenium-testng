require "watir"
require "rspec"

# Load all page objects
Dir[File.join(File.dirname(__FILE__), "pages", "*.rb")].sort.each { |file| require file }

RSpec.configure do |config|
  config.formatter = :documentation

  config.before(:each) do
    args = ["--headless", "--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"]
    @browser = Watir::Browser.new :chrome, options: { args: args }
  end

  config.after(:each) do
    @browser.close if @browser
  end
end

# Base URL for the application
BASE_URL = ENV.fetch("BASE_URL", "http://localhost:3000")
