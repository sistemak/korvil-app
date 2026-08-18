// ==============================================================
// Rotas de autenticacao do Dashboard
// POST /api/auth/login  -> valida usuario/senha e devolve um token simples
//
// Observacao: autenticacao propositalmente simples (usuario unico via .env)
// pois e um painel interno. Para producao, troque por um provedor real.
// ==============================================================
import { Router } from "express";
import crypto from "node:crypto";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

export const authRouter = Router();

// Gera um token assinado (HMAC) simples para a sessao do dashboard
function gerarToken(usuario) {
  const payload = `${usuario}:${Date.now()}`;
  const assinatura = crypto
    .createHmac("sha256", env.dashboard.secret)
    .update(payload)
    .digest("hex");
  // token = base64(payload).assinatura
  return `${Buffer.from(payload).toString("base64")}.${assinatura}`;
}

// Middleware que protege rotas exigindo o token no header Authorization
export function exigirAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "").trim();
  if (!token || !validarToken(token)) {
    return res.status(401).json({ erro: "Nao autorizado." });
  }
  next();
}

// Valida a assinatura do token
function validarToken(token) {
  try {
    const [payloadB64, assinatura] = token.split(".");
    const payload = Buffer.from(payloadB64, "base64").toString("utf8");
    const esperada = crypto
      .createHmac("sha256", env.dashboard.secret)
      .update(payload)
      .digest("hex");
    return assinatura === esperada;
  } catch {
    return false;
  }
}

// Login do dashboard
authRouter.post("/login", async (req, res) => {
  const { usuario, senha } = req.body || {};
  if (usuario === env.dashboard.user && senha === env.dashboard.pass) {
    await logger.info("api", "login_dashboard_ok", { usuario });
    return res.json({ token: gerarToken(usuario), usuario });
  }
  await logger.warn("api", "login_dashboard_falha", { usuario });
  return res.status(401).json({ erro: "Usuario ou senha invalidos." });
});
