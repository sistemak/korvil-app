import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
export async function getSocket(){
  const { state, saveCreds } = await useMultiFileAuthState('./auth')
  const sock = makeWASocket({ 
    auth: state, 
    browser: ['KTP','Chrome','1.0'], 
    printQRInTerminal: false 
  })
  sock.ev.on('creds.update', saveCreds)
  return sock
}
