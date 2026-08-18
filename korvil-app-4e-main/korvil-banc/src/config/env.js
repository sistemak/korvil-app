// ==============================================================
// Carrega e centraliza as variaveis de ambiente do .env
// ==============================================================
import dotenv from "dotenv";

// Le o arquivo .env na raiz do projeto korvil-banc
dotenv.config();

// Helper: retorna a variavel ou um valor padrao
function get(key, fallback = undefined) {
  const value = process.env[key];
  return value !== undefined && value !== "" ? value : fallback;
}

export const env = {
  // Servidor
  port: Number(get("PORT", 3333)),
  baseUrl: get("BASE_URL", "http://localhost:3333"),

  // Banco
  databaseUrl: get("DATABASE_URL", "file:./dev.db"),

  // Redis / fila
  redisUrl: get("REDIS_URL", "redis://localhost:6379"),

  // Asaas
  asaas: {
    apiUrl: get("ASAAS_API_URL", "https://sandbox.asaas.com/api/v3"),
    apiKey: get("ASAAS_API_KEY", ""),
    webhookToken: get("ASAAS_WEBHOOK_TOKEN", ""),
  },

  // Motor de repasse
  repasse: {
    pixKey: get("REPASSE_PIX_KEY", "korvil.p@gmail.com"),
    feePercent: Number(get("KORVIL_FEE_PERCENT", 0)),
  },

  // Integracao WhatsApp interna
  whatsappWebhookUrl: get("WHATSAPP_WEBHOOK_URL", "http://localhost:3333/whatsapp-korvil/"),

  // Dashboard
  dashboard: {
    user: get("DASHBOARD_USER", "admin"),
    pass: get("DASHBOARD_PASS", "korvil2025"),
    secret: get("DASHBOARD_SECRET", "troque_este_segredo"),
  },
};
