# Angular Playwright Cucumber BDD Demo

A complete demo project showcasing **Playwright** with **Cucumber BDD** testing on an **Angular** application.

## Project Overview

This project includes:
- An Angular application with Login and Dashboard pages
- End-to-end tests using Playwright + Cucumber (BDD)
- Page Object Model (POM) design pattern
- Cucumber HTML reporting

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 21.x | Frontend framework |
| Playwright | 1.49+ | Browser automation |
| Cucumber | 11.x | BDD test framework |
| TypeScript | 5.9 | Programming language |

## Project Structure

```
angular-playwright-cucumber-demo/
├── src/                          # Angular application source
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/            # Login page component
│   │   │   └── dashboard/        # Dashboard page component
│   │   ├── services/
│   │   │   ├── auth.service.ts   # Authentication service
│   │   │   └── auth.guard.ts     # Route guard
│   │   ├── app.routes.ts         # Application routing
│   │   ├── app.config.ts         # App configuration
│   │   ├── app.ts                # Root component
│   │   └── app.html              # Root template
│   ├── styles.css                # Global styles
│   └── index.html                # Main HTML file
├── e2e/                          # End-to-end test framework
│   ├── features/                 # Cucumber feature files
│   │   └── login.feature         # Login scenarios (BDD)
│   ├── step-definitions/         # Step definition implementations
│   │   └── login.steps.ts        # Login step definitions
│   ├── pages/                    # Page Object Model classes
│   │   ├── login.page.ts         # Login page object
│   │   └── dashboard.page.ts     # Dashboard page object
│   ├── hooks/                    # Cucumber hooks
│   │   └── hooks.ts              # Before/After hooks
│   ├── reports/                  # Generated test reports
│   ├── generate-report.js        # HTML report generator
│   └── tsconfig.json             # TypeScript config for e2e
├── cucumber.js                   # Cucumber configuration
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## Prerequisites

- Node.js 18+ (tested with v22)
- npm 10+

## Installation

```bash
# Navigate to the project directory
cd angular-playwright-cucumber-demo

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

## Running the Angular Application

```bash
# Start the development server
npm start

# The app will be available at http://localhost:4200
```

### Demo Credentials

| Field    | Value       |
|----------|-------------|
| Username | `admin`     |
| Password | `password123` |

## Running Tests

> **Important:** The Angular app must be running before executing tests.

### Start the app (in one terminal):
```bash
npm start
```

### Run tests (in another terminal):

```bash
# Run BDD tests (headless mode - default)
npm run test:bdd

# Run BDD tests in headless mode explicitly
npm run test:bdd:headless

# Run BDD tests in headed mode (see the browser)
npm run test:bdd:headed
```

## Test Scenarios

The `login.feature` file includes:

| Scenario | Description |
|----------|-------------|
| Successful login | Login with valid credentials and verify dashboard |
| Invalid login | Login with wrong credentials and verify error message |
| Login with empty fields | Submit empty form and verify validation errors |
| Logout from dashboard | Login, then logout and verify redirect to login |

## Viewing Reports

### Cucumber HTML Report

After running tests, reports are automatically generated:

```bash
# Cucumber's built-in HTML report
open e2e/reports/cucumber-report.html

# Generate a styled HTML report
npm run report
open e2e/reports/cucumber-html-report.html
```

### Console Output

Test results are displayed in the console with a progress bar during execution.

## Angular Application Features

- **Login Page**: Username/password form with validation
- **Dashboard Page**: Welcome message with logged-in username
- **Logout**: Button to sign out and redirect to login
- **Form Validation**: Required field checks, minimum password length
- **Route Guard**: Protects dashboard from unauthorized access
- **Angular Routing**: Navigation between login and dashboard

## Design Patterns Used

- **Page Object Model (POM)**: Each page has a dedicated class encapsulating its selectors and actions
- **BDD (Behavior-Driven Development)**: Tests written in Gherkin syntax for readability
- **Hooks**: Cucumber hooks manage browser lifecycle (setup/teardown)
- **Data Test IDs**: All interactive elements use `data-testid` attributes for reliable selectors
