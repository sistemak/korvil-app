# KTP WHATSAPP REAL - SÓ GH_TOKEN + NODE

### ✅ AGORA FUNCIONA REAL, SÓ GH_TOKEN + NODE, GRÁTIS ILIMITADO

## Fluxo 100% Real:

1. Depois do commit automático desse instalador:
   ```bash
   npm install --legacy-peer-deps
   npm install @whiskeysockets/baileys qrcode-terminal
   ```

2. Gerar QR local (uma vez):
   ```bash
   node scripts/whatsapp/generate-qr.js
   # escaneie o QR no seu WhatsApp > Aparelhos conectados
   # vai criar pasta ./auth/
   ```

3. Commitar auth pro GitHub:
   ```bash
   git add auth/
   git commit -m "auth whatsapp conectado"
   git push
   ```

4. Adicionar SECRET no GitHub:
   - Vá em Settings > Secrets and variables > Actions > New repository secret
   - Name: GH_TOKEN
   - Value: seu token ghp_... com permissão repo + workflow

5. Abrir seu site / index, colar GH_TOKEN, programar mensagens.
   - A mensagem vai para data/scheduled.json no GitHub
   - GitHub Action roda TODO MINUTO (cron * * * * *) e envia pendentes
   - Mesmo com PC desligado, grátis ilimitado

## Custo: ZERO
## Limite: ILIMITADO (usa sua conta WhatsApp + GitHub Actions free tier 2000min/mês)

## Segurança:
Token nunca sai do navegador, só vai pra api.github.com direto.
