import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
export async function getSocket(){
  const { state, saveCreds } = await useMultiFileAuthState('./korvil/sections/ktp/projetotransformacao/mensagens-automaticas-whatsapp/auth')
  const sock = makeWASocket({ auth: state, browser: ['KTP','Chrome','1.0'], printQRInTerminal: false })
  sock.ev.on('creds.update', saveCreds)
  return sock
}
// --- SEPARAÇÃO 10/10 AUTÔNOMA - NÃO DUPLICAR - KTP MASTER FINAL ---
