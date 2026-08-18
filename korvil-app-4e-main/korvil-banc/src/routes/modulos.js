// ==============================================================
// Rotas de Modulos
// GET /api/modulos          -> lista todos os modulos e suas descricoes
// GET /api/modulos/:slug    -> detalhe de um modulo
// ==============================================================
import { Router } from "express";
import { listarModulos, getModulo } from "../modules/index.js";

export const modulosRouter = Router();

// Lista todos os modulos
modulosRouter.get("/", (_req, res) => {
  return res.json(listarModulos());
});

// Detalhe de um modulo pelo slug
modulosRouter.get("/:slug", (req, res) => {
  const modulo = getModulo(req.params.slug);
  if (!modulo) return res.status(404).json({ erro: "Modulo nao encontrado." });
  return res.json({ slug: req.params.slug, ...modulo });
});
