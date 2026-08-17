const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// ─── Configuração ──────────────────────────────────────────────────────
const DIR = __dirname;
const PROFILE_DIR = path.join(DIR, 'gmb-profile');
const LOG_FILE = path.join(DIR, 'posting-log.json');
const GMB_URL = 'https://www.google.com/local/business/10114823537177422096/promote/updates/add';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;
const POST_TIMEOUT_MS = 20000;

// ─── Dados ─────────────────────────────────────────────────────────────
const SCHEDULE = JSON.parse(fs.readFileSync(path.join(DIR, 'schedule.json'), 'utf8'));

const POST_FILES = [
  'post01-botij-o-de-g-s.png','post02-g-s-butano-13kg.png','post03-acabou-o-g-s.png',
  'post04-dep-sito-de-g-s.png','post05-entrega-de-g-s.png','post06-g-s-de-cozinha.png',
  'post07-promo-o-de-g-s.png','post08-g-s-parag-s.png','post09-disk-g-s.png',
  'post10-g-s-sem-sair-de-casa.png','post11-botij-o-de-g-s.png','post12-g-s-24-horas.png',
  'post13-g-s-butano.png','post14-entrega-express.png','post15-geovane-g-s.png'
];

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

// ─── Utilitários ───────────────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function log(message) {
  const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`[${ts}] ${message}`);
}

function loadPostLog() {
  try {
    return fs.existsSync(LOG_FILE) ? JSON.parse(fs.readFileSync(LOG_FILE, 'utf8')) : [];
  } catch { return []; }
}

function savePostLog(entry) {
  const logData = loadPostLog();
  logData.push({ ...entry, timestamp: new Date().toISOString() });
  fs.writeFileSync(LOG_FILE, JSON.stringify(logData, null, 2), 'utf8');
}

function validatePngExists(index) {
  const filePath = path.join(DIR, POST_FILES[index]);
  if (!fs.existsSync(filePath)) {
    log(`  ✗ PNG não encontrado: ${POST_FILES[index]}`);
    return false;
  }
  const stats = fs.statSync(filePath);
  if (stats.size < 1000) {
    log(`  ✗ PNG muito pequeno (${stats.size} bytes): ${POST_FILES[index]}`);
    return false;
  }
  return true;
}

// ─── Selectores resilientes com fallbacks ───────────────────────────────
async function findElement(page, selectors, description) {
  for (const sel of selectors) {
    try {
      const loc = page.locator(sel).first();
      if (await loc.count() > 0 && await loc.isVisible()) {
        return loc;
      }
    } catch {}
  }
  return null;
}

async function clickElement(page, selectors, description) {
  const el = await findElement(page, selectors, description);
  if (el) {
    await el.click();
    return true;
  }
  log(`  ⚠ Elemento não encontrado: ${description}`);
  return false;
}

// ─── Retry wrapper ─────────────────────────────────────────────────────
async function withRetry(fn, retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      log(`  ⚠ Tentativa ${attempt}/${retries} falhou: ${err.message}`);
      log(`  ⏳ Aguardando ${RETRY_DELAY_MS / 1000}s antes de retry...`);
      await sleep(RETRY_DELAY_MS);
    }
  }
}

// ─── Login check ───────────────────────────────────────────────────────
async function waitForLogin(page, timeoutSec = 30) {
  if (!page.url().includes('accounts.google.com') &&
      !page.url().includes('signin') &&
      !page.url().includes('AccountLogin')) {
    return true;
  }

  log(`  ⚠ FAÇA LOGIN no Google na janela aberta (${timeoutSec} segundos)...`);
  for (let t = timeoutSec; t > 0; t--) {
    process.stdout.write(`\r  ⏳ Aguardando login... ${t}s `);
    await sleep(1000);
    if (!page.url().includes('accounts.google.com') &&
        !page.url().includes('signin') &&
        !page.url().includes('AccountLogin')) {
      console.log('');
      log('  ✓ Login detectado!');
      await sleep(2000);
      return true;
    }
  }
  console.log('');
  return false;
}

// ─── Upload de imagem ──────────────────────────────────────────────────
async function uploadImage(page, imgFile) {
  const fileInput = await findElement(page, [
    'input[type="file"]',
    'input[accept*="image"]',
    'input[name*="file"]'
  ], 'file input');

  if (!fileInput) throw new Error('Input de arquivo não encontrado');
  await fileInput.setInputFiles(imgFile);
  await sleep(2000);
  log('  ✓ Imagem enviada');
}

// ─── Preencher texto ───────────────────────────────────────────────────
async function fillText(page, copy) {
  const textarea = await findElement(page, [
    'textarea',
    '[contenteditable="true"]',
    'div[role="textbox"]'
  ], 'text area');

  if (!textarea) throw new Error('Área de texto não encontrada');

  if (await textarea.getAttribute('contenteditable')) {
    await textarea.click();
    await textarea.fill(copy);
  } else {
    await textarea.fill(copy);
  }
  log('  ✓ Texto preenchido');
}

// ─── CTA Button ────────────────────────────────────────────────────────
async function setCTA(page, cta) {
  const ctaSelectors = [
    'button:has-text("Botão")',
    'button:has-text("Call to action")',
    'button:has-text("CTA")',
    '[data-testid*="cta"]',
    '[aria-label*="Botão"]'
  ];

  const ctaBtn = await findElement(page, ctaSelectors, 'CTA button');
  if (!ctaBtn) {
    log('  ⚠ Botão CTA não encontrado, pulando...');
    return;
  }

  await ctaBtn.click();
  await sleep(300);

  // Open dropdown
  const dropdownSelectors = [
    'button:has-text("Nenhum")',
    'button:has-text("None")',
    '[role="combobox"]',
    '[aria-haspopup="listbox"]'
  ];
  await clickElement(page, dropdownSelectors, 'CTA dropdown');
  await sleep(300);

  // Select option
  const selected = await page.evaluate((label) => {
    const items = document.querySelectorAll('[role="menuitem"], [role="option"], li');
    for (const el of items) {
      if (el.textContent.trim().toLowerCase().includes(label.toLowerCase())) {
        el.click();
        return true;
      }
    }
    return false;
  }, cta.label);

  if (!selected) {
    log(`  ⚠ Opção CTA "${cta.label}" não encontrada no menu`);
    return;
  }
  await sleep(300);

  // Fill URL
  const urlInput = await findElement(page, [
    'input[type="url"]',
    'input[placeholder*="URL"]',
    'input[placeholder*="url"]',
    'input[placeholder*="http"]'
  ], 'URL input');

  if (urlInput) {
    await urlInput.fill(cta.url);
    await urlInput.dispatchEvent('input');
    await urlInput.dispatchEvent('change');
    log('  ✓ CTA configurado');
  }
}

// ─── Agendamento ───────────────────────────────────────────────────────
async function enableSchedule(page) {
  const sw = await findElement(page, [
    '[role="switch"]',
    'input[type="checkbox"]',
    '[data-testid*="schedule"]',
    '[aria-label*="agend"]'
  ], 'schedule toggle');

  if (!sw) {
    log('  ⚠ Toggle de agendamento não encontrado');
    return;
  }

  const isChecked = await sw.getAttribute('aria-checked') ||
                    await sw.getAttribute('data-state') === 'on' ||
                    await sw.isChecked().catch(() => false);

  if (!isChecked) {
    await sw.click();
    await sleep(500);
  }
  log('  ✓ Agendamento ativado');
}

async function setScheduleDate(page, day, month, year) {
  // Try multiple strategies to set the date
  const strategies = [
    // Strategy 1: Direct input setter
    async () => {
      const result = await page.evaluate(({ d, m, y }) => {
        const inputs = document.querySelectorAll('input[type="text"], input[type="date"], input:not([type])');
        for (const input of inputs) {
          const label = input.getAttribute('aria-label') || input.getAttribute('placeholder') || '';
          if (label.toLowerCase().includes('data') || label.toLowerCase().includes('date') ||
              input.getAttribute('id')?.includes('date')) {
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setter.call(input, `${d}/${m}/${y}`);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
          }
        }
        return false;
      }, { d: day, m: month, y: year });
      return result;
    },
    // Strategy 2: Calendar picker
    async () => {
      const calBtn = await findElement(page, [
        'button[aria-label*="agenda"]',
        'button[aria-label*="calendar"]',
        'button[aria-label*="Calendar"]',
        '[data-testid*="calendar"]'
      ], 'calendar button');

      if (!calBtn) return false;

      await calBtn.click();
      await sleep(500);

      const clicked = await page.evaluate((d) => {
        const dialogs = document.querySelectorAll('[role="dialog"], [role="application"]');
        for (const dl of dialogs) {
          const btns = dl.querySelectorAll('button');
          for (const b of btns) {
            if (b.textContent.trim() === String(parseInt(d)) && !b.disabled) {
              b.click();
              return true;
            }
          }
        }
        return false;
      }, day);

      if (clicked) {
        await sleep(200);
        await clickElement(page, [
          'button:has-text("OK")',
          'button:has-text("Ok")',
          'button:has-text("Confirmar")',
          'button[aria-label*="OK"]'
        ], 'OK button');
        return true;
      }
      return false;
    },
    // Strategy 3: Keyboard input
    async () => {
      const dateInput = await findElement(page, [
        'input[aria-label*="data"]',
        'input[aria-label*="date"]',
        'input[placeholder*="dd/mm"]',
        'input[placeholder*="mm/dd"]'
      ], 'date input');

      if (!dateInput) return false;

      await dateInput.click();
      await dateInput.fill('');
      await dateInput.type(`${day}/${month}/${year}`);
      await dateInput.press('Enter');
      return true;
    }
  ];

  for (const strategy of strategies) {
    try {
      if (await strategy()) {
        log('  ✓ Data configurada');
        return true;
      }
    } catch {}
  }

  log('  ⚠ Não foi possível configurar a data automaticamente');
  return false;
}

async function setScheduleTime(page, time) {
  const timeSelectors = [
    '[role="combobox"]:has-text(":")',
    'select:has(option[value*=":"])',
    '[aria-label*="hora"]',
    '[aria-label*="time"]'
  ];

  const timeBox = await findElement(page, timeSelectors, 'time selector');
  if (!timeBox) {
    log('  ⚠ Seletor de horário não encontrado');
    return;
  }

  await timeBox.click();
  await sleep(500);

  const selected = await page.evaluate((time) => {
    const options = document.querySelectorAll('[role="option"], option, li');
    for (const o of options) {
      if (o.textContent.trim() === time) {
        o.click();
        return true;
      }
    }
    return false;
  }, time);

  if (selected) {
    log('  ✓ Horário configurado');
  } else {
    log(`  ⚠ Horário "${time}" não encontrado nas opções`);
  }
}

// ─── Submit ────────────────────────────────────────────────────────────
async function submitPost(page) {
  const submitSelectors = [
    'button:has-text("Postagem")',
    'button:has-text("Post")',
    'button:has-text("Publicar")',
    'button:has-text("Publish")',
    'button[type="submit"]'
  ];

  const submitted = await clickElement(page, submitSelectors, 'submit button');
  if (!submitted) throw new Error('Botão de envio não encontrado');

  await sleep(4000);

  const currentUrl = page.url();
  if (currentUrl.includes('promote/updates/add')) {
    return 'created';
  }
  return 'scheduled';
}

// ─── Post individual ───────────────────────────────────────────────────
async function postSingle(page, index) {
  const s = SCHEDULE[index];
  const [d, m, y] = s.day.split('/');
  const cta = CTAS[s.cta];
  const imgPath = path.join(DIR, POST_FILES[index]);
  const copy = COPIES[index];

  log(`\n--- Post ${index + 1}/15: ${d}/${m} ${s.time} [${s.cta}] ---`);

  // Validate PNG exists
  if (!validatePngExists(index)) {
    savePostLog({ post: index + 1, status: 'skipped', reason: 'PNG not found' });
    return false;
  }

  // Navigate to GMB
  await page.goto(GMB_URL, { waitUntil: 'networkidle', timeout: POST_TIMEOUT_MS });
  await sleep(2000);

  // Check login
  if (!(await waitForLogin(page))) {
    log('  ✗ Login não realizado. Pulando post.');
    savePostLog({ post: index + 1, status: 'skipped', reason: 'login failed' });
    return false;
  }

  // Execute post steps
  await withRetry(async () => {
    await uploadImage(page, imgPath);
    await fillText(page, copy);
    await setCTA(page, cta);
    await enableSchedule(page);
    await setScheduleDate(page, d, m, y);
    await setScheduleTime(page, s.time);
    await submitPost(page);
  });

  log('  ✓ Post processado com sucesso!');
  savePostLog({ post: index + 1, status: 'success', cta: s.cta, time: s.time });
  return true;
}

// ─── Main ──────────────────────────────────────────────────────────────
async function main() {
  const start = parseInt(process.argv[2]) || 1;
  const end = parseInt(process.argv[3]) || 15;

  log('=== GMB POSTING - GEOVANE GÁS ===');
  log(`Posts ${start} to ${end} of 15`);

  // Ensure profile dir exists
  if (!fs.existsSync(PROFILE_DIR)) {
    fs.mkdirSync(PROFILE_DIR, { recursive: true });
  }

  // Validate all PNGs exist before starting
  log('\nValidando imagens...');
  let validCount = 0;
  for (let i = start - 1; i < end && i < 15; i++) {
    if (validatePngExists(i)) validCount++;
  }
  log(`${validCount}/${Math.min(end - start + 1, 15)} imagens válidas\n`);

  if (validCount === 0) {
    log('✗ Nenhuma imagem válida encontrada. Execute generate-posts.js primeiro.');
    process.exit(1);
  }

  // Launch browser
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: process.env.HEADLESS === 'true',
    viewport: { width: 1280, height: 900 },
    args: ['--disable-blink-features=AutomationControlled']
  });

  const page = context.pages()[0] || await context.newPage();
  let successCount = 0;

  for (let i = start - 1; i < end && i < 15; i++) {
    try {
      if (await postSingle(page, i)) successCount++;
    } catch (err) {
      log(`  ✗ Erro fatal no post ${i + 1}: ${err.message}`);
      savePostLog({ post: i + 1, status: 'error', error: err.message });
    }
  }

  log('\n=== CONCLUÍDO ===');
  log(`Posts bem-sucedidos: ${successCount}/${Math.min(end - start + 1, 15)}`);
  log(`Log salvo em: ${LOG_FILE}`);
  log('Feche a janela do Chrome quando terminar de verificar.');

  await sleep(5000);
  await context.close();
}

main().catch(err => {
  log(`Fatal: ${err.message}`);
  process.exit(1);
});
