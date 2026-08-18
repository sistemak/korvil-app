// ==============================================================
// Worker de Repasses (BullMQ)
// Processa os jobs da fila: executa a transferencia Pix via Asaas
// e atualiza o status do Repasse no banco.
//
// Rode em um processo separado:  npm run worker
// ==============================================================
import { Worker } from "bullmq";
import { connection, REPASSE_QUEUE } from "./connection.js";
import { prisma } from "../lib/prisma.js";
import { logger } from "../lib/logger.js";
import { transferirPix } from "../services/asaas.js";

// Processa um unico job de repasse
async function processarRepasse(job) {
  const { repasseId } = job.data;

  const repasse = await prisma.repasse.findUnique({
    where: { id: repasseId },
    include: { cobranca: true },
  });

  if (!repasse) {
    await logger.error("queue", "repasse_nao_encontrado", { repasseId });
    return;
  }

  // Se ja concluido, nao repete (idempotencia)
  if (repasse.status === "DONE") {
    await logger.warn("queue", "repasse_ja_concluido", { repasseId });
    return;
  }

  // Marca como em processamento
  await prisma.repasse.update({
    where: { id: repasseId },
    data: { status: "PROCESSING", tentativa: { increment: 1 } },
  });

  // Executa a transferencia Pix do valor liquido para a chave do KORVIL
  const transferencia = await transferirPix({
    valor: repasse.valor,
    pixKey: repasse.pixKey,
    descricao: `Repasse KORVIL - cobranca ${repasse.cobrancaId}`,
  });

  // Sucesso: atualiza o repasse
  await prisma.repasse.update({
    where: { id: repasseId },
    data: {
      status: "DONE",
      asaasId: transferencia.id,
      concluidoEm: new Date(),
      erro: null,
    },
  });

  await logger.info("queue", "repasse_concluido", {
    repasseId,
    asaasId: transferencia.id,
    valor: repasse.valor,
  });
}

// Cria o worker escutando a fila de repasses
const worker = new Worker(REPASSE_QUEUE, processarRepasse, {
  connection,
  concurrency: 5, // processa ate 5 repasses simultaneos
});

// Evento: job concluido
worker.on("completed", (job) => {
  console.log(`[worker] job ${job.id} concluido`);
});

// Evento: job falhou (apos esgotar as tentativas ou em cada tentativa)
worker.on("failed", async (job, err) => {
  const repasseId = job?.data?.repasseId;
  await logger.error("queue", "repasse_falhou", {
    jobId: job?.id,
    repasseId,
    tentativas: job?.attemptsMade,
    erro: err.message,
  });

  // Se esgotou as tentativas, marca como FAILED no banco
  if (repasseId && job && job.attemptsMade >= (job.opts.attempts || 1)) {
    await prisma.repasse
      .update({
        where: { id: repasseId },
        data: { status: "FAILED", erro: err.message },
      })
      .catch(() => {});
  }
});

console.log("[worker] Motor de Repasse KORVIL BANC iniciado. Aguardando jobs...");
