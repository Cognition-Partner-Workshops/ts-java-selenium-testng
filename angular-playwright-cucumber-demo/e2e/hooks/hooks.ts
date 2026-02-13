import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';

setDefaultTimeout(30000);

let browser: Browser;
let context: BrowserContext;
let page: Page;

BeforeAll(async function () {
  const headless = process.env['HEADLESS'] !== 'false';
  browser = await chromium.launch({ headless });
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
});

Before(async function () {
  context = await browser.newContext();
  page = await context.newPage();
  this['page'] = page;
});

After(async function (scenario) {
  if (scenario.result?.status === 'FAILED') {
    const screenshot = await page.screenshot();
    this.attach(screenshot, 'image/png');
  }
  if (context) {
    await context.close();
  }
});
