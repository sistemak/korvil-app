// ==============================================================
// Servico de integracao com o ASAAS
// Docs: https://docs.asaas.com/
// Regra de negocio: cobrancas SEMPRE dinamicas (billingType UNDEFINED).
// ==============================================================
import axios from "axios";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

// Cliente HTTP pre-configurado com a base URL e a API key do Asaas
const api = axios.create({
  baseURL: env.asaas.apiUrl,
  headers: {
    "Content-Type": "application/json",
    access_token: env.asaas.apiKey,
    "User-Agent": "KORVIL-BANC/1.0",
  },
  timeout: 20000,
});

// Interceptor para logar erros de forma padronizada
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const detalhe = {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    };
    await logger.error("asaas", "erro_requisicao_asaas", detalhe);
    return Promise.reject(error);
  }
);

/**
 * Cria (ou reaproveita) um customer no Asaas.
 * @param {{nome:string,email?:string,cpfCnpj?:string,telefone?:string}} dados
 * @returns {Promise<object>} customer do Asaas
 */
export async function criarClienteAsaas(dados) {
  const payload = {
    name: dados.nome,
    email: dados.email,
    cpfCnpj: dados.cpfCnpj,
    mobilePhone: dados.telefone,
  };
  const { data } = await api.post("/customers", payload);
  await logger.info("asaas", "cliente_criado", { asaasId: data.id });
  return data;
}

/**
 * Cria uma cobranca DINAMICA no Asaas.
 * IMPORTANTE: billingType e SEMPRE "UNDEFINED" para o cliente escolher
 * como pagar (Pix, cartao ou boleto) na tela do Asaas.
 *
 * @param {object} params
 * @param {string} params.asaasCustomerId - id do customer no Asaas
 * @param {number} params.valor - valor da cobranca
 * @param {string} params.descricao
 * @param {string} params.referenciaExterna - id interno da cobranca (externalReference)
 * @param {number} [params.parcelas] - numero de parcelas (para tipo UNICO no cartao)
 * @returns {Promise<object>} payment do Asaas
 */
export async function criarCobrancaAsaas(params) {
  const { asaasCustomerId, valor, descricao, referenciaExterna, parcelas = 1 } = params;

  // Vencimento padrao: hoje (cobranca dinamica pode ser paga na hora via Pix)
  const hoje = new Date().toISOString().slice(0, 10);

  const payload = {
    customer: asaasCustomerId,
    billingType: "UNDEFINED", // <-- regra de negocio: sempre dinamico
    value: Number(valor.toFixed(2)),
    dueDate: hoje,
    description: descricao,
    externalReference: referenciaExterna,
  };

  // Se houver mais de 1 parcela, envia como parcelamento (usado no cartao)
  if (parcelas > 1) {
    payload.installmentCount = parcelas;
    payload.installmentValue = Number((valor / parcelas).toFixed(2));
    delete payload.value; // Asaas usa installmentValue quando parcelado
  }

  const { data } = await api.post("/payments", payload);
  await logger.info("asaas", "cobranca_criada", {
    asaasId: data.id,
    valor,
    parcelas,
  });
  return data;
}

/**
 * Consulta uma cobranca especifica no Asaas.
 */
export async function buscarCobrancaAsaas(paymentId) {
  const { data } = await api.get(`/payments/${paymentId}`);
  return data;
}

/**
 * Realiza uma transferencia Pix (repasse do valor liquido) via Asaas.
 * @param {{valor:number, pixKey:string, descricao?:string}} dados
 * @returns {Promise<object>} transferencia do Asaas
 */
export async function transferirPix(dados) {
  const payload = {
    value: Number(dados.valor.toFixed(2)),
    pixAddressKey: dados.pixKey,
    operationType: "PIX",
    description: dados.descricao || "Repasse KORVIL BANC",
  };
  const { data } = await api.post("/transfers", payload);
  await logger.info("asaas", "pix_transferido", {
    asaasId: data.id,
    valor: dados.valor,
    pixKey: dados.pixKey,
  });
  return data;
}

export default {
  criarClienteAsaas,
  criarCobrancaAsaas,
  buscarCobrancaAsaas,
  transferirPix,
};
