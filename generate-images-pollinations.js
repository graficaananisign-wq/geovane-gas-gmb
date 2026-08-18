/**
 * generate-images-pollinations.js
 * Gera imagens para os posts usando Pollinations.ai (gratuito)
 * 
 * Uso:
 *   node generate-images-pollinations.js              # gera todas as 15 imagens
 *   node generate-images-pollinations.js 1 3          # gera posts 1 a 3
 *   node generate-images-pollinations.js --model flux # usa modelo específico
 * 
 * Requer: POLLINATIONS_API_KEY no .env (gratuito em enter.pollinations.ai)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
require('dotenv').config();

// ─── Configuração ────────────────────────────────────────────
const DIR = __dirname;
const API_KEY = process.env.POLLINATIONS_API_KEY || '';
const MODEL = process.env.POLLINATIONS_MODEL || 'flux';
const WIDTH = parseInt(process.env.POLLINATIONS_WIDTH || '1024');
const HEIGHT = parseInt(process.env.POLLINATIONS_HEIGHT || '1024');
const OUTPUT_DIR = path.join(DIR, 'images-pollinations');

// ─── Prompts para cada post ──────────────────────────────────
const POST_PROMPTS = [
  {
    id: 1,
    filename: 'post01-gas-entrega.png',
    prompt: 'Professional promotional photograph of a blue botijão de gás butano 13kg gas cylinder, dramatic studio lighting with warm golden hour backlight, clean modern kitchen with marble countertop background, shallow depth of field, commercial product photography, vibrant saturated colors, lens flare accent, high-end advertising style, 8k quality, no text no watermark'
  },
  {
    id: 2,
    filename: 'post02-gas-butano.png',
    prompt: 'Premium product shot of a blue botijão de gás butano 13kg, soft box lighting with rim light, minimalist kitchen setting with white cabinets, professional color grading with teal and orange tones, commercial photography, bokeh background, sharp focus on cylinder, luxury brand feel, 8k resolution, no text no watermark'
  },
  {
    id: 3,
    filename: 'post03-entrega-rapida.png',
    prompt: 'Dynamic action shot of delivery person carrying blue botijão de gás to residential house, golden hour sunset lighting with long shadows, motion blur effect on background, Brazilian urban neighborhood, warm orange and blue color contrast, professional street photography style, cinematic composition, 8k quality, no text no watermark'
  },
  {
    id: 4,
    filename: 'post04-deposito-gas.png',
    prompt: 'Industrial warehouse interior with rows of blue botijão de gás cylinders, dramatic overhead lighting creating depth, leading lines composition, clean organized storage facility, cool blue and warm orange lighting contrast, professional architectural photography, symmetrical framing, 8k resolution, no text no watermark'
  },
  {
    id: 5,
    filename: 'post05-domingo-gas.png',
    prompt: 'Happy Brazilian family gathered around kitchen table with blue botijão de gás visible, warm ambient lighting, steam rising from cooking, candid lifestyle photography, shallow depth of field, warm golden tones, authentic home atmosphere, editorial style, 8k quality, no text no watermark'
  },
  {
    id: 6,
    filename: 'post06-preco-justo.png',
    prompt: 'Smiling customer giving thumbs up next to blue botijão de gás delivery, bright sunny day with natural lighting, Brazilian residential street background, authentic candid moment, warm color grading, professional lifestyle photography, genuine emotion, 8k resolution, no text no watermark'
  },
  {
    id: 7,
    filename: 'post07-whatsapp.png',
    prompt: 'Close-up of modern smartphone showing chat interface, blue botijão de gás softly blurred in background kitchen, shallow depth of field, warm ambient lighting, lifestyle product photography, clean composition, bokeh effect, tech-meets-home concept, 8k quality, no text no watermark'
  },
  {
    id: 8,
    filename: 'post08-gas-cozinha.png',
    prompt: 'Luxurious modern kitchen interior with blue gas flame on premium stove, blue botijão de gás integrated into design, warm under-cabinet lighting, marble surfaces, interior design photography, symmetrical composition, warm and cool color harmony, magazine quality, 8k resolution, no text no watermark'
  },
  {
    id: 9,
    filename: 'post09-avaliacao.png',
    prompt: 'Five glowing gold stars floating above blue botijão de gás, magical sparkle effects, premium dark background with subtle gradient, luxury product presentation, dramatic lighting, premium feel, award-winning concept, professional commercial photography, 8k quality, no text no watermark'
  },
  {
    id: 10,
    filename: 'post10-seguranca.png',
    prompt: 'Professional worker in safety vest carefully handling blue botijão de gás, industrial safety equipment visible, confident and secure posture, cool blue lighting with warm accent, corporate safety photography, trustworthy atmosphere, 8k resolution, no text no watermark'
  },
  {
    id: 11,
    filename: 'post11-comercio.png',
    prompt: 'Professional commercial kitchen with multiple blue botijão de gás cylinders, stainless steel surfaces, restaurant environment, warm overhead lighting, industrial food photography, clean and organized workspace, business atmosphere, 8k quality, no text no watermark'
  },
  {
    id: 12,
    filename: 'post12-promocao.png',
    prompt: 'Blue botijão de gás with festive gift wrapping and golden ribbon, celebration confetti particles, vibrant promotional colors, exciting deal concept, dynamic composition, commercial advertising photography, eye-catching, 8k resolution, no text no watermark'
  },
  {
    id: 13,
    filename: 'post13-facilidade.png',
    prompt: 'Person relaxing on couch while delivery arrives at doorstep with blue botijão de gás, split composition showing comfort and service, warm cozy interior, lifestyle photography, convenience concept, soft natural lighting, 8k quality, no text no watermark'
  },
  {
    id: 14,
    filename: 'post14-profissional.png',
    prompt: 'Professional delivery person in branded uniform standing next to blue botijão de gás, confident pose, service vehicle in background, corporate portrait photography, clean trustworthy appearance, professional lighting, 8k resolution, no text no watermark'
  },
  {
    id: 15,
    filename: 'post15-final-semana.png',
    prompt: 'Cozy weekend morning kitchen scene with blue botijão de gás, warm golden sunlight streaming through window, peaceful home atmosphere, coffee cup nearby, lifestyle editorial photography, warm color grading, inviting mood, 8k quality, no text no watermark'
  }
];

// ─── Funções utilitárias ─────────────────────────────────────

/**
 * Faz download de uma imagem via URL
 */
function downloadImage(url, destPath, apiKey) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const headers = {};
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    
    function doRequest(reqUrl) {
      const parsedUrl = new URL(reqUrl);
      const reqProtocol = parsedUrl.protocol === 'https:' ? https : http;
      
      const request = reqProtocol.get(reqUrl, { headers, timeout: 120000 }, (response) => {
        // Seguir redirects (301, 302, 307, 308)
        if ([301, 302, 307, 308].includes(response.statusCode) && response.headers.location) {
          let redirectUrl = response.headers.location;
          // Suportar URLs relativas
          if (redirectUrl.startsWith('/')) {
            redirectUrl = `${parsedUrl.protocol}//${parsedUrl.host}${redirectUrl}`;
          }
          doRequest(redirectUrl);
          return;
        }
        
        if (response.statusCode !== 200) {
          let body = '';
          response.on('data', chunk => body += chunk);
          response.on('end', () => {
            reject(new Error(`HTTP ${response.statusCode}: ${body.substring(0, 200)}`));
          });
          return;
        }
        
        const fileStream = fs.createWriteStream(destPath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(destPath);
        });
        
        fileStream.on('error', (err) => {
          fs.unlink(destPath, () => {});
          reject(err);
        });
      });
      
      request.on('error', reject);
      request.on('timeout', () => {
        request.destroy();
        reject(new Error('Timeout ao baixar imagem'));
      });
    }
    
    doRequest(url);
  });
}

/**
 * Gera URL da imagem via Pollinations.ai
 * Usa endpoint legado (sem key) quando API key não tem créditos
 */
function buildImageUrl(prompt, options = {}) {
  const model = options.model || MODEL;
  const width = options.width || WIDTH;
  const height = options.height || HEIGHT;
  const seed = options.seed || Math.floor(Math.random() * 10000);
  
  const encodedPrompt = encodeURIComponent(prompt);
  
  // Endpoint legado funciona sem API key
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?model=${model}&width=${width}&height=${height}&seed=${seed}&nologo=true`;
}

/**
 * Aguarda um tempo especificado
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Função principal ────────────────────────────────────────
async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║  GERADOR DE IMAGENS - POLLINATIONS.AI                  ║');
  console.log('║  Gratuito com API key (enter.pollinations.ai)          ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');
  
  // Verificar API key
  if (!API_KEY) {
    console.log('⚠  POLLINATIONS_API_KEY não encontrada no .env');
    console.log('   Criando key gratuita em: https://enter.pollinations.ai/keys');
    console.log('');
    console.log('   Opções:');
    console.log('   1. Crie uma key e adicione ao .env');
    console.log('   2. O script tentará sem key (pode ter rate limit)');
    console.log('');
  }
  
  // Parse argumentos
  const args = process.argv.slice(2);
  let startIdx = 1;
  let endIdx = POST_PROMPTS.length;
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--model' && args[i + 1]) {
      // já tratado via env
    } else if (!isNaN(parseInt(args[i]))) {
      if (startIdx === 1) startIdx = parseInt(args[i]);
      else endIdx = parseInt(args[i]);
    }
  }
  
  const postsToGenerate = POST_PROMPTS.filter(p => p.id >= startIdx && p.id <= endIdx);
  
  console.log(` modelo: ${MODEL}`);
  console.log(` resolução: ${WIDTH}x${HEIGHT}`);
  console.log(` posts: ${startIdx} a ${endIdx} (${postsToGenerate.length} imagens)`);
  console.log(` destino: ${OUTPUT_DIR}`);
  console.log('');
  
  // Criar diretório de destino
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Gerar imagens
  let successCount = 0;
  let errorCount = 0;
  
  for (const post of postsToGenerate) {
    const destPath = path.join(OUTPUT_DIR, post.filename);
    
    // Pular se já existe
    if (fs.existsSync(destPath)) {
      const stats = fs.statSync(destPath);
      if (stats.size > 10000) { // > 10KB = provavelmente válida
        console.log(`⏭  Post ${post.id}: já existe (${(stats.size / 1024).toFixed(0)}KB)`);
        successCount++;
        continue;
      }
    }
    
    const url = buildImageUrl(post.prompt);
    
    try {
      console.log(`🎨 Post ${post.id}/15: ${post.filename}`);
      console.log(`   Prompt: ${post.prompt.substring(0, 60)}...`);
      
      await downloadImage(url, destPath, API_KEY);
      
      const stats = fs.statSync(destPath);
      console.log(`   ✅ Salvo (${(stats.size / 1024).toFixed(0)}KB)`);
      successCount++;
      
      // Intervalo entre requests para evitar rate limit
      await sleep(1500);
      
    } catch (err) {
      console.log(`   ❌ Erro: ${err.message}`);
      errorCount++;
    }
    
    console.log('');
  }
  
  // Resumo
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✅ Geradas: ${successCount} | ❌ Erros: ${errorCount}`);
  console.log(`📁 Imagens salvas em: ${OUTPUT_DIR}`);
  console.log('');
  
  if (successCount > 0) {
    console.log('Próximos passos:');
    console.log('  1. Verifique as imagens na pasta images-pollinations/');
    console.log('  2. Para postar no GMB: node postar-gmb.js');
  }
  
  console.log('');
}

main().catch(err => {
  console.error('Erro fatal:', err.message);
  process.exit(1);
});
