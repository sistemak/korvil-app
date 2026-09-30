import { getSocket } from './baileys.js'
import fs from 'fs'
async function main(){
  const path = './data/scheduled.json'
  if(!fs.existsSync(path)){ console.log('sem fila'); return }
  const queue = JSON.parse(fs.readFileSync(path,'utf8'))
  const agora = new Date()
  const pendentes = queue.filter(m=> m.status==='pending' && new Date(m.send_at) <= agora).slice(0,10)
  if(!pendentes.length){ console.log('nada pendente'); return }
  console.log(`Enviando ${pendentes.length}...`)
  const sock = await getSocket()
  await new Promise(r=>{ 
    sock.ev.on('connection.update', ({connection})=>{ if(connection==='open') r() }); 
    setTimeout(r,15000) 
  })
  for(const msg of pendentes){
    try{
      const jid = `${msg.phone.replace(/\D/g,'')}@s.whatsapp.net`
      await sock.sendMessage(jid, { text: msg.message })
      msg.status = 'sent'
      msg.sent_at = new Date().toISOString()
      console.log(`✓ ${msg.phone}`)
      await new Promise(r=>setTimeout(r,4000))
    }catch(e){
      msg.status='error'
      msg.error = e.message
      console.error(`X ${msg.phone} ${e.message}`)
    }
  }
  fs.writeFileSync(path, JSON.stringify(queue, null, 2))
}
main()
