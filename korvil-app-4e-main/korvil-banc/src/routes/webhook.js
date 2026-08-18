// ==============================================================
// Webhook do ASAAS
// POST /webhook/asaas  -> recebe eventos (PAYMENT_RECEIVED, etc.)
//
// Ao confirmar pagamento:
//  1) atualiza a cobranca
//  2) agenda o repasse (fila BullMQ) - D+0 Pix / D+30 Cartao
//  3) notifica o WhatsApp interno
// ==============================================================
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";
import { calcularValorLiquido, agendarRepasse } from "../services/repasse.service.js";
import { notificarWhatsapp } from "../services/whatsapp.service.js";

export const webhookRouter = Router();

// Eventos que indicam que o dinheiro entrou
const EVENTOS_PAGAMENTO = ["PAYMENT_RECEIVED", "PAYMENT_CONFIRMED"];

webhookRouter.post("/asaas", async (req, res) => {
  try {
    // 1) Validacao do token do webhook (cabecalho enviado pelo Asaas)
    const tokenRecebido = req.headers["asaas-access-token"];
    if (env.asaas.webhookToken && tokenRecebido !== env.asaas.webhookToken) {
      await logger.warn("webhook", "token_invalido", { tokenRecebido });
      return res.status(401).json({ erro: "Token de webhook invalido." });
    }

    const evento = req.body?.event;
    const payment = req.body?.payment;
    await logger.info("webhook", "evento_recebido", { evento, paymentId: payment?.id });

    // Responde rapido; so processamos eventos de pagamento
    if (!EVENTOS_PAGAMENTO.includes(evento) || !payment) {
      return res.status(200).json({ ok: true, ignorado: true });
    }

    // 2) Localiza a cobranca pelo id do Asaas ou pela referencia externa
    const cobranca = await prisma.cobranca.findFirst({
      where: {
        OR: [{ asaasId: payment.id }, { id: payment.externalReference || "" }],
      },
      include: { cliente: true },
    });

    if (!cobranca) {
      await logger.warn("webhook", "cobranca_nao_encontrada", { paymentId: payment.id });
      return res.status(200).json({ ok: true, encontrada: false });
    }

    // Idempotencia: se ja processada, nao repete
    if (["RECEIVED", "CONFIRMED"].includes(cobranca.status)) {
      return res.status(200).json({ ok: true, jaProcessada: true });
    }

    // 3) Atualiza a cobranca como paga
    const valorLiquido = calcularValorLiquido(cobranca.valor);
    const cobrancaAtualizada = await prisma.cobranca.update({
      where: { id: cobranca.id },
      data: {
        status: "RECEIVED",
        metodoPgto: payment.billingType, // PIX | CREDIT_CARD | BOLETO
        valorLiquido,
        pagoEm: new Date(),
      },
      include: { cliente: true },
    });

    // 4) Agenda o repasse na fila (D+0 Pix / D+30 Cartao)
    await agendarRepasse(cobrancaAtualizada);

    // 5) Notifica o WhatsApp interno (nao bloqueia a resposta)
    notificarWhatsapp(cobrancaAtualizada);

    return res.status(200).json({ ok: true, processada: true });
  } catch (err) {
    await logger.error("webhook", "erro_processar_webhook", { erro: err.message });
    // Retorna 200 mesmo em erro para o Asaas nao reenviar em loop;
    // o erro fica registrado nos logs para reprocessamento manual.
    return res.status(200).json({ ok: false, erro: err.message });
  }
});
