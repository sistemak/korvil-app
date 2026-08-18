// ==============================================================
// KORVIL BANC - Servidor Express (entrada principal)
// Junta todas as rotas da API, o webhook, o dashboard e o checkout.
//
// Rode com:  npm run dev   (API)
//            npm run worker (motor de repasse, processo separado)
// ==============================================================
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { env } from "./config/env.js";
import { logger } from "./lib/logger.js";

// Rotas
import { clientesRouter } from "./routes/clientes.js";
import { cobrancasRouter } from "./routes/cobrancas.js";
import { extratoRouter } from "./routes/extrato.js";
import { repassesRouter } from "./routes/repasses.js";
import { modulosRouter } from "./routes/modulos.js";
import { webhookRouter } from "./routes/webhook.js";
import { whatsappRouter } from "./routes/whatsapp.js";
import { authRouter } from "./routes/auth.js";

// Resolve caminhos de arquivos estaticos (dashboard e public)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const app = express();

// ---------- Middlewares globais ----------
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny")); // log http basico no console

// ---------- Healthcheck ----------
app.get("/health", (_req, res) => {
  res.json({ status: "ok", servico: "KORVIL BANC", horario: new Date().toISOString() });
});

// ---------- API REST ----------
app.use("/api/auth", authRouter);
app.use("/api/clientes", clientesRouter);
app.use("/api/cobrancas", cobrancasRouter);
app.use("/api/extrato", extratoRouter);
app.use("/api/repasses", repassesRouter);
app.use("/api/modulos", modulosRouter);

// ---------- Webhooks ----------
app.use("/webhook", webhookRouter); // Asaas -> /webhook/asaas
app.use("/whatsapp-korvil", whatsappRouter); // integracao interna

// ---------- Arquivos estaticos ----------
// Checkout publico:  /checkout.html?modulo=k-th&valor=150
app.use(express.static(path.join(ROOT, "public")));
// Dashboard interno: /dashboard/
app.use("/dashboard", express.static(path.join(ROOT, "dashboard")));

// Redireciona a raiz para o dashboard
app.get("/", (_req, res) => res.redirect("/dashboard/"));

// ---------- Tratamento de erros ----------
app.use((err, _req, res, _next) => {
  logger.error("api", "erro_nao_tratado", { erro: err.message });
  res.status(500).json({ erro: "Erro interno.", detalhe: err.message });
});

// ---------- Inicializacao ----------
app.listen(env.port, () => {
  console.log("==================================================");
  console.log("  KORVIL BANC rodando");
  console.log(`  API:       ${env.baseUrl}`);
  console.log(`  Dashboard: ${env.baseUrl}/dashboard/`);
  console.log(`  Checkout:  ${env.baseUrl}/checkout.html?modulo=k-th&valor=150`);
  console.log(`  Webhook:   ${env.baseUrl}/webhook/asaas`);
  console.log("==================================================");
  logger.info("api", "servidor_iniciado", { porta: env.port });
});
