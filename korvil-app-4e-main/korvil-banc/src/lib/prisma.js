// ==============================================================
// Instancia unica (singleton) do Prisma Client
// ==============================================================
import { PrismaClient } from "@prisma/client";

// Uma unica instancia reaproveitada em todo o app evita
// esgotar as conexoes com o banco.
export const prisma = new PrismaClient({
  log: ["warn", "error"],
});
