# Playwright + Cucumber Migration Testing Framework - Complete Instructions

## Overview

This framework uses **Playwright** with **Cucumber BDD** to validate the migration of a **.NET MVC application** to an **Angular application**. It provides comprehensive test coverage across 8 categories ensuring nothing breaks during migration.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Setup & Installation](#setup--installation)
4. [Running the Applications](#running-the-applications)
5. [Running Tests](#running-tests)
6. [Test Scenarios Covered](#test-scenarios-covered)
7. [Screenshot Comparison Strategy](#screenshot-comparison-strategy)
8. [Configuration Options](#configuration-options)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Angular CLI** >= 17.x (for Angular app)
- **Playwright browsers** (installed automatically)

---

## Project Structure

```
migration-poc/
├── legacy-dotnet-app/          # Simulated .NET MVC application
│   ├── server.js               # Express backend (simulates .NET API)
│   ├── views/                  # HTML views (simulates Razor views)
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── employees.html
│   │   └── employee-form.html
│   └── public/
│       └── styles.css
├── angular-app/                # Migrated Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/     # Angular components
│   │   │   ├── services/       # Angular services
│   │   │   └── app.routes.ts   # Routing configuration
│   │   └── styles.css          # Global styles (matching legacy)
│   └── angular.json
├── playwright-cucumber-tests/  # Test framework
│   ├── cucumber.js             # Cucumber configuration
│   ├── tsconfig.json           # TypeScript configuration
│   ├── features/
│   │   ├── 01-visual-regression.feature
│   │   ├── 02-e2e-functional.feature
│   │   ├── 03-api-contract.feature
│   │   ├── 04-incremental-migration.feature
│   │   ├── 05-edge-cases.feature
│   │   ├── 06-performance.feature
│   │   ├── 07-accessibility.feature
│   │   ├── 08-cross-browser.feature
│   │   ├── step-definitions/
│   │   │   ├── visual-regression.steps.ts
│   │   │   ├── e2e-functional.steps.ts
│   │   │   ├── api-contract.steps.ts
│   │   │   ├── incremental-migration.steps.ts
│   │   │   ├── edge-cases.steps.ts
│   │   │   ├── performance.steps.ts
│   │   │   ├── accessibility.steps.ts
│   │   │   └── cross-browser.steps.ts
│   │   └── support/
│   │       ├── world.ts        # Custom World with Playwright integration
│   │       └── hooks.ts        # Before/After hooks
│   └── screenshots/            # Auto-generated screenshots
│       ├── legacy/
│       ├── angular/
│       ├── diff/
│       └── cross-browser/
└── PLAYWRIGHT_INSTRUCTIONS.md  # This file
```

---

## Setup & Installation

### Step 1: Install Legacy App Dependencies
```bash
cd migration-poc/legacy-dotnet-app
npm install
```

### Step 2: Install Angular App Dependencies
```bash
cd migration-poc/angular-app
npm install
```

### Step 3: Install Test Framework Dependencies
```bash
cd migration-poc/playwright-cucumber-tests
npm install
npx playwright install --with-deps chromium firefox webkit
```

---

## Running the Applications

### Start the Legacy .NET App (Port 3000)
```bash
cd migration-poc/legacy-dotnet-app
npm start
# Server runs at http://localhost:3000
```

### Start the Angular App (Port 4200)
```bash
cd migration-poc/angular-app
ng serve
# Server runs at http://localhost:4200
```

### Demo Credentials
| Username | Password  | Role  |
|----------|-----------|-------|
| admin    | admin123  | Admin |
| user1    | pass123   | User  |

---

## Running Tests

### Run All Tests
```bash
cd migration-poc/playwright-cucumber-tests
LEGACY_URL=http://localhost:3000 ANGULAR_URL=http://localhost:4200 npm test
```

### Run Tests by Category
```bash
# Visual Regression Tests
npm run test:visual

# E2E Functional Tests
npm run test:e2e

# API Contract Tests
npm run test:api

# Incremental Migration Tests
npm run test:migration

# Run by specific tag
LEGACY_URL=http://localhost:3000 ANGULAR_URL=http://localhost:4200 \
  npx cucumber-js --config cucumber.js --tags "@edge-cases"

LEGACY_URL=http://localhost:3000 ANGULAR_URL=http://localhost:4200 \
  npx cucumber-js --config cucumber.js --tags "@performance"

LEGACY_URL=http://localhost:3000 ANGULAR_URL=http://localhost:4200 \
  npx cucumber-js --config cucumber.js --tags "@accessibility"

LEGACY_URL=http://localhost:3000 ANGULAR_URL=http://localhost:4200 \
  npx cucumber-js --config cucumber.js --tags "@cross-browser"
```

### Headless vs Headed Mode
By default, tests run with `headless: false` so you can see the browser during execution. To run headless:
- Edit `features/support/world.ts` and set `headless: true` in `launchOptions`

---

## Test Scenarios Covered

### 1. Visual Regression Testing (`@visual-regression`)
**Purpose:** Compare the visual appearance of .NET and Angular pages pixel-by-pixel.

| Scenario | What It Tests |
|----------|---------------|
| Compare Login Page rendering | Login form layout, colors, fonts, spacing |
| Compare Dashboard Page rendering | Stats cards, navigation bar, layout structure |
| Compare Employee List Page rendering | Table layout, headers, row formatting |
| Compare Employee Form Page rendering | Form fields, labels, button placement |

**How it works:**
- Opens the same page on both apps simultaneously
- Takes full-page screenshots of each
- Compares DOM element presence and structure
- Saves screenshots side-by-side in `screenshots/legacy/` and `screenshots/angular/`

### 2. End-to-End Functional Tests (`@e2e`)
**Purpose:** Verify all user workflows work identically in both apps.

| Scenario | What It Tests |
|----------|---------------|
| Login workflow comparison | Successful login redirects to dashboard |
| Failed login error handling | Error messages match between apps |
| Navigation workflow | All nav links work correctly |
| Add Employee form submission | Creating new employee via form |
| Employee data display | Same data shown in employee table |
| Delete Employee workflow | Delete confirmation and list update |

**How it works:**
- Performs the same user actions on both apps in parallel
- Compares outcomes (URL changes, DOM state, visible data)
- Captures screenshots at each workflow step

### 3. API Contract Testing (`@api-contract`)
**Purpose:** Validate the API contracts are maintained after migration.

| Scenario | What It Tests |
|----------|---------------|
| Login API contract | POST /api/auth/login response structure |
| Get Employees API | GET /api/employees response format |
| Create Employee API | POST /api/employees with 201 status |
| Update Employee API | PUT /api/employees/:id field updates |
| Delete Employee API | DELETE /api/employees/:id and list verification |
| Dashboard Stats API | GET /api/dashboard/stats data structure |

**How it works:**
- Sends HTTP requests directly to the API
- Validates response status codes, structure, and data types
- Ensures Angular app can consume the same API endpoints

### 4. Incremental Migration Testing (`@incremental-migration`)
**Purpose:** Validate each page individually during page-by-page migration.

| Scenario | What It Tests |
|----------|---------------|
| Login page migration | All elements present, same inputs accepted |
| Dashboard page migration | Same statistics, same navigation |
| Employee list page migration | Same columns, same action buttons |
| Employee form page migration | Same fields, same validation rules |

**How it works:**
- Compares DOM elements between legacy and Angular versions
- Verifies element IDs, class names, and structure match
- Validates that migrated pages accept the same user inputs

### 5. Edge Cases Testing (`@edge-cases`)
**Purpose:** Verify error handling, empty states, and validation are consistent.

| Scenario | What It Tests |
|----------|---------------|
| Empty credentials validation | HTML5 required field validation |
| Wrong password error messages | Error message content matches |
| Required field validation | Form submission blocked without required data |
| Email format validation | Invalid email rejected by both apps |
| Empty employee list state | "No employees found" message shown |

**How it works:**
- Triggers error conditions on both apps
- Compares error messages and validation behavior
- Tests boundary conditions and empty states

### 6. Performance Testing (`@performance`)
**Purpose:** Compare page load times and interaction responsiveness.

| Scenario | What It Tests |
|----------|---------------|
| Login page load time | Both should load < 5 seconds |
| Dashboard page load time | Both should load < 5 seconds |
| Employee list page load time | Both should load < 5 seconds |
| Form input responsiveness | Both should respond < 500ms |

**How it works:**
- Measures time from navigation start to `networkidle` state
- Compares load times between legacy and Angular versions
- Measures form input latency
- Logs all metrics to console for comparison

### 7. Accessibility Testing (`@accessibility`)
**Purpose:** Ensure accessibility standards are maintained after migration.

| Scenario | What It Tests |
|----------|---------------|
| Tab order comparison | Username → Password → Submit order preserved |
| Form labels and ARIA | label-for associations, ARIA attributes |
| Keyboard navigation | All elements reachable via keyboard |
| Color contrast and readability | Font sizes >= 12px, sufficient contrast |

**How it works:**
- Uses keyboard navigation to test tab order
- Inspects DOM for label-input associations
- Verifies ARIA attributes presence
- Checks computed styles for font sizes and colors

### 8. Cross-Browser Testing (`@cross-browser`)
**Purpose:** Verify the Angular app works across Chromium, Firefox, and WebKit.

| Scenario | What It Tests |
|----------|---------------|
| Login on Chromium | Rendering and functionality |
| Login on Firefox | Rendering and functionality |
| Login on WebKit (Safari) | Rendering and functionality |
| Dashboard on Chromium | Stats display and layout |
| Dashboard on Firefox | Stats display and layout |
| Dashboard on WebKit | Stats display and layout |
| CRUD on Chromium | Full create/read operations |
| CRUD on Firefox | Full create/read operations |
| CRUD on WebKit | Full create/read operations |

**How it works:**
- Launches each browser engine separately
- Runs identical test flows on each
- Captures browser-specific screenshots

---

## Screenshot Comparison Strategy

Screenshots are organized in a structured directory:

```
screenshots/
├── legacy/           # .NET app screenshots (baseline)
│   ├── 01-login-page-legacy.png
│   ├── 02-dashboard-page-legacy.png
│   └── ...
├── angular/          # Angular app screenshots (comparison)
│   ├── 01-login-page-angular.png
│   ├── 02-dashboard-page-angular.png
│   └── ...
├── diff/             # Pixel difference images
│   └── ...
└── cross-browser/    # Browser-specific screenshots
    ├── angular-login-chromium.png
    ├── angular-login-firefox.png
    ├── angular-login-webkit.png
    └── ...
```

### Screenshot Naming Convention
- `{NN}-{page-name}-{app-type}.png`
- Examples: `01-login-page-legacy.png`, `01-login-page-angular.png`

### Comparison Workflow
1. Run tests against the legacy .NET app → baseline screenshots saved
2. Run tests against the Angular app → comparison screenshots saved
3. Review screenshots side-by-side to identify visual differences
4. Fix any discrepancies in the Angular app
5. Re-run tests to verify fixes

---

## Configuration Options

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `LEGACY_URL` | `http://localhost:3000` | Legacy .NET app URL |
| `ANGULAR_URL` | `http://localhost:4200` | Angular app URL |

### Browser Configuration (world.ts)
```typescript
const launchOptions = {
  headless: false,    // Set to true for CI/CD
  slowMo: 300         // Milliseconds between actions (for demo visibility)
};
```

### Viewport Configuration
```typescript
{ viewport: { width: 1280, height: 720 } }
```

---

## Troubleshooting

### Tests fail with "Connection refused"
- Ensure both apps are running (legacy on port 3000, Angular on port 4200)
- Check that the correct URLs are set via environment variables

### Browser does not launch
- Run `npx playwright install --with-deps` to install browser binaries
- On Linux, ensure required system libraries are installed

### Screenshots are blank or incorrect
- Increase `waitForTimeout` values in step definitions
- Ensure pages are fully loaded before taking screenshots
- Check network connectivity between test runner and apps

### Angular app shows blank page
- Ensure the Angular app is built and served: `ng serve`
- Check browser console for JavaScript errors
- Verify API URL in `environments/environment.ts`

### Cross-browser tests fail on WebKit
- WebKit may require additional system dependencies
- Run `npx playwright install --with-deps webkit`

---

## CI/CD Integration

To run tests in a CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Start Legacy App
  run: cd migration-poc/legacy-dotnet-app && npm start &

- name: Start Angular App
  run: cd migration-poc/angular-app && ng serve &

- name: Wait for apps to start
  run: sleep 10

- name: Run Migration Tests
  run: |
    cd migration-poc/playwright-cucumber-tests
    LEGACY_URL=http://localhost:3000 ANGULAR_URL=http://localhost:4200 npm test
  env:
    CI: true
```

For CI/CD, set `headless: true` in `world.ts` for faster execution.
