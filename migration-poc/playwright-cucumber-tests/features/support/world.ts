import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  legacyPage!: Page;
  angularPage!: Page;
  legacyUrl: string;
  angularUrl: string;
  screenshotDir: string;
  apiResponses: Map<string, any> = new Map();
  performanceMetrics: Map<string, number> = new Map();

  constructor(options: IWorldOptions) {
    super(options);
    this.legacyUrl = process.env.LEGACY_URL || 'http://localhost:3000';
    this.angularUrl = process.env.ANGULAR_URL || 'http://localhost:4200';
    this.screenshotDir = path.join(__dirname, '..', '..', 'screenshots');
  }

  async launchBrowser(browserType: string = 'chromium'): Promise<void> {
    const launchOptions = { headless: false, slowMo: 300 };
    switch (browserType.toLowerCase()) {
      case 'firefox':
        this.browser = await firefox.launch(launchOptions);
        break;
      case 'webkit':
        this.browser = await webkit.launch(launchOptions);
        break;
      default:
        this.browser = await chromium.launch(launchOptions);
    }
    this.context = await this.browser.newContext({ viewport: { width: 1280, height: 720 } });
    this.legacyPage = await this.context.newPage();
    this.angularPage = await this.context.newPage();
  }

  async takeScreenshot(page: Page, name: string, subfolder: string = ''): Promise<string> {
    const dir = subfolder ? path.join(this.screenshotDir, subfolder) : this.screenshotDir;
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); }
    const filePath = path.join(dir, `${name}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    return filePath;
  }

  async takeComparisonScreenshots(pageName: string): Promise<{ legacy: string; angular: string }> {
    const legacy = await this.takeScreenshot(this.legacyPage, `${pageName}-legacy`, 'legacy');
    const angular = await this.takeScreenshot(this.angularPage, `${pageName}-angular`, 'angular');
    return { legacy, angular };
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) { await this.browser.close(); }
  }
}

setWorldConstructor(CustomWorld);
