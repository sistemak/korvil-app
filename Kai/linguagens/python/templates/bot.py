import os
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes

TOKEN = os.getenv("TELEGRAM_TOKEN","SEU_TOKEN_AQUI")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🧠 K-AI Bot Online - Evoluindo... /evoluir")

async def evoluir(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(f"K-AI evolução {len(context.bot_data)} - nova capacidade desbloqueada!")

async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(f"K-AI entendeu: {update.message.text} | Gerando código...")

if __name__ == "__main__":
    app = ApplicationBuilder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("evoluir", evoluir))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))
    print("K-AI Bot rodando...")
    app.run_polling()