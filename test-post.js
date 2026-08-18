const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const DIR = __dirname;
const PROFILE_DIR = path.join(DIR, 'gmb-profile');
const GMB_URL = 'https://www.google.com/local/business/10114823537177422096/promote/updates/add';
const IMG = path.join(DIR, 'post01-botij-o-de-g-s.png');
const COPY = `FIRE BOTIJÃO DE GÁS COM ENTREGA RÁPIDA!

Precisou de gás de cozinha no Distrito Industrial? A Geovane Gás entrega botijão de gás butano 13kg em até 20 minutos!

Qualidade garantida
Entrega rápida e segura
Preço justo
Atendimento Dom a Dom

Peça agora e receba em casa!

R. Segunda Rural, 179 - Distrito Industrial, Ananindeua-PA
(91) 98465-6716`;

async function main() {
  if (!fs.existsSync(PROFILE_DIR)) fs.mkdirSync(PROFILE_DIR, { recursive: true });

  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    headless: false,
    viewport: { width: 1280, height: 900 },
    args: ['--disable-blink-features=AutomationControlled']
  });

  const page = context.pages()[0] || await context.newPage();
  await page.goto(GMB_URL, { waitUntil: 'networkidle', timeout: 30000 });

  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  FAÇA LOGIN NO GOOGLE NA JANELA DO CHROME!             ║');
  console.log('║  Tempo ilimitado — quando terminar, aperte ENTER aqui  ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');

  await new Promise(resolve => {
    process.stdin.resume();
    process.stdin.on('data', () => resolve());
  });

  console.log('Login confirmado! Navegando para o GMB...');
  await page.goto(GMB_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  console.log('Enviando imagem...');
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(IMG);
  await new Promise(r => setTimeout(r, 3000));
  console.log('Imagem enviada!');

  console.log('Preenchendo texto...');
  const textarea = page.locator('textarea, [contenteditable="true"]').first();
  await textarea.fill(COPY);
  console.log('Texto preenchido!');

  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║  POST 1 MONTADO! Verifique no Chrome.       ║');
  console.log('║  Aperte ENTER para fechar o navegador.      ║');
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');

  await new Promise(resolve => {
    process.stdin.once('data', () => resolve());
  });

  await context.close();
  console.log('Navegador fechado. Pronto!');
}

main().catch(err => {
  console.error('Erro:', err.message);
  process.exit(1);
});
