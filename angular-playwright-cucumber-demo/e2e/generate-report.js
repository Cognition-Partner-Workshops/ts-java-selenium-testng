const reporter = require('cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

const reportsDir = path.join(__dirname, 'reports');
const jsonFile = path.join(reportsDir, 'cucumber-report.json');

if (!fs.existsSync(jsonFile)) {
  console.log('No cucumber-report.json found. Run tests first with: npm run test:bdd');
  process.exit(1);
}

const options = {
  theme: 'bootstrap',
  jsonFile: jsonFile,
  output: path.join(reportsDir, 'cucumber-html-report.html'),
  reportSuiteAsScenarios: true,
  scenarioTimestamp: true,
  launchReport: false,
  metadata: {
    'App Version': '1.0.0',
    'Test Environment': 'Local',
    Browser: 'Chromium (Playwright)',
    Platform: process.platform,
    Executed: 'Local'
  }
};

reporter.generate(options);
console.log('Cucumber HTML report generated at: e2e/reports/cucumber-html-report.html');
