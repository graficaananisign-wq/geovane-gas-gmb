const fs = require('fs');
const path = require('path');

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

const ctas = [
  { text: 'SAIBA MAIS', url: business.site },
  { text: 'COMPRAR AGORA', url: business.site },
  { text: 'PEÇA JÁ', url: business.whatsapp },
  { text: 'FALAR NO WHATSAPP', url: business.whatsapp },
  { text: 'VER OFERTAS', url: business.site }
];

const posts = [
  { icon: '', title: 'BOTIJÃO DE GÁS', subtitle: 'Entrega Rápida no Distrito Industrial', desc: 'Peça seu botijão de gás de cozinha e receba em casa em até 20 minutos.' },
  { icon: '', title: 'GÁS BUTANO 13KG', subtitle: 'Preço Justo e Qualidade Garantida', desc: 'Botijão de gás butano original Paragás com o melhor preço de Ananindeua.' },
  { icon: '', title: 'ACABOU O GÁS?', subtitle: 'A Gente Leva Até Você', desc: 'Não fique sem gás! Entrega express no Distrito Industrial e redondezas.' },
  { icon: '', title: 'DEPÓSITO DE GÁS', subtitle: 'Confiável e Bem Localizado', desc: 'Distribuidora de gás autorizada no Distrito Industrial. Atendimento de qualidade.' },
  { icon: '', title: 'ENTREGA DE GÁS', subtitle: '20 Minutos ou Menos', desc: 'Agilidade que você precisa. Seu gás de cozinha chega rápido em Ananindeua.' },
  { icon: '', title: 'GÁS DE COZINHA', subtitle: 'Para Sua Casa ou Comércio', desc: 'Botijão de gás butano 13kg para uso doméstico e comercial. Entrega sem taxa extra.' },
  { icon: '', title: 'PROMOÇÃO DE GÁS', subtitle: 'Oferta Imperdível', desc: 'Aproveite nossos preços especiais no botijão de gás. Válido para todo Ananindeua.' },
  { icon: '', title: 'GÁS PARAGÁS', subtitle: 'Marca de Confiança', desc: 'Distribuidor autorizado Paragás em Ananindeua. Botijão de gás original e lacrado.' },
  { icon: '', title: 'DISK GÁS', subtitle: 'Ligou, Chegou!', desc: 'Serviço de disk gás no Distrito Industrial. Ligue ou mande WhatsApp.' },
  { icon: '', title: 'GÁS SEM SAIR DE CASA', subtitle: 'Entrega na Sua Porta', desc: 'Peça online e receba seu botijão de gás de cozinha sem sair de casa.' },
  { icon: '', title: 'BOTIJÃO DE GÁS', subtitle: 'Segurança para Sua Família', desc: 'Botijão de gás butano com lacre de segurança. Qualidade que sua família merece.' },
  { icon: '', title: 'GÁS 24 HORAS', subtitle: 'Atendimento Todos os Dias', desc: 'Funcionamento de domingo a domingo. Gás de cozinha quando você precisar.' },
  { icon: '', title: 'GÁS BUTANO', subtitle: 'O Mais Vendido', desc: 'Botijão de gás butano 13kg. O preferido das famílias de Ananindeua.' },
  { icon: '', title: 'ENTREGA EXPRESS', subtitle: 'Rápido e Seguro', desc: 'Sistema de entrega rápida. Peça seu gás e receba em minutos.' },
  { icon: '', title: 'GEOVANE GÁS', subtitle: 'Sua Distribuidora de Confiança', desc: 'Há anos atendendo o Distrito Industrial com qualidade e respeito ao cliente.' }
];

function generateHTML(post, cta, seo, index) {
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

  const [bg1, accent, bg2] = colors[index % colors.length];
  const btnClass = index % 2 === 0 ? 'btn-primary' : 'btn-secondary';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Post ${index + 1} - ${post.title}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:Helvetica,Arial,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f0f0f0}
.post{width:1200px;height:900px;background:linear-gradient(135deg,${bg1} 0%,${bg2} 100%);position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:60px}
.shapes{position:absolute;inset:0}
.shapes div{position:absolute;border-radius:50%;opacity:0.06}
.s1{width:500px;height:500px;background:${accent};top:-100px;right:-100px}
.s2{width:350px;height:350px;background:${accent};bottom:-80px;left:-80px}
.s3{width:200px;height:200px;background:${accent};bottom:150px;right:150px}
.content{position:relative;z-index:1;text-align:center;color:white;width:100%}
.tag{display:inline-block;background:${accent};padding:6px 20px;border-radius:3px;font-size:14px;font-weight:bold;margin-bottom:20px;text-transform:uppercase;letter-spacing:2px}
h1{font-size:64px;font-weight:900;margin-bottom:12px;line-height:1.1;text-shadow:0 2px 10px rgba(0,0,0,0.3)}
h1 span{color:${accent}}
.subtitle{font-size:22px;color:rgba(255,255,255,0.6);margin-bottom:10px;font-weight:normal}
.desc{font-size:18px;color:rgba(255,255,255,0.5);margin-bottom:30px;line-height:1.5;max-width:800px;margin-left:auto;margin-right:auto}
.cta{display:inline-block;background:${accent};color:white;padding:18px 45px;border-radius:50px;font-size:20px;font-weight:bold;text-decoration:none;transition:all 0.3s}
.cta:hover{transform:scale(1.05)}.cta.alt{background:#25d366}
.stats{display:flex;gap:30px;justify-content:center;margin-bottom:25px}
.stat{text-align:center}.stat .num{font-size:28px;font-weight:bold;color:${accent}}.stat .label{font-size:13px;color:rgba(255,255,255,0.5)}
.footer{position:absolute;bottom:20px;left:0;right:0;text-align:center;z-index:1}
.footer p{color:rgba(255,255,255,0.35);font-size:12px;line-height:1.6;padding:0 40px}
.footer strong{color:rgba(255,255,255,0.55)}
</style>
</head>
<body>
<div class="post">
<div class="shapes"><div class="s1"></div><div class="s2"></div><div class="s3"></div></div>
<div class="content">
<div class="tag">${post.subtitle}</div>
<h1>${post.title}</h1>
<p class="desc">${post.desc}</p>
<div class="stats">
<div class="stat"><div class="num">${business.rating}</div><div class="label">Avaliação</div></div>
<div class="stat"><div class="num">${business.reviews}+</div><div class="label">Clientes</div></div>
<div class="stat"><div class="num">20min</div><div class="label">Entrega</div></div>
</div>
<a class="cta" href="${cta.url}" target="_blank">${cta.text}</a>
</div>
<div class="footer">
<p>
<strong>${business.name}</strong> - ${business.address} | 📞 ${business.phone}<br>
<strong>SEO:</strong> ${seo}
</p>
</div>
</div>
</body>
</html>`;
}

// Generate all 15 posts
const outputDir = __dirname;
for (let i = 0; i < 15; i++) {
  const cta = ctas[i % ctas.length];
  const seo = seoKeywords[i % seoKeywords.length];
  const html = generateHTML(posts[i], cta, seo, i);
  const filename = `post${String(i + 1).padStart(2, '0')}-${posts[i].title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}.html`;
  fs.writeFileSync(path.join(outputDir, filename), html, 'utf8');
  console.log(`✓ Criado: ${filename}`);
}

// Generate schedule
const schedule = [];
const startDate = new Date('2026-07-20');
const hours = ['08:00', '09:30', '11:00', '14:00', '15:30', '17:00', '18:30', '20:00', '07:30', '10:00', '12:00', '16:00', '19:00', '21:00', '08:30'];

for (let i = 0; i < 15; i++) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + i);
  schedule.push({
    day: date.toLocaleDateString('pt-BR'),
    time: hours[i],
    post: `post${String(i + 1).padStart(2, '0')}`,
    cta: ctas[i % ctas.length].text,
    cta_url: ctas[i % ctas.length].url
  });
}

fs.writeFileSync(path.join(outputDir, 'schedule.json'), JSON.stringify(schedule, null, 2), 'utf8');
console.log('✓ Cronograma criado: schedule.json');
console.log(`\nTotal: 15 posts gerados - 1 por dia a partir de ${startDate.toLocaleDateString('pt-BR')}`);
console.log('Horários:', hours.join(', '));
