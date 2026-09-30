import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import qrcode from 'qrcode-terminal'
async function gen(){
  const {state, saveCreds} = await useMultiFileAuthState('./auth')
  const sock = makeWASocket({auth: state, printQRInTerminal: false})
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', ({qr, connection})=>{
    if(qr){ console.log('Escaneie o QR abaixo:'); qrcode.generate(qr,{small:true}) }
    if(connection==='open'){ console.log('\n✓ CONECTADO! Pasta ./auth criada. Commita ela pro GitHub.\n'); process.exit(0) }
  })
}
gen()
