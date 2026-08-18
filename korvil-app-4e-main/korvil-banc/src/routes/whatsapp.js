// ==============================================================
// Webhook interno de WhatsApp
// POST /whatsapp-korvil/  -> recebe o gatilho de envio de mensagem
//
// Aqui e o ponto de integracao onde voce plugaria a API real de
// WhatsApp (ex: Evolution API, Meta Cloud API, Z-API, etc.).
// ==============================================================
import { Router } from "express";
import { logger } from "../lib/logger.js";

export const whatsappRouter = Router();

whatsappRouter.post("/", async (req, res) => {
  const { cobrancaId, cliente, mensagem, modulo } = req.body || {};

  // Registra o disparo. Substitua este trecho pela chamada a API real.
  await logger.info("whatsapp", "mensagem_recebida_webhook_interno", {
    cobrancaId,
    modulo,
    telefone: cliente?.telefone,
    mensagem,
  });

  // TODO: integrar com a API de WhatsApp de sua escolha aqui.
  return res.status(200).json({ ok: true, enviado: true });
});
