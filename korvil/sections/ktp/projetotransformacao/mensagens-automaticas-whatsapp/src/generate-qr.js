import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import qrcode from 'qrcode-terminal'
async function main(){
  const { state, saveCreds } = await useMultiFileAuthState('./korvil/sections/ktp/projetotransformacao/mensagens-automaticas-whatsapp/auth')
  const sock = makeWASocket({ auth: state, browser: ['KTP','Chrome','1.0'], printQRInTerminal: false })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', ({ qr, connection })=>{
    if(qr){ console.log('QR CODE KTP 10/10:'); qrcode.generate(qr, { small:true }) }
    if(connection==='open') console.log('✅ Conectado! Auth salvo em mensagens-automaticas-whatsapp/auth/')
  })
}
main()
