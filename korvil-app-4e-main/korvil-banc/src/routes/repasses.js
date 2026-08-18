// ==============================================================
// Rotas de Repasses
// GET /api/repasses          -> lista repasses (filtro ?status= &modulo=)
// GET /api/repasses/:id      -> detalhe
// ==============================================================
import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const repassesRouter = Router();

// Lista repasses
repassesRouter.get("/", async (req, res) => {
  const { status, modulo } = req.query;
  const where = {};
  if (status) where.status = String(status);
  // filtro por modulo passa pela cobranca relacionada
  if (modulo) where.cobranca = { modulo: String(modulo) };

  const repasses = await prisma.repasse.findMany({
    where,
    include: { cobranca: { include: { cliente: true } } },
    orderBy: { criadoEm: "desc" },
  });
  return res.json(repasses);
});

// Detalhe de um repasse
repassesRouter.get("/:id", async (req, res) => {
  const repasse = await prisma.repasse.findUnique({
    where: { id: req.params.id },
    include: { cobranca: { include: { cliente: true } } },
  });
  if (!repasse) return res.status(404).json({ erro: "Repasse nao encontrado." });
  return res.json(repasse);
});
