// ==============================================================
// Conexao Redis (ioredis) compartilhada pela fila BullMQ
// ==============================================================
import IORedis from "ioredis";
import { env } from "../config/env.js";

// maxRetriesPerRequest precisa ser null para o BullMQ funcionar corretamente.
// retryStrategy com backoff evita "spam" de erros quando o Redis esta fora.
export const connection = new IORedis(env.redisUrl, {
  maxRetriesPerRequest: null,
  retryStrategy: (tentativas) => Math.min(tentativas * 1000, 15000), // ate 15s entre tentativas
});

// Um unico handler de erro evita exceptions nao tratadas quando o Redis cai.
connection.on("error", (err) => {
  // Loga so a mensagem para nao poluir com stack traces repetidos
  console.warn(`[redis] indisponivel: ${err.message}`);
});

// Nome unico da fila de repasses
export const REPASSE_QUEUE = "repasses";
