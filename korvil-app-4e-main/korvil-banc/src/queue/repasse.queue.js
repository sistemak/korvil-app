// ==============================================================
// Fila de Repasses (BullMQ)
// Enfileira jobs de transferencia Pix do valor liquido para o KORVIL.
// ==============================================================
import { Queue } from "bullmq";
import { connection, REPASSE_QUEUE } from "./connection.js";

// Fila unica de repasses
export const repasseQueue = new Queue(REPASSE_QUEUE, {
  connection,
  defaultJobOptions: {
    attempts: 5, // ate 5 tentativas
    backoff: { type: "exponential", delay: 5000 }, // espera crescente entre tentativas
    removeOnComplete: 1000, // mantem historico dos ultimos 1000 concluidos
    removeOnFail: false, // guarda os que falharam para inspecao
  },
});

/**
 * Enfileira um job de repasse.
 * @param {object} payload
 * @param {string} payload.repasseId - id do Repasse no banco
 * @param {number} [delayMs] - atraso ate o job ficar disponivel (D+0 ou D+30)
 */
export async function enfileirarRepasse(payload, delayMs = 0) {
  return repasseQueue.add("repasse", payload, {
    delay: Math.max(0, delayMs),
    jobId: `repasse:${payload.repasseId}`, // idempotencia: nao duplica o mesmo repasse
  });
}
