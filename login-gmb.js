const { chromium } = require('playwright');
const path = require('path');

const PROFILE_DIR = path.join(__dirname, 'gmb-profile');
const GMB_URL = 'https://www.google.com/local/business/10114823537177422096/promote/updates/add';

(async () => {
  console.log('Abrindo Chrome com perfil real...');
  
  // Use persistent context to preserve login
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    args: [
      '--no-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-features=IsolateOrigins,site-per-process'
    ],
    viewport: { width: 1280, height: 800 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  });

  // Remove webdriver flag
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  const page = context.pages()[0] || await context.newPage();

  console.log('Navegando para GMB...');
  await page.goto(GMB_URL, { waitUntil: 'networkidle', timeout: 60000 });

  console.log('URL:', page.url());

  // Check if logged in
  if (page.url().includes('accounts.google.com')) {
    console.log('\n⚠️  FAÇA LOGIN no Google na janela aberta!');
    console.log('   Depois de logar, volte aqui e pressione Enter.\n');
    
    // Wait for login
    await page.waitForURL('**/local/business/**', { timeout: 300000 });
    console.log('✅ Login detectado!');
  } else {
    console.log('✅ Já logado!');
  }

  await page.screenshot({ path: 'debug-gmb-logged.png' });
  console.log('Screenshot salvo em debug-gmb-logged.png');
  console.log('\nPronto! Pressione Enter aqui para continuar...');

  // Wait for user to press Enter
  process.stdin.resume();
  await new Promise(resolve => process.stdin.once('data', resolve));

  await context.close();
  console.log('Navegador fechado.');
})();
