const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const PROFILE_DIR = path.join(__dirname, 'gmb-profile');
const IMAGES_DIR = path.join(__dirname, 'posts-finais');
const LOG_FILE = path.join(__dirname, 'posting-log.json');
const GMB_URL = 'https://www.google.com/local/business/10114823537177422096/promote/updates/add';

const SCHEDULE = JSON.parse(fs.readFileSync(path.join(__dirname, 'schedule.json'), 'utf8'));

const COPIES = [
  "🔥 BOTIJÃO DE GÁS COM ENTREGA RÁPIDA!\n\nPrecisou de gás de cozinha no Distrito Industrial? A Geovane Gás entrega botijão de gás butano 13kg em até 20 minutos!\n\n✅ Qualidade garantida\n✅ Entrega rápida e segura\n✅ Preço justo\n✅ Atendimento Dom a Dom\n\nPeça agora e receba em casa!\n\n📍 R. Segunda Rural, 179 - Distrito Industrial, Ananindeua-PA\n📞 (91) 98465-6716",
  "🛢️ GÁS BUTANO 13KG - PREÇO JUSTO!\n\nBotijão de gás butano original Paragás com o melhor preço de Ananindeua!\n\n✔️ Produto original e lacrado\n✔️ Entrega sem taxa extra\n✔️ Atendimento rápido via WhatsApp\n✔️ Clientes 5 estrelas\n\nSua cozinha nunca pode ficar sem gás!\n\n📍 R. Segunda Rural, 179 - Distrito Industrial, Ananindeua-PA\n📞 (91) 98465-6716",
  "🚚 ACABOU O GÁS? A GENTE LEVA!\n\nA correria não pode te deixar sem gás. A Geovane Gás faz entrega rápida do seu botijão de gás de cozinha em Ananindeua.\n\n⏱️ Entrega em até 20 minutos\n🏠 Distrito Industrial e regiões\n📦 Botijão de gás butano 13kg\n⭐ 5 estrelas no Google\n\nPeça agora e resolva em minutos!\n\n📍 R. Segunda Rural, 179 - Distrito Industrial, Ananindeua-PA\n📞 (91) 98465-6716",
  "🏪 DEPÓSITO DE GÁS DE CONFIANÇA!\n\nDistribuidora autorizada de gás de cozinha em Ananindeua. Botijão de gás butano, gás Paragás, entrega rápida e segura.\n\n📍 R. Segunda Rural, 179 - Distrito Industrial\n📞 (91) 98465-6716\n🕐 Dom a Dom - 07h às 22h\n⭐ 5,0 estrelas - 78 avaliações\n\nVenha conhecer!",
  "⚡ ENTREGA DE GÁS EM 20 MIN!\n\nAgilidade que você precisa! Seu gás de cozinha chega rápido em Ananindeua com a Geovane Gás.\n\n🚀 Entrega relâmpago\n🛡️ Produto seguro e lacrado\n💰 Preço justo\n📱 Peça pelo WhatsApp\n\nLigou, pediu, chegou!\n\n📍 R. Segunda Rural, 179 - Distrito Industrial, Ananindeua-PA\n📞 (91) 98465-6716",
  "🍳 GÁS DE COZINHA PARA TODOS!\n\nBotijão de gás butano 13kg para uso doméstico e comercial. Entrega sem taxa extra em Ananindeua.\n\n🏠 Casa ou comércio\n📦 Botijão de gás de cozinha\n🚚 Entrega gratuita\n⭐ Qualidade Paragás\n\nPeça já o seu!\n\n📍 R. Segunda Rural, 179 - Distrito Industrial, Ananindeua-PA\n📞 (91) 98465-6716",
  "🎉 PROMOÇÃO DE GÁS - OFERTA ESPECIAL!\n\nAproveite nossos preços especiais no botijão de gás! Oferta válida para todo Ananindeua.\n\n🔥 Preço promocional\n⏱️ Estoque limitado\n🚚 Entrega rápida\n📱 Peça agora\n\nCorra e garanta o seu!\n\n📍 R. Segunda Rural, 179 - Distrito Industrial, Ananindeua-PA\n📞 (91) 98465-6716",
  "🏆 GÁS PARAGÁS - MARCA DE CONFIANÇA!\n\nDistribuidor autorizado Paragás em Ananindeua. Botijão de gás original, lacrado e com garantia.\n\n✅ Paragás - qualidade que você confia\n✅ Botijão lacrado e seguro\n✅ Entrega rápida no Distrito Industrial\n✅ Preço justo\n\nExija qualidade, peça Paragás!\n\n📍 R. Segunda Rural, 179 - Distrito Industrial, Ananindeua-PA\n📞 (91) 98465-6716",
  "📞 DISK GÁS - LIGOU, CHEGOU!\n\nServiço de disk gás no Distrito Industrial e Ananindeua. Ligue ou mande WhatsApp que a gente leva!\n\n📲 WhatsApp: (91) 98465-6716\n⏱️ Entrega em 20min\n🕐 Dom a Dom 07h-22h\n\nDisk Gás Geovane - sempre perto de você!",
  "🏠 GÁS SEM SAIR DE CASA!\n\nPeça online e receba seu botijão de gás de cozinha sem sair de casa. Prático, rápido e seguro.\n\n📱 Peça pelo site ou WhatsApp\n🚚 Entrega na sua porta\n💰 Pagamento na entrega\n⭐ 5 estrelas no Google\n\nComodidade que você merece!\n\n📍 R. Segunda Rural, 179 - Distrito Industrial, Ananindeua-PA\n📞 (91) 98465-6716",
  "🛡️ BOTIJÃO DE GÁS SEGURO!\n\nBotijão de gás butano com lacre de segurança. Qualidade que sua família merece.\n\n🔒 Lacre original de fábrica\n✅ Produto certificado\n🏠 Para uso doméstico\n🚚 Entrega cuidadosa\n\nSua segurança é nossa prioridade!\n\n📍 R. Segunda Rural, 179 - Distrito Industrial, Ananindeua-PA\n📞 (91) 98465-6716",
  "🌙 GÁS 24 HORAS - TODOS OS DIAS!\n\nFuncionamento de domingo a domingo. Gás de cozinha quando você precisar, a qualquer hora.\n\n🕐 Dom a Dom: 07h às 22h\n📞 Peça a qualquer momento\n🚚 Entrega rápida\n⭐ Clientes satisfeitos\n\nGeovane Gás - sempre disponível!\n\n📍 R. Segunda Rural, 179 - Distrito Industrial, Ananindeua-PA\n📞 (91) 98465-6716",
  "🔥 GÁS BUTANO - O MAIS VENDIDO!\n\nBotijão de gás butano 13kg. O preferido das famílias de Ananindeua.\n\n🥇 Mais vendido da região\n💰 Preço imbatível\n🚚 Entrega em 20 minutos\n⭐ 78 avaliações 5 estrelas\n\nExperimente e comprove!\n\n📍 R. Segunda Rural, 179 - Distrito Industrial, Ananindeua-PA\n📞 (91) 98465-6716",
  "🚀 ENTREGA EXPRESS - RÁPIDO E SEGURO!\n\nSistema de entrega rápida. Peça seu gás e receba em minutos no Distrito Industrial.\n\n⏱️ Entrega em até 20 min\n📍 Distrito Industrial e Ananindeua\n📦 Botijão de gás butano 13kg\n📱 Peça pelo WhatsApp\n\nGeovane Gás - velocidade e confiança!\n\n📍 R. Segunda Rural, 179 - Distrito Industrial, Ananindeua-PA\n📞 (91) 98465-6716",
  "⭐ GEOVANE GÁS - SUA DISTRIBUIDORA!\n\nHá anos atendendo o Distrito Industrial com qualidade e respeito ao cliente. Venha conhecer!\n\n📍 R. Segunda Rural, 179\n⭐ 5,0 estrelas (78 avaliações)\n📞 (91) 98465-6716\n🕐 Dom a Dom 07h-22h\n\n\"Giovanni é ótimo entregador!\" - Ahleni Santos"
];

const CTAS = {
  'SAIBA MAIS': { label: 'Saiba mais', url: 'https://geovanegasdistritoindustrial.netlify.app/' },
  'COMPRAR AGORA': { label: 'Comprar', url: 'https://geovanegasdistritoindustrial.netlify.app/' },
  'PEÇA JÁ': { label: 'Fazer o pedido', url: 'https://wa.me/5591984656716' },
  'FALAR NO WHATSAPP': { label: 'Ligar agora', url: 'https://wa.me/5591984656716' },
  'VER OFERTAS': { label: 'Saiba mais', url: 'https://geovanegasdistritoindustrial.netlify.app/' }
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function log(msg) {
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`[${ts}] ${msg}`);
}

function loadPostLog() {
  try { return fs.existsSync(LOG_FILE) ? JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')) : []; }
  catch { return []; }
}

function savePostLog(entry) {
  const logData = loadPostLog();
  logData.push({ ...entry, timestamp: new Date().toISOString() });
  fs.writeFileSync(LOG_FILE, JSON.stringify(logData, null, 2), 'utf8');
}

async function postSingle(page, index) {
  const s = SCHEDULE[index];
  const [d, m, y] = s.day.split('/');
  const cta = CTAS[s.cta];
  const copy = COPIES[index];
  const imgFile = path.join(IMAGES_DIR, `post${String(index + 1).padStart(2, '0')}-final.png`);

  log(`\n--- Post ${index + 1}/15: ${d}/${m} ${s.time} [${s.cta}] ---`);

  // Validate image
  if (!fs.existsSync(imgFile)) {
    log(`  ✗ Imagem não encontrada: ${imgFile}`);
    savePostLog({ post: index + 1, status: 'skipped', reason: 'Image not found' });
    return false;
  }

  // Navigate to GMB
  log('  → Navegando para GMB...');
  await page.goto(GMB_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await sleep(3000);

  // Fill description
  log('  → Preenchendo descrição...');
  const descField = page.locator('textarea, [contenteditable="true"], div[role="textbox"]').first();
  await descField.click();
  await descField.fill(copy);
  await sleep(1000);
  log('  ✓ Descrição preenchida');

  // Upload image
  log('  → Enviando imagem...');
  const fileInput = page.locator('input[type="file"]').first();
  if (await fileInput.count() > 0) {
    await fileInput.setInputFiles(imgFile);
    await sleep(5000);
    log('  ✓ Imagem enviada');
  } else {
    log('  ⚠ Input de arquivo não encontrado, tentando clique...');
    const uploadBtn = page.locator('text=Selecionar imagens e vídeos').first();
    if (await uploadBtn.count() > 0) {
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        uploadBtn.click()
      ]);
      await fileChooser.setFiles(imgFile);
      await sleep(5000);
      log('  ✓ Imagem enviada via file chooser');
    }
  }

  // REGRA OBRIGATÓRIA: Ativar agendamento
  log('  → Ativando agendamento...');
  const scheduleToggle = page.locator('button[aria-label="Programar postagem"]').first();
  if (await scheduleToggle.count() > 0) {
    await scheduleToggle.click();
    await sleep(1500);
    
    // Set date - GMB uses custom text input #c2
    const dateInput = page.locator('input#c2').first();
    if (await dateInput.count() > 0) {
      await dateInput.click();
      await sleep(300);
      await dateInput.fill('');
      await dateInput.type(`${d}/${m}/${y}`, { delay: 50 });
      await sleep(1000);
      // Close calendar overlay by clicking elsewhere or pressing Escape
      await page.click('body', { position: { x: 10, y: 10 }, force: true });
      await sleep(1500);
      log(`  ✓ Data: ${d}/${m}/${y}`);
    } else {
      log('  ⚠ Campo de data não encontrado');
    }
    
    // Set time - GMB uses custom text input #c6 (combobox)
    const timeInput = page.locator('input#c6').first();
    if (await timeInput.count() > 0) {
      await timeInput.click({ force: true });
      await sleep(500);
      await timeInput.fill('');
      await timeInput.type(s.time, { delay: 100 });
      await sleep(1000);
      // Try to select from dropdown
      const option = page.locator(`[role="option"]:has-text("${s.time}")`).first();
      if (await option.count() > 0) {
        await option.click();
      } else {
        // If no dropdown option, press Enter to confirm
        await page.keyboard.press('Enter');
      }
      await sleep(500);
      log(`  ✓ Hora: ${s.time}`);
    } else {
      log('  ⚠ Campo de hora não encontrado');
    }
  } else {
    log('  ⚠ Toggle de agendamento não encontrado');
  }

  // REGRA OBRIGATÓRIA: Ativar botão CTA
  log('  → Ativando botão CTA...');
  
  // Step 1: Click the "Botão" button to expand CTA section
  const addBtn = page.locator('button[aria-label="Adicionar campos de link"], button:has-text("Botão")').first();
  if (await addBtn.count() > 0) {
    await addBtn.click();
    await sleep(1500);
    
    // Step 2: Click the dropdown that shows "Nenhum" to open CTA options
    const dropdownBtn = page.locator('button:has-text("Nenhum"), button[aria-haspopup="true"]').first();
    if (await dropdownBtn.count() > 0) {
      await dropdownBtn.click();
      await sleep(1000);
      
      // Step 3: Select the CTA type from the menu by clicking the li[role="menuitem"] directly
      const ctaMap = {
        'SAIBA MAIS': 'LEARN_MORE',
        'COMPRAR AGORA': 'SHOP',
        'PEÇA JÁ': 'ORDER',
        'FALAR NO WHATSAPP': 'CONTACT',
        'VER OFERTAS': 'GET_OFFER'
      };
      
      const ctaValue = ctaMap[s.cta];
      const menuItem = page.locator(`li[role="menuitem"][value="${ctaValue}"]`).first();
      if (await menuItem.count() > 0) {
        await menuItem.click({ force: true });
        await sleep(1000);
        log(`  ✓ CTA selecionado: ${s.cta} (${ctaValue})`);
      } else {
        log(`  ⚠ Menu item não encontrado: ${ctaValue}`);
      }
    } else {
      log('  ⚠ Dropdown CTA não encontrado');
    }
    
    // Step 4: Fill URL field - try multiple selectors with longer waits
    await sleep(2000);
    
    // Take screenshot to debug CTA state
    await page.screenshot({ path: `debug-cta-after-select-post${index + 1}.png` });
    
    const urlSelectors = [
      'input[aria-label*="link" i]',
      'input[aria-label*="URL" i]',
      'input[placeholder*="link" i]',
      'input[placeholder*="URL" i]',
      'input[aria-label*="Link" i]',
      'input[aria-label*="url" i]',
      'input[type="url"]',
      'input[type="text"][aria-label]'
    ];
    
    let urlFilled = false;
    for (const selector of urlSelectors) {
      try {
        const urlInput = page.locator(selector).first();
        if (await urlInput.count() > 0 && await urlInput.isVisible()) {
          await urlInput.click({ force: true });
          await urlInput.fill('');
          await urlInput.type(cta.url, { delay: 30 });
          urlFilled = true;
          log(`  ✓ URL CTA: ${cta.url}`);
          break;
        }
      } catch (e) {
        // Skip this selector
      }
    }
    
    if (!urlFilled) {
      // Try to find any visible input that might be the URL field
      const allInputs = page.locator('input:visible');
      const count = await allInputs.count();
      log(`  ⚠ Campo de URL não encontrado (${count} inputs visíveis)`);
      for (let i = 0; i < count; i++) {
        const input = allInputs.nth(i);
        const type = await input.getAttribute('type') || '';
        const ariaLabel = await input.getAttribute('aria-label') || '';
        const placeholder = await input.getAttribute('placeholder') || '';
        log(`    - input[${i}]: type="${type}" aria-label="${ariaLabel}" placeholder="${placeholder}"`);
      }
    }
    
    await sleep(500);
  } else {
    log('  ⚠ Botão CTA não encontrado');
  }

  // Click publish/schedule button
  log('  → Publicando...');
  const publishBtn = page.locator('button:has-text("Postagem"), button:has-text("Publicar"), button:has-text("Agendar")').first();
  if (await publishBtn.count() > 0) {
    await publishBtn.click();
    await sleep(5000);
    log('  ✓ Post publicado/agendado!');
    savePostLog({ post: index + 1, status: 'success', cta: s.cta, time: s.time, date: s.day });
    return true;
  } else {
    log('  ⚠ Botão de publicar não encontrado');
    await page.screenshot({ path: `debug-post${index + 1}.png` });
    savePostLog({ post: index + 1, status: 'error', reason: 'Publish button not found' });
    return false;
  }
}

(async () => {
  const args = process.argv.slice(2);
  const start = parseInt(args[0]) || 1;
  const end = parseInt(args[1]) || 1;

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  GMB POSTING - GEOVANE GÁS                             ║');
  console.log('║  Regras: SEMPRE CTA + SEMPRE AGENDAR                  ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

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

  let success = 0;
  let errors = 0;

  for (let i = start - 1; i < end && i < 15; i++) {
    try {
      const result = await postSingle(page, i);
      if (result) success++;
      else errors++;
    } catch (err) {
      log(`  ✗ Erro: ${err.message}`);
      errors++;
      await page.screenshot({ path: `debug-error-post${i + 1}.png` });
    }
    await sleep(3000);
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`✅ Sucesso: ${success} | ❌ Erros: ${errors}`);

  await sleep(5000);
  await browser.close();
})();
