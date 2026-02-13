import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { CustomWorld } from './world';

// Increase default timeout to 60 seconds for complex multi-step scenarios
setDefaultTimeout(60000);

Before(async function (this: CustomWorld) {
  await this.launchBrowser('chromium');
});

After(async function (this: CustomWorld) {
  await this.closeBrowser();
});
