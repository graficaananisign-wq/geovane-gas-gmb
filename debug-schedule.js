const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launchPersistentContext('./gmb-profile', {
    headless: false,
    args: ['--no-sandbox','--disable-blink-features=AutomationControlled']
  });
  const page = browser.pages()[0] || await browser.newPage();
  await page.goto('https://www.google.com/local/business/10114823537177422096/promote/updates/add');
  await page.waitForTimeout(5000);
  
  // Check schedule toggle
  const schedBtn = await page.locator('button[aria-label="Programar postagem"]').count();
  console.log('Schedule toggle buttons found:', schedBtn);
  
  // Click schedule toggle
  if (schedBtn > 0) {
    await page.locator('button[aria-label="Programar postagem"]').first().click();
    await page.waitForTimeout(2000);
    
    // Check date/time inputs
    const dateInputs = await page.locator('input[type="date"]').count();
    const timeInputs = await page.locator('input[type="time"]').count();
    console.log('Date inputs:', dateInputs, 'Time inputs:', timeInputs);
    
    // Check all visible inputs
    const allInputs = await page.locator('input:visible').count();
    console.log('Visible inputs on page:', allInputs);
    
    // Save HTML
    const html = await page.content();
    require('fs').writeFileSync('debug-after-schedule.html', html);
    console.log('HTML saved');
    
    // Screenshot
    await page.screenshot({ path: 'debug-after-schedule.png', fullPage: true });
    console.log('Screenshot saved');
  }
  
  await browser.close();
})();
