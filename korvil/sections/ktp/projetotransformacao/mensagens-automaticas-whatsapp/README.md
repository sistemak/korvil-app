# KTP 10/10 - MASTER FINAL AUTÔNOMO - Organização Perfeita

> 🎯 10/10 - Organização Autônoma Inteligente - Tudo no lugar correto - Grátis Ilimitado

## 📍 LOCAL CORRETO OBRIGATÓRIO
Tudo dentro de: `korvil/sections/ktp/projetotransformacao/mensagens-automaticas-whatsapp/`

### Estrutura 10/10
```
korvil/sections/ktp/projetotransformacao/mensagens-automaticas-whatsapp/
├── index.html (PÁGINA INICIAL DEFINITIVA - 260 contatos + agendamento)
├── README.md
├── package.json (local)
├── src/
│   ├── baileys.js
│   ├── scheduler.js (envio real a cada minuto)
│   ├── scheduler-cobranca.js (7 dias antes vencimento AUTOMÁTICO)
│   ├── generate-qr.js
│   ├── alunos-mensalidades.json
│   └── components/
│       └── WhatsAppScheduler.jsx
├── data/
│   ├── scheduled.json
│   ├── fila-cobranca.json
│   └── logs.json
└── auth/ (.gitkeep)
RAIZ CORRETA:
├── .github/workflows/ktp-whatsapp-autonomo.yml
└── package.json (raiz com Baileys)
```

## 🚀 Como usar (Grátis Ilimitado)
1. Gere QR: `node src/generate-qr.js` dentro da pasta mensagens-automaticas-whatsapp
2. Abra `index.html` como página inicial - 260 contatos já lá
3. Clique 📅 Programar → preenche GH_TOKEN (só no navegador) → agenda
4. Workflow `.github/workflows/ktp-whatsapp-autonomo.yml` roda:
   - `cron: '* * * * *'` - envia pendentes
   - `cron: '0 8 * * *'` - gera cobranças 7 dias antes
   - push em data/** também dispara
5. Usa apenas GH_TOKEN + NODE - sem servidor pago - grátis ilimitado

## 🤖 Autônomo Inteligente
- Não duplica arquivos (verifica sha antes)
- Adiciona separações se arquivo já existe
- Auth em `auth/` separado
- Logs e fila commitados automaticamente com [skip ci]
- Cobrança: verifica todo dia 8h se faltam 7 dias pro vencimento e agenda

## 🔐 Secrets necessários
- `GH_TOKEN` em Settings > Secrets > Actions

## ✅ 10/10 Checklist
- [x] Tudo dentro de mensagens-automaticas-whatsapp/ onde puder
- [x] Workflow em .github/workflows/ (lugar correto obrigatório)
- [x] package.json raiz com Baileys
- [x] Sem duplicação - só adiciona separações
- [x] Grátis ilimitado - só GitHub Actions + Node
- [x] Instantâneo rápido
