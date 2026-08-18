# KORVIL BANC

Banco digital interno do KORVIL (estilo Asaas). Um unico sistema que centraliza
**todos os recebimentos e pagamentos** do KORVIL: cria cobrancas dinamicas,
recebe confirmacao de pagamento via webhook e faz o **repasse automatico** do
valor liquido via Pix para a conta do KORVIL.

## Stack

- **Node.js + Express** - API REST e servidor de estaticos
- **Prisma + SQLite** - banco de dados (`Cliente`, `Cobranca`, `Repasse`, `Log`)
- **BullMQ + ioredis** - fila do motor de repasse
- **Asaas** - gateway de cobranca dinamica e transferencias Pix

## Estrutura

```
korvil-banc/
├── prisma/schema.prisma        # tabelas Cliente, Cobranca, Repasse, Log
├── src/
│   ├── server.js               # entrada Express (API + estaticos)
│   ├── config/env.js           # variaveis de ambiente (.env)
│   ├── lib/                     # prisma client + logger (arquivo + banco + console)
│   ├── modules/                # k-th, whatsapp, kai, geral, afiliados
│   ├── routes/                 # clientes, cobrancas, extrato, repasses, webhook, whatsapp, auth, modulos
│   ├── services/               # asaas, repasse, whatsapp
│   └── queue/                  # conexao redis, fila e worker de repasse
├── dashboard/index.html        # painel interno (login, saldo, cobrancas, filtro)
├── public/checkout.html        # checkout ?modulo=k-th&valor=150
└── logs/                        # logs diarios
```

## Como rodar

```bash
cd korvil-banc
cp .env.example .env          # preencha ASAAS_API_KEY etc.
npm install
npm run prisma:generate
npm run prisma:push           # cria o banco SQLite
npm run dev                   # inicia a API (porta 3333)
npm run worker                # em outro terminal: motor de repasse (precisa de Redis)
```

- Dashboard: `http://localhost:3333/dashboard/` (login padrao: `admin` / `korvil2025`)
- Checkout: `http://localhost:3333/checkout.html?modulo=k-th&valor=150`
- Webhook Asaas: configure para `POST https://SEU_DOMINIO/webhook/asaas`

## Regras de negocio

- Cobrancas **sempre dinamicas**: `billingType=UNDEFINED` (cliente escolhe Pix/cartao/boleto).
- **Repasse D+0** para Pix e **D+30** para Cartao (fila com `delay`).
- Repasse do valor liquido enviado por Pix para a chave `REPASSE_PIX_KEY` (`korvil.p@gmail.com`).
- Tudo e registrado em `/logs` e na tabela `Log`.

## API REST

| Metodo | Rota                | Descricao                          |
|--------|---------------------|------------------------------------|
| POST   | `/api/clientes`     | Cria cliente (local + Asaas)       |
| GET    | `/api/clientes`     | Lista clientes                     |
| POST   | `/api/cobrancas`    | Cria cobranca dinamica             |
| GET    | `/api/cobrancas`    | Lista cobrancas (`?modulo=`)       |
| GET    | `/api/extrato`      | Extrato + saldo (`?modulo=`)       |
| GET    | `/api/repasses`     | Lista repasses (`?status=&modulo=`)|
| GET    | `/api/modulos`      | Lista modulos                      |
| POST   | `/webhook/asaas`    | Webhook de pagamento do Asaas      |
| POST   | `/whatsapp-korvil/` | Webhook interno de WhatsApp        |
| POST   | `/api/auth/login`   | Login do dashboard                 |
```
