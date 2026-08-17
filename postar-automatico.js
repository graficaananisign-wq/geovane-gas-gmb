const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCHEDULE = JSON.parse(fs.readFileSync(path.join(__dirname, 'schedule.json'), 'utf8'));

const CTAS = {
  'SAIBA MAIS': { url: 'https://geovanegasdistritoindustrial.netlify.app/' },
  'COMPRAR AGORA': { url: 'https://geovanegasdistritoindustrial.netlify.app/' },
  'PEÇA JÁ': { url: 'https://wa.me/5591984656716' },
  'FALAR NO WHATSAPP': { url: 'https://wa.me/5591984656716' },
  'VER OFERTAS': { url: 'https://geovanegasdistritoindustrial.netlify.app/' }
};

async function renderPostToImage(htmlFile) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  
  const htmlPath = path.join(__dirname, htmlFile);
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(300);
  
  const postEl = page.locator('.post');
  const imagePath = htmlPath.replace('.html', '.png');
  await postEl.screenshot({ path: imagePath });
  
  await browser.close();
  console.log(`  ✓ PNG: ${path.basename(imagePath)}`);
  return imagePath;
}

async function main() {
  console.log('=== AUTOMAÇÃO DE POSTS - GEOVANE GÁS ===\n');
  
  // List actual HTML files sorted by post number
  const files = fs.readdirSync(__dirname)
    .filter(f => /^post\d{2}-.+\.html$/.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)[0]);
      const nb = parseInt(b.match(/\d+/)[0]);
      return na - nb;
    });

  console.log(`Encontrados ${files.length} arquivos HTML\n`);

  // Render all to PNG
  console.log('Renderizando imagens...\n');
  const images = [];
  for (const f of files) {
    const pngName = f.replace('.html', '.png');
    const pngFullPath = path.join(__dirname, pngName);
    const pngExists = fs.existsSync(pngFullPath);
    if (pngExists) {
      console.log(`  ⏩ Já existe: ${pngName}`);
      images.push(pngName);
      continue;
    }
    try {
      const img = await renderPostToImage(f);
      images.push(path.basename(img));
    } catch (err) {
      console.log(`  ✗ Erro: ${f} - ${err.message}`);
    }
  }

  console.log(`\n✓ ${images.length}/${files.length} imagens prontas!\n`);

  // Mostrar cronograma
  console.log('=== CRONOGRAMA DE POSTAGENS ===');
  console.log('='.repeat(55));
  const ctaCount = {};
  for (const item of SCHEDULE) {
    const idx = SCHEDULE.indexOf(item);
    const [d, m] = item.day.split('/');
    const file = files[idx] || '---';
    console.log(`  ${String(idx+1).padStart(2,'0')}. ${d}/${m} ${item.time} | ${item.cta.padEnd(18)}| ${file}`);
    ctaCount[item.cta] = (ctaCount[item.cta] || 0) + 1;
  }
  
  console.log('\nCTAs:');
  for (const [k, v] of Object.entries(ctaCount)) {
    console.log(`  ${k.padEnd(20)} ${v}x`);
  }

  console.log('\n✓ Pronto para postar! Use chromium com user-data-dir do Chrome para login GMB.');
}

main().catch(console.error);
