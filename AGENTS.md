# AGENTS.md - Regras do Projeto GMB Geovane Gás

## Regras Obrigatórias

### 1. SEMPRE Ativar Botão CTA em Todas as Postagens
- **TODO** post DEVE ter um botão CTA (Call-to-Action) ativado
- Tipos de CTA disponíveis: SAIBA MAIS, COMPRAR AGORA, PEÇA JÁ, FALAR NO WHATSAPP, VER OFERTAS
- NUNCA publicar post sem botão CTA configurado
- O CTA deve redirecionar para o site ou WhatsApp conforme definido em `schedule.json`

### 2. SEMPRE Agendar as Postagens
- **TODAS** as postagens DEVEM ser agendadas (não publicadas imediatamente)
- Usar a data e hora definidas em `schedule.json`
- Formato de data: DD/MM/AAAA
- Formato de hora: HH:MM (formato 24h)
- Ativar o toggle "Programar esta postagem" em TODOS os posts

### 3. Fluxo de Postagem Obrigatório
1. Preencher descrição com texto SEO otimizado
2. Enviar imagem com textos sobrepostos (posts-finais/)
3. **ATIVAR toggle "Programar esta postagem"**
4. Configurar data e hora do agendamento
5. **ADICIONAR botão CTA com link correto**
6. Clicar em "Postagem" para agendar

### 4. Ordem dos Posts
- Postar em sequência: Post 1 a 15
- Respeitar a ordem do `schedule.json`
- Uma postagem por vez (não paralelo)

### 5. Validação
- Verificar se a imagem existe antes de postar
- Verificar se o CTA foi ativado
- Verificar se o agendamento foi configurado
- Logar resultado em `posting-log.json`

## Estrutura de Arquivos
- `posts-finais/` - Imagens finais com textos SEO
- `schedule.json` - Cronograma de 15 posts (17/08 a 31/08/2026)
- `posting-log.json` - Log de todas as postagens
- `postar-direto.js` - Script de postagem automática
- `gmb-profile/` - Perfil Chrome persistente (login salvo)
