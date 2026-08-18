const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const business = {
  name: 'Geovane Gás',
  phone: '(91) 98465-6716',
  whatsapp: 'https://wa.me/5591984656716',
  site: 'https://geovanegasdistritoindustrial.netlify.app/',
  address: 'R. Segunda Rural, 179 - Distrito Industrial, Ananindeua-PA',
  rating: '5.0',
  reviews: '78'
};

const seoKeywords = [
  'botijão de gás | gás de cozinha | entrega de gás | gás butano | Ananindeua',
  'gás butano 13kg | depósito de gás | distribuidora de gás | gás Paragás',
  'entrega rápida de gás | botijão de gás Ananindeua | gás de cozinha 13kg',
  'gás de cozinha Distrito Industrial | botijão de gás butano | gás Paragás',
  'depósito de gás Ananindeua | distribuidora de gás Paragás | botijão de gás 13kg'
];

const posts = [
  { icon: '🔥', title: 'BOTIJÃO DE GÁS', subtitle: 'Entrega Rápida no Distrito Industrial', desc: 'Peça seu botijão de gás de cozinha e receba em casa em até 20 minutos.' },
  { icon: '🔵', title: 'GÁS BUTANO 13KG', subtitle: 'Preço Justo e Qualidade Garantida', desc: 'Botijão de gás butano original Paragás com o melhor preço de Ananindeua.' },
  { icon: '⚡', title: 'ACABOU O GÁS?', subtitle: 'A Gente Leva Até Você', desc: 'Não fique sem gás! Entrega express no Distrito Industrial e redondezas.' },
  { icon: '🏭', title: 'DEPÓSITO DE GÁS', subtitle: 'Confiável e Bem Localizado', desc: 'Distribuidora de gás autorizada no Distrito Industrial. Atendimento de qualidade.' },
  { icon: '🚀', title: 'ENTREGA DE GÁS', subtitle: '20 Minutos ou Menos', desc: 'Agilidade que você precisa. Seu gás de cozinha chega rápido em Ananindeua.' },
  { icon: '🏠', title: 'GÁS DE COZINHA', subtitle: 'Para Sua Casa ou Comércio', desc: 'Botijão de gás butano 13kg para uso doméstico e comercial. Entrega sem taxa extra.' },
  { icon: '💰', title: 'PROMOÇÃO DE GÁS', subtitle: 'Oferta Imperdível', desc: 'Aproveite nossos preços especiais no botijão de gás. Válido para todo Ananindeua.' },
  { icon: '✅', title: 'GÁS PARAGÁS', subtitle: 'Marca de Confiança', desc: 'Distribuidor autorizado Paragás em Ananindeua. Botijão de gás original e lacrado.' },
  { icon: '📞', title: 'DISK GÁS', subtitle: 'Ligou, Chegou!', desc: 'Serviço de disk gás no Distrito Industrial. Ligue ou mande WhatsApp.' },
  { icon: '🚚', title: 'GÁS SEM SAIR DE CASA', subtitle: 'Entrega na Sua Porta', desc: 'Peça online e receba seu botijão de gás de cozinha sem sair de casa.' },
  { icon: '🛡️', title: 'BOTIJÃO DE GÁS', subtitle: 'Segurança para Sua Família', desc: 'Botijão de gás butano com lacre de segurança. Qualidade que sua família merece.' },
  { icon: '🕐', title: 'GÁS 24 HORAS', subtitle: 'Atendimento Todos os Dias', desc: 'Funcionamento de domingo a domingo. Gás de cozinha quando você precisar.' },
  { icon: '🔥', title: 'GÁS BUTANO', subtitle: 'O Mais Vendido', desc: 'Botijão de gás butano 13kg. O preferido das famílias de Ananindeua.' },
  { icon: '💨', title: 'ENTREGA EXPRESS', subtitle: 'Rápido e Seguro', desc: 'Sistema de entrega rápida. Peça seu gás e receba em minutos.' },
  { icon: '⭐', title: 'GEOVANE GÁS', subtitle: 'Sua Distribuidora de Confiança', desc: 'Há anos atendendo o Distrito Industrial com qualidade e respeito ao cliente.' }
];

const ctas = [
  { text: 'SAIBA MAIS', url: business.site },
  { text: 'COMPRAR AGORA', url: business.site },
  { text: 'PEÇA JÁ', url: business.whatsapp },
  { text: 'FALAR NO WHATSAPP', url: business.whatsapp },
  { text: 'VER OFERTAS', url: business.site }
];

const colors = [
  ['#1a1a2e', '#e94560', '#0f3460'],
  ['#0a0a0a', '#4a90d9', '#1a1a2e'],
  ['#0d1117', '#e94560', '#161b22'],
  ['#1a1a2e', '#e94560', '#16213e'],
  ['#0f0f1a', '#25d366', '#1a1a2e'],
  ['#111827', '#f59e0b', '#1e293b'],
  ['#0a1628', '#3b82f6', '#1e3a5f'],
  ['#1c1917', '#e94560', '#292524'],
  ['#0f172a', '#8b5cf6', '#1e293b'],
  ['#111111', '#e94560', '#1a1a1a'],
  ['#0a0f1e', '#06b6d4', '#1a2332'],
  ['#1a1000', '#f97316', '#2a2000'],
  ['#100a1a', '#a855f7', '#1a0f2e'],
  ['#001a0f', '#10b981', '#002a18'],
  ['#1a0a0a', '#ef4444', '#2a1010']
];

const schedule = JSON.parse(fs.readFileSync(path.join(__dirname, 'schedule.json'), 'utf8'));

function generateOverlayHTML(post, cta, seo, index, imageUrl) {
  const [bg1, accent, bg2] = colors[index % colors.length];

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  width: 1200px;
  height: 900px;
  font-family: Helvetica, Arial, sans-serif;
  overflow: hidden;
  background: #000;
}

.container {
  width: 1200px;
  height: 900px;
  position: relative;
  overflow: hidden;
}

.background-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.4) contrast(1.1);
}

.overlay-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0,0,0,0.1) 0%,
    rgba(0,0,0,0.3) 40%,
    rgba(0,0,0,0.85) 100%
  );
}

.content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 60px;
  color: white;
  z-index: 10;
}

.tag {
  display: inline-block;
  background: ${accent};
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
  width: fit-content;
}

h1 {
  font-size: 72px;
  font-weight: 900;
  line-height: 1.05;
  margin-bottom: 16px;
  text-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

h1 span {
  color: ${accent};
}

.subtitle {
  font-size: 24px;
  color: rgba(255,255,255,0.85);
  margin-bottom: 12px;
  font-weight: 600;
}

.desc {
  font-size: 18px;
  color: rgba(255,255,255,0.7);
  margin-bottom: 30px;
  line-height: 1.6;
  max-width: 700px;
}

.stats {
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
}

.stat {
  text-align: center;
}

.stat .num {
  font-size: 32px;
  font-weight: 900;
  color: ${accent};
}

.stat .label {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cta {
  display: inline-block;
  background: ${accent};
  color: white;
  padding: 18px 50px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: 700;
  text-decoration: none;
  width: fit-content;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.seo-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.7);
  padding: 12px 60px;
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  z-index: 20;
  backdrop-filter: blur(10px);
}

.footer {
  position: absolute;
  bottom: 20px;
  left: 60px;
  right: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 20;
}

.footer-left {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
}

.footer-left strong {
  color: rgba(255,255,255,0.8);
}

.footer-right {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
}
</style>
</head>
<body>
<div class="container">
  <img class="background-image" src="${imageUrl}" alt="Botijão de Gás">
  <div class="overlay-gradient"></div>

  <div class="seo-bar">
    📍 ${business.address} | 📞 ${business.phone} | ⭐ ${business.rating} (${business.reviews}+ avaliações)
  </div>

  <div class="content">
    <div class="tag">${post.subtitle}</div>
    <h1>${post.title}</h1>
    <p class="desc">${post.desc}</p>
    <div class="stats">
      <div class="stat"><div class="num">${business.rating}</div><div class="label">Avaliação</div></div>
      <div class="stat"><div class="num">${business.reviews}+</div><div class="label">Clientes</div></div>
      <div class="stat"><div class="num">20min</div><div class="label">Entrega</div></div>
    </div>
    <a class="cta" href="${cta.url}">${cta.text}</a>
  </div>

  <div class="footer">
    <div class="footer-left">
      <strong>${business.name}</strong> | ${business.address}
    </div>
    <div class="footer-right">
      ${seo}
    </div>
  </div>
</div>
</body>
</html>`;
}

async function renderPosts(start = 1, end = 15) {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  RENDERIZADOR DE POSTS - IMAGENS COM TEXTO SEO         ║');
  console.log('║  Sobrepõe textos e CTAs nas imagens geradas            ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  const imagesDir = path.join(__dirname, 'images-pollinations');
  const outputDir = path.join(__dirname, 'posts-finais');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900 });

  let success = 0;
  let errors = 0;

  for (let i = start; i <= end; i++) {
    const idx = i - 1;
    const post = posts[idx];
    const cta = ctas[idx % ctas.length];
    const seo = seoKeywords[idx % seoKeywords.length];
    const imageFile = path.join(imagesDir, `post${String(i).padStart(2, '0')}-*.png`);

    const files = fs.readdirSync(imagesDir).filter(f => f.startsWith(`post${String(i).padStart(2, '0')}`));
    if (files.length === 0) {
      console.log(`❌ Post ${i}: imagem não encontrada`);
      errors++;
      continue;
    }

    const imagePath = path.join(imagesDir, files[0]);
    const imageUrl = `file:///${imagePath.replace(/\\/g, '/')}`;

    console.log(`🎨 Renderizando post ${i}/15: ${post.title}`);
    console.log(`   SEO: ${seo.substring(0, 50)}...`);

    const html = generateOverlayHTML(post, cta, seo, idx, imageUrl);

    try {
      await page.setContent(html, { waitUntil: 'load', timeout: 10000 });
      await new Promise(r => setTimeout(r, 500));

      const outputFile = path.join(outputDir, `post${String(i).padStart(2, '0')}-final.png`);
      await page.screenshot({ path: outputFile, type: 'png' });

      const stats = fs.statSync(outputFile);
      console.log(`   ✅ Salvo (${Math.round(stats.size / 1024)}KB)`);
      success++;
    } catch (err) {
      console.log(`   ❌ Erro: ${err.message}`);
      errors++;
    }
  }

  await browser.close();

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`✅ Renderizados: ${success} | ❌ Erros: ${errors}`);
  console.log(`📁 Imagens finais em: ${outputDir}`);
  console.log('\nPróximos passos:');
  console.log('  1. Verifique as imagens na pasta posts-finais/');
  console.log('  2. Para postar no GMB: node postar-gmb.js');
}

const args = process.argv.slice(2);
const start = parseInt(args[0]) || 1;
const end = parseInt(args[1]) || 15;

renderPosts(start, end).catch(console.error);
