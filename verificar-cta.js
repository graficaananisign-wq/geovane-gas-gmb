const { chromium } = require('playwright');
const path = require('path');

const PROFILE_DIR = path.join(__dirname, 'gmb-profile');

(async () => {
  console.log('=== VERIFICAÇÃO DE CTA NOS POSTS AGENDADOS ===\n');

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

  // Navigate to GMB updates
  console.log('→ Navegando para GMB...');
  await page.goto('https://www.google.com/local/business/10114823537177422096/promote/updates/add', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  await page.waitForTimeout(3000);

  // Check if we need to navigate to updates list
  const currentUrl = page.url();
  console.log(`  URL atual: ${currentUrl}`);

  // Try to find scheduled posts
  console.log('→ Procurando posts agendados...');

  // Take a screenshot of the current state
  await page.screenshot({ path: 'verificacao-cta-inicio.png', fullPage: true });
  console.log('  📸 Screenshot inicial salvo: verificacao-cta-inicio.png');

  // Get all text content to see what's on the page
  const bodyText = await page.textContent('body');
  const hasSchedule = bodyText.includes('Programar') || bodyText.includes('Agendado');
  const hasCTA = bodyText.includes('Botão') || bodyText.includes('Adicionar campos de link');

  console.log(`  Toggle agendamento encontrado: ${hasSchedule ? '✓' : '✗'}`);
  console.log(`  Botão CTA encontrado: ${hasCTA ? '✓' : '✗'}`);

  // Check for scheduled posts section
  const scheduledSection = page.locator('text=Agendado, text=Agendamentos, text=Postagens agendadas').first();
  if (await scheduledSection.count() > 0) {
    console.log('  ✓ Seção de posts agendados encontrada');
    await scheduledSection.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'verificacao-cta-agendados.png', fullPage: true });
    console.log('  📸 Screenshot dos agendados salvo');
  }

  // Look for any CTA-related elements
  const ctaElements = await page.locator('[aria-label*="link"], [aria-label*="botão"], [aria-label*="cta"], [aria-label*="Link"]').count();
  console.log(`  Elementos CTA encontrados: ${ctaElements}`);

  // Check for the "Adicionar campos de link" button
  const addLinkBtn = page.locator('button[aria-label="Adicionar campos de link"], button:has-text("Botão")').first();
  if (await addLinkBtn.count() > 0) {
    console.log('  ✓ Botão "Adicionar campos de link" encontrado');
    // Click it to see the CTA options
    await addLinkBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: 'verificacao-cta-opcoes.png', fullPage: true });
    console.log('  📸 Screenshot das opções CTA salvo');
  }

  console.log('\n=== VERIFICAÇÃO CONCLUÍDA ===');
  console.log('Verifique os screenshots para confirmar visualmente se o CTA foi ativado.');
  console.log('Se o botão "Adicionar campos de link" ainda estiver visível, significa que o CTA NÃO foi ativado.\n');

  await page.waitForTimeout(2000);
  await browser.close();
})();
