const { chromium } = require('playwright');
const path = require('path');

const PROFILE_DIR = path.join(__dirname, 'gmb-profile');
const GMB_URL = 'https://www.google.com/local/business/10114823537177422096/promote/updates/add';

(async () => {
  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  });

  await browser.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  const page = browser.pages()[0] || await browser.newPage();
  
  console.log('Navegando para GMB...');
  await page.goto(GMB_URL, { waitUntil: 'networkidle', timeout: 30000 });
  
  console.log('URL:', page.url());
  console.log('Título:', await page.title());
  
  // Take screenshot
  await page.screenshot({ path: 'debug-gmb-interface.png', fullPage: true });
  console.log('Screenshot salvo em debug-gmb-interface.png');
  
  // Get page content for analysis
  const content = await page.content();
  require('fs').writeFileSync('debug-gmb-content.html', content);
  console.log('HTML salvo em debug-gmb-content.html');
  
  // Don't close browser - keep it open for further investigation
  console.log('Browser mantido aberto para investigação');
})();
