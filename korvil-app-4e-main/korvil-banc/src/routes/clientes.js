// ==============================================================
// Rotas de Clientes
// POST /api/clientes        -> cria cliente (local + Asaas)
// GET  /api/clientes        -> lista clientes
// GET  /api/clientes/:id    -> detalhe de um cliente
// ==============================================================
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { logger } from "../lib/logger.js";
import { criarClienteAsaas } from "../services/asaas.js";

export const clientesRouter = Router();

// Cria um cliente localmente e sincroniza com o Asaas
clientesRouter.post("/", async (req, res) => {
  try {
    const { nome, email, cpfCnpj, telefone } = req.body;

    // Validacao minima
    if (!nome) {
      return res.status(400).json({ erro: "O campo 'nome' e obrigatorio." });
    }

    // 1) Cria o customer no Asaas
    const asaasCustomer = await criarClienteAsaas({ nome, email, cpfCnpj, telefone });

    // 2) Persiste localmente
    const cliente = await prisma.cliente.create({
      data: {
        nome,
        email,
        cpfCnpj,
        telefone,
        asaasId: asaasCustomer.id,
      },
    });

    await logger.info("api", "cliente_criado", { clienteId: cliente.id });
    return res.status(201).json(cliente);
  } catch (err) {
    await logger.error("api", "erro_criar_cliente", { erro: err.message });
    return res.status(500).json({ erro: "Falha ao criar cliente.", detalhe: err.message });
  }
});

// Lista clientes
clientesRouter.get("/", async (_req, res) => {
  const clientes = await prisma.cliente.findMany({ orderBy: { criadoEm: "desc" } });
  return res.json(clientes);
});

// Detalhe de um cliente com suas cobrancas
clientesRouter.get("/:id", async (req, res) => {
  const cliente = await prisma.cliente.findUnique({
    where: { id: req.params.id },
    include: { cobrancas: true },
  });
  if (!cliente) return res.status(404).json({ erro: "Cliente nao encontrado." });
  return res.json(cliente);
});
