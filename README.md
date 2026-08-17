# Geovane Gás - Automação GMB

Sistema de automação de postagens no Google Business Profile para a **Geovane Gás** — distribuidora de gás no Distrito Industrial, Ananindeua-PA.

## Funcionalidades

- **15 templates de post** com textos otimizados e imagens PNG profissionais
- **Geração de imagens com IA** via Pollinations.ai (gratuito)
- **Postagem automática** no GMB via Playwright (browser automation)
- **Agendamento** com data e hora específicas
- **CTAs integrados** (Saiba mais, Comprar, Falar no WhatsApp, etc.)
- **Retry automático** em caso de falha
- **Logging de auditoria** em arquivo JSON
- **Validação de imagens** antes de postar

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- Conta no Google Business Profile (login via navegador)

## Instalação

```bash
# Clonar repositório
git clone https://github.com/SEU-USER/geovane-gas-gmb.git
cd geovane-gas-gmb

# Instalar dependências
npm install

# Instalar navegador Chromium
npx playwright install chromium
```

## Uso

### 1. Gerar posts HTML e PNG

```bash
npm run generate
```

### 2. Gerar imagens com IA (Pollinations.ai)

```bash
# Gerar todas as 15 imagens
npm run images

# Gerar intervalo específico (ex: posts 3 a 7)
node generate-images-pollinations.js 3 7
```

### 3. Renderizar imagens PNG

```bash
npm run render
```

### 4. Postar no GMB

```bash
# Postar todos (1-15)
npm run post

# Postar intervalo específico
node postar-gmb.js 3 7

# Modo headless (sem janela)
npm run post:headless
```

## Estrutura do Projeto

```
├── generate-posts.js              # Gera HTML dos 15 posts
├── generate-images-pollinations.js # Gera imagens com IA (Pollinations)
├── postar-automatico.js           # Renderiza HTML → PNG
├── postar-gmb.js                  # Posta no GMB automaticamente
├── schedule.json                  # Cronograma de postagens
├── copys-posts.txt                # Textos dos posts
├── posting-log.json               # Log de postagens (gerado automaticamente)
├── images-pollinations/           # Imagens geradas por IA
├── .env.example                   # Exemplo de configuração
└── post*.html / post*.png         # Posts gerados
```

## Configuração

Copie `.env.example` para `.env` e ajuste os valores:

```bash
cp .env.example .env
```

Variáveis disponíveis:

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `HEADLESS` | Modo headless | `false` |
| `POST_START` | Post inicial | `1` |
| `POST_END` | Post final | `15` |
| `GMB_BUSINESS_ID` | ID do negócio | `10114823537177422096` |
| `POLLINATIONS_API_KEY` | API key Pollinations.ai | (vazio) |
| `POLLINATIONS_MODEL` | Modelo de imagem | `flux` |
| `POLLINATIONS_WIDTH` | Largura da imagem | `1024` |
| `POLLINATIONS_HEIGHT` | Altura da imagem | `1024` |

## Fluxo de Trabalho

1. **Gerar posts** — `npm run generate` cria 15 HTMLs + `schedule.json`
2. **Gerar imagens IA** — `npm run images` cria imagens via Pollinations.ai
3. **Renderizar** — `npm run render` converte HTMLs em PNGs (opcional se usar imagens IA)
4. **Login** — Na primeira execução, faça login no Google na janela aberta
5. **Postar** — O sistema navega no GMB, preenche texto, imagem, CTA e agenda

## Personalização

### Alterar textos dos posts
Edite o array `COPIES` em `postar-gmb.js`

### Alterar CTAs
Edite o objeto `CTAS` em `postar-gmb.js`

### Alterar cronograma
Execute `npm run generate` novamente ou edite `schedule.json`

### Alterar horários
Edite o array `hours` em `generate-posts.js` (linha 139)

## Logs

As postagens são registradas em `posting-log.json`:

```json
[
  {
    "post": 1,
    "status": "success",
    "cta": "SAIBA MAIS",
    "time": "08:00",
    "timestamp": "2026-07-20T08:00:00.000Z"
  }
]
```

## Solução de Problemas

| Problema | Solução |
|----------|---------|
| Login expirado | Delete `gmb-profile/` e faça login novamente |
| PNG não encontrado | Execute `npm run render` antes de postar |
| Seletor não encontrado | O GMB pode ter atualizado o layout — verifique os seletores em `postar-gmb.js` |
| Post não agenda | Verifique se a data/hora são futuras |
| Erro Pollinations API | Verifique se a `POLLINATIONS_API_KEY` está correta no `.env` |
| Imagem Pollinations vazia | Tente outro modelo: `POLLINATIONS_MODEL=zimage` |

## Licença

ISC
