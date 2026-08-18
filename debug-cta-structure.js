const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PROFILE_DIR = path.join(__dirname, 'gmb-profile');

(async () => {
  console.log('=== DEBUG: ESTRUTURA CTA ===\n');

  const browser = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    channel: 'chrome',
    args: ['--no-sandbox', '--disable-blink-features=AutomationControlled'],
    viewport: { width: 1280, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  });

  await browser.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });

  const page = browser.pages()[0] || await browser.newPage();

  console.log('→ Navegando para GMB...');
  await page.goto('https://www.google.com/local/business/10114823537177422096/promote/updates/add', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  await page.waitForTimeout(3000);

  // Find and click the Add Button CTA
  const addBtn = page.locator('button[aria-label="Adicionar campos de link"], button:has-text("Botão")').first();
  if (await addBtn.count() > 0) {
    console.log('→ Clicando no botão "Adicionar campos de link"...');
    await addBtn.click();
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ path: 'debug-cta-structure.png', fullPage: true });
    console.log('📸 Screenshot salvo: debug-cta-structure.png');
    
    // Save HTML
    const html = await page.content();
    fs.writeFileSync('debug-cta-structure.html', html);
    console.log('📄 HTML salvo: debug-cta-structure.html');
    
    // Try to find all visible elements that might be CTA options
    console.log('\n→ Procurando opções de CTA...');
    
    // Find all buttons
    const buttons = await page.locator('button').all();
    console.log(`Total de botões: ${buttons.length}`);
    
    for (let i = 0; i < Math.min(buttons.length, 20); i++) {
      const btn = buttons[i];
      const text = await btn.textContent().catch(() => '');
      const label = await btn.getAttribute('aria-label').catch(() => '');
      const visible = await btn.isVisible().catch(() => false);
      
      if (visible && (text || label)) {
        console.log(`  Botão ${i}: text="${text.trim()}" aria-label="${label}"`);
      }
    }
    
    // Find all menu items
    const menuItems = await page.locator('[role="menuitem"], [role="option"], [role="menuitemcheckbox"]').all();
    console.log(`\nMenu items encontrados: ${menuItems.length}`);
    
    for (const item of menuItems) {
      const text = await item.textContent().catch(() => '');
      const visible = await item.isVisible().catch(() => false);
      if (visible) {
        console.log(`  Menu item: "${text.trim()}"`);
      }
    }
    
    // Find all links
    const links = await page.locator('a').all();
    console.log(`\nLinks encontrados: ${links.length}`);
    
    for (let i = 0; i < Math.min(links.length, 10); i++) {
      const link = links[i];
      const text = await link.textContent().catch(() => '');
      const href = await link.getAttribute('href').catch(() => '');
      const visible = await link.isVisible().catch(() => false);
      
      if (visible && text) {
        console.log(`  Link ${i}: text="${text.trim()}" href="${href}"`);
      }
    }
    
  } else {
    console.log('❌ Botão "Adicionar campos de link" não encontrado');
  }

  console.log('\n=== DEBUG CONCLUÍDO ===');
  
  await page.waitForTimeout(2000);
  await browser.close();
})();
