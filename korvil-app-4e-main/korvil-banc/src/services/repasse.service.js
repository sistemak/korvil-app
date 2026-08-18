// ==============================================================
// Servico de Repasse
// Calcula o valor liquido, define a data (D+0 Pix / D+30 Cartao),
// cria o registro de Repasse e enfileira o job na fila BullMQ.
// ==============================================================
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";
import { enfileirarRepasse } from "../queue/repasse.queue.js";

const UM_DIA_MS = 24 * 60 * 60 * 1000;

/**
 * Calcula o valor liquido aplicando a taxa do KORVIL.
 */
export function calcularValorLiquido(valorBruto) {
  const fee = env.repasse.feePercent / 100;
  const liquido = valorBruto * (1 - fee);
  return Number(liquido.toFixed(2));
}

/**
 * Define quantos dias de atraso o repasse deve ter conforme o metodo de pagamento.
 * Regra: D+0 para Pix, D+30 para Cartao (demais metodos tratados como D+1).
 */
export function calcularDelayDias(metodoPgto) {
  const metodo = (metodoPgto || "").toUpperCase();
  if (metodo === "PIX") return 0; // D+0
  if (metodo === "CREDIT_CARD") return 30; // D+30
  return 1; // boleto e outros: D+1
}

/**
 * Cria o Repasse para uma cobranca paga e enfileira o job de transferencia.
 * Idempotente: se ja existir repasse para a cobranca, apenas retorna.
 *
 * @param {object} cobranca - registro Cobranca (ja atualizado como pago)
 */
export async function agendarRepasse(cobranca) {
  // Evita duplicidade: uma cobranca gera no maximo um repasse
  const existente = await prisma.repasse.findUnique({
    where: { cobrancaId: cobranca.id },
  });
  if (existente) {
    await logger.warn("queue", "repasse_ja_existente", { cobrancaId: cobranca.id });
    return existente;
  }

  const valorLiquido = cobranca.valorLiquido ?? calcularValorLiquido(cobranca.valor);
  const dias = calcularDelayDias(cobranca.metodoPgto);
  const agendadoPara = new Date(Date.now() + dias * UM_DIA_MS);

  // Cria o registro de Repasse
  const repasse = await prisma.repasse.create({
    data: {
      cobrancaId: cobranca.id,
      pixKey: env.repasse.pixKey,
      valor: valorLiquido,
      agendadoPara,
      status: "SCHEDULED",
    },
  });

  // Enfileira o job com o delay correspondente (D+0 = sem delay)
  await enfileirarRepasse({ repasseId: repasse.id }, dias * UM_DIA_MS);

  await logger.info("queue", "repasse_agendado", {
    repasseId: repasse.id,
    cobrancaId: cobranca.id,
    valor: valorLiquido,
    dias,
    agendadoPara,
  });

  return repasse;
}
