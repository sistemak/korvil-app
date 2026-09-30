import { getSocket } from './baileys.js'
import fs from 'fs'
const PATH = './korvil/sections/ktp/projetotransformacao/mensagens-automaticas-whatsapp/data/scheduled.json'
async function main(){
  if(!fs.existsSync(PATH)){ console.log('sem fila'); return }
  let queue = JSON.parse(fs.readFileSync(PATH,'utf8'))
  const agora = new Date()
  const pendentes = queue.filter(m=> m.status==='pending' && new Date(m.send_at) <= agora).slice(0,15)
  if(!pendentes.length){ console.log('nada pendente'); return }
  console.log(`Enviando ${pendentes.length}...`)
  const sock = await getSocket()
  await new Promise(r=>{ sock.ev.on('connection.update', ({connection})=>{ if(connection==='open') r() }); setTimeout(r,20000) })
  for(const msg of pendentes){
    try{
      const jid = `${msg.phone.replace(/\D/g,'')}@s.whatsapp.net`
      await sock.sendMessage(jid, { text: msg.message })
      msg.status='sent'; msg.sent_at=new Date().toISOString()
      console.log(`✓ ${msg.phone}`)
      await new Promise(r=>setTimeout(r,4000+Math.random()*2000))
    }catch(e){ msg.status='error'; msg.error=e.message; console.error(`X ${msg.phone} ${e.message}`) }
  }
  fs.writeFileSync(PATH, JSON.stringify(queue, null, 2))
}
main()
// --- 10/10 AUTÔNOMO - ENVIO REAL A CADA MINUTO VIA WORKFLOW ---
