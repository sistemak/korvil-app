// ==============================================================
// Logger do KORVIL BANC
// Grava em arquivo (/logs), no console e na tabela Log do banco.
// ==============================================================
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { prisma } from "./prisma.js";

// Resolve o caminho absoluto da pasta /logs (../../logs a partir deste arquivo)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOG_DIR = path.resolve(__dirname, "../../logs");

// Garante que a pasta de logs exista
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// Monta o caminho do arquivo do dia (ex: logs/2026-07-23.log)
function arquivoDoDia() {
  const dia = new Date().toISOString().slice(0, 10);
  return path.join(LOG_DIR, `${dia}.log`);
}

// Escreve uma linha no arquivo de log
function escreverArquivo(linha) {
  try {
    fs.appendFileSync(arquivoDoDia(), linha + "\n", "utf8");
  } catch (err) {
    // Se falhar ao gravar arquivo, ao menos avisa no console
    console.error("[logger] falha ao escrever arquivo de log:", err.message);
  }
}

/**
 * Registra um evento.
 * @param {"info"|"warn"|"error"} nivel
 * @param {string} origem  - api | webhook | queue | asaas | whatsapp
 * @param {string} evento  - nome curto do evento
 * @param {object} [detalhe] - dados extras (serializados em JSON)
 */
export async function log(nivel, origem, evento, detalhe = null) {
  const timestamp = new Date().toISOString();
  const detalheStr = detalhe ? JSON.stringify(detalhe) : "";
  const linha = `[${timestamp}] [${nivel.toUpperCase()}] [${origem}] ${evento} ${detalheStr}`.trim();

  // 1) Console
  const printer = nivel === "error" ? console.error : nivel === "warn" ? console.warn : console.log;
  printer(linha);

  // 2) Arquivo em /logs
  escreverArquivo(linha);

  // 3) Banco (tabela Log) - nao interrompe o fluxo se falhar
  try {
    await prisma.log.create({
      data: { nivel, origem, evento, detalhe: detalheStr || null },
    });
  } catch (err) {
    console.error("[logger] falha ao gravar log no banco:", err.message);
  }
}

// Atalhos convenientes
export const logger = {
  info: (origem, evento, detalhe) => log("info", origem, evento, detalhe),
  warn: (origem, evento, detalhe) => log("warn", origem, evento, detalhe),
  error: (origem, evento, detalhe) => log("error", origem, evento, detalhe),
};
