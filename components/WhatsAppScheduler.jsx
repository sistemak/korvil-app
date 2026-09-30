import { useState, useEffect } from 'react'

export default function WhatsAppScheduler({ contacts = [] }){
  const [token, setToken] = useState('')
  const [msg, setMsg] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [sel, setSel] = useState([])
  const [queue, setQueue] = useState([])
  const [repo, setRepo] = useState('sistemak/korvil-app')

  useEffect(()=>{
    const t = localStorage.getItem('GH_TOKEN')
    if(t) setToken(t)
    loadQueue()
  },[])

  async function loadQueue(){
    try{
      const res = await fetch(`https://raw.githubusercontent.com/${repo}/main/data/scheduled.json?t=${Date.now()}`)
      const data = await res.json()
      setQueue(data.slice(-20).reverse())
    }catch{}
  }

  function toggle(phone){
    setSel(prev=> prev.includes(phone)? prev.filter(p=>p!==phone) : [...prev, phone])
  }

  async function commitQueue(newQueue){
    const getRes = await fetch(`https://api.github.com/repos/${repo}/contents/data/scheduled.json`, {
      headers: { Authorization: `token ${token}` }
    })
    const file = await getRes.json()
    const sha = file.sha
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(newQueue, null, 2))))
    await fetch(`https://api.github.com/repos/${repo}/contents/data/scheduled.json`, {
      method: 'PUT',
      headers: { Authorization: `token ${token}`, 'Content-Type':'application/json' },
      body: JSON.stringify({ message: `programa whatsapp ${newQueue.length} msgs`, content, sha })
    })
  }

  async function handleSchedule(){
    if(!token) return alert('Cole seu GH_TOKEN primeiro')
    if(!msg || !date || !time || sel.length===0) return alert('Preencha mensagem, data, hora e selecione contatos')
    localStorage.setItem('GH_TOKEN', token)
    const send_at = new Date(`${date}T${time}`).toISOString()
    let current = []
    try{
      const res = await fetch(`https://raw.githubusercontent.com/${repo}/main/data/scheduled.json?t=${Date.now()}`)
      current = await res.json()
    }catch{ current = [] }
    const novos = sel.map(phone=>({ id: Date.now()+Math.random(), phone, message: msg, send_at, status: 'pending', created_at: new Date().toISOString() }))
    const updated = [...current, ...novos]
    await commitQueue(updated)
    alert(`✅ ${novos.length} mensagens programadas! GitHub vai enviar automático.`)
    setMsg('')
    loadQueue()
  }

  return (
    <div className="bg-zinc-900 border-2 border-green-600/30 rounded-2xl p-5 mt-6">
      <h2 className="text-xl font-black text-white mb-1">📅 PROGRAMAR WHATSAPP REAL</h2>
      <p className="text-xs text-zinc-400 mb-4">Só GH_TOKEN + NODE - Envia mesmo com PC desligado</p>
      
      <input value={token} onChange={e=>setToken(e.target.value)} type="password" placeholder="Cole seu GH_TOKEN ghp_..." className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white text-sm mb-3" />
      
      <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Mensagem que vai pro WhatsApp..." className="w-full bg-black border border-zinc-700 rounded-xl p-3 text-white min-h-[90px] mb-3" />
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="bg-black border border-zinc-700 rounded-xl p-3 text-white" />
        <input type="time" value={time} onChange={e=>setTime(e.target.value)} className="bg-black border border-zinc-700 rounded-xl p-3 text-white" />
      </div>

      <div className="bg-black border border-zinc-800 rounded-xl p-3 mb-3 max-h-[200px] overflow-y-auto">
        <div className="text-xs text-zinc-400 mb-2">{sel.length} selecionados de {contacts.length||260} contatos</div>
        {(contacts.length?contacts:Array.from({length:5},(_,i)=>({phone:`551199999000${i}`, name:`Contato ${i+1}`}))).map(c=>(
          <label key={c.phone} className="flex items-center gap-2 py-1 text-sm text-white cursor-pointer hover:bg-zinc-900 px-2 rounded">
            <input type="checkbox" checked={sel.includes(c.phone)} onChange={()=>toggle(c.phone)} className="accent-green-600" />
            {c.name||c.phone} - {c.phone}
          </label>
        ))}
      </div>

      <button onClick={handleSchedule} className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-3.5 rounded-xl text-lg">
        🚀 PROGRAMAR ENVIO AUTOMÁTICO REAL
      </button>

      <div className="mt-5">
        <h3 className="text-sm font-bold text-zinc-300 mb-2">Fila atual (GitHub)</h3>
        {queue.map(q=>(
          <div key={q.id} className="flex justify-between text-xs bg-black border border-zinc-800 p-2 rounded mb-1">
            <span className="text-white truncate w-[30%]">{q.phone}</span>
            <span className="text-zinc-400 truncate w-[40%]">{q.message.slice(0,30)}</span>
            <span className={q.status==='sent'?'text-green-500':q.status==='pending'?'text-yellow-400':'text-red-500'}>{q.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
