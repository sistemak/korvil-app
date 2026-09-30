import fs from 'fs'
import path from 'path'
export default function handler(req,res){
  if(req.method!=='POST') return res.status(405).end()
  const file = path.join(process.cwd(),'data/scheduled.json')
  let queue = []
  try{ queue = JSON.parse(fs.readFileSync(file,'utf8')) }catch{ queue=[] }
  const { phone, message, send_at } = req.body
  queue.push({ id: Date.now(), phone, message, send_at, status:'pending', created_at:new Date().toISOString() })
  fs.writeFileSync(file, JSON.stringify(queue,null,2))
  res.json({ok:true, queue})
}
