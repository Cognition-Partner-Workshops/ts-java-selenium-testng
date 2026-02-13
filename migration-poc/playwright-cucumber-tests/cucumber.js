module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['features/step-definitions/**/*.ts', 'features/support/**/*.ts'],
    paths: ['features/**/*.feature'],
    format: ['progress', 'json:reports/cucumber-report.json'],
    formatOptions: { snippetInterface: 'async-await' },
    publishQuiet: true
  }
};
