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
    prompt: 'Professional promotional image for a gas delivery service, blue flame of a gas stove burner, clean modern kitchen background, warm lighting, Brazilian style, high quality commercial photography, vibrant colors, no text'
  },
  {
    id: 2,
    filename: 'post02-gas-butano.png',
    prompt: 'Professional image of a blue gas cylinder (botijão de gás butano 13kg) in a clean kitchen setting, warm lighting, commercial product photography style, Brazilian home environment, no text'
  },
  {
    id: 3,
    filename: 'post03-entrega-rapida.png',
    prompt: 'Fast delivery concept, person carrying a blue gas cylinder to a residential house, sunset lighting, professional delivery service, Brazilian urban neighborhood, warm tones, no text'
  },
  {
    id: 4,
    filename: 'post04-deposito-gas.png',
    prompt: 'Gas distribution warehouse interior, rows of blue gas cylinders organized neatly, professional storage facility, industrial lighting, clean and organized, Brazilian business, no text'
  },
  {
    id: 5,
    filename: 'post05-domingo-gas.png',
    prompt: 'Happy family cooking in a bright kitchen with gas stove flame visible, warm home atmosphere, weekend family gathering, Brazilian style kitchen, warm lighting, no text'
  },
  {
    id: 6,
    filename: 'post06-preco-justo.png',
    prompt: 'Value and affordability concept, happy customer receiving gas cylinder delivery, thumbs up gesture, bright sunny day, Brazilian residential area, friendly service, no text'
  },
  {
    id: 7,
    filename: 'post07-whatsapp.png',
    prompt: 'Modern smartphone showing a chat conversation, cozy kitchen background with gas stove, easy ordering concept, warm lighting, Brazilian style, no text'
  },
  {
    id: 8,
    filename: 'post08-gas-cozinha.png',
    prompt: 'Beautiful modern kitchen with blue gas flame on stove, clean countertop, warm ambient lighting, Brazilian home interior design, inviting atmosphere, no text'
  },
  {
    id: 9,
    filename: 'post09-avaliacao.png',
    prompt: 'Five gold stars rating concept, customer satisfaction, professional service quality, warm background with subtle glow, premium feel, no text'
  },
  {
    id: 10,
    filename: 'post10-seguranca.png',
    prompt: 'Safety concept for gas delivery, professional worker with safety equipment handling gas cylinder, careful and secure, industrial safety, Brazilian style, no text'
  },
  {
    id: 11,
    filename: 'post11-comercio.png',
    prompt: 'Commercial restaurant kitchen with gas stove, professional chef environment, business gas supply, Brazilian restaurant setting, warm lighting, no text'
  },
  {
    id: 12,
    filename: 'post12-promocao.png',
    prompt: 'Special offer promotional concept, gift box with blue ribbon, celebration atmosphere, bright colors, commercial advertising style, exciting deal, no text'
  },
  {
    id: 13,
    filename: 'post13-facilidade.png',
    prompt: 'Convenience and ease concept, person relaxing at home while delivery arrives, doorstep service, comfortable Brazilian home, stress-free, no text'
  },
  {
    id: 14,
    filename: 'post14-profissional.png',
    prompt: 'Professional gas delivery person in uniform, confident pose, branded service vehicle, clean and trustworthy appearance, Brazilian worker, no text'
  },
  {
    id: 15,
    filename: 'post15-final-semana.png',
    prompt: 'Weekend relaxation concept, cozy kitchen with warm gas flame, peaceful home atmosphere, Saturday morning vibes, Brazilian home comfort, no text'
  }
];

// ─── Funções utilitárias ─────────────────────────────────────

/**
 * Faz download de uma imagem via URL
 */
function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, { timeout: 60000 }, (response) => {
      // Seguir redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadImage(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} ao baixar imagem`));
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
  });
}

/**
 * Gera URL da imagem via Pollinations.ai
 */
function buildImageUrl(prompt, options = {}) {
  const model = options.model || MODEL;
  const width = options.width || WIDTH;
  const height = options.height || HEIGHT;
  const seed = options.seed || Math.floor(Math.random() * 10000);
  
  const encodedPrompt = encodeURIComponent(prompt);
  let url = `https://gen.pollinations.ai/image/${encodedPrompt}?model=${model}&width=${width}&height=${height}&seed=${seed}`;
  
  if (API_KEY) {
    url += `&key=${API_KEY}`;
  }
  
  return url;
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
      
      await downloadImage(url, destPath);
      
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
