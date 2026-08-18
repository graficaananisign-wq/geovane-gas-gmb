const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    args: ['--no-sandbox'],
    channel: 'chrome'
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Abrindo GMB...');
  await page.goto('https://www.google.com/local/business/10114823537177422096/promote/updates/add', { waitUntil: 'networkidle', timeout: 60000 });
  
  console.log('URL atual:', page.url());
  console.log('Aguardando 15s para login...');
  await new Promise(r => setTimeout(r, 15000));
  
  console.log('URL apos espera:', page.url());
  
  // Check for file inputs
  const fileInputs = await page.locator('input[type="file"]').count();
  console.log('File inputs encontrados:', fileInputs);
  
  // Check for any inputs
  const allInputs = await page.locator('input').count();
  console.log('Total inputs:', allInputs);
  
  // Take screenshot
  await page.screenshot({ path: 'debug-gmb.png' });
  console.log('Screenshot salvo em debug-gmb.png');
  
  // Try to find upload button
  const buttons = await page.locator('button').allTextContents();
  console.log('Botoes encontrados:', buttons.slice(0, 10));
  
  console.log('\nPressione Ctrl+C quando terminar de verificar');
  await new Promise(r => setTimeout(r, 120000));
})();
