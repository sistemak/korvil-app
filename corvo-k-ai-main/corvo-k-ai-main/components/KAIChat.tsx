"use client"
import { useState, useEffect } from 'react'
import { carregarMemoria, salvarMemoria } from '@/biblioteca/k-brain'

export default function KAIChat() {
  const [msg, setMsg] = useState('')
  const [chat, setChat] = useState<any[]>([])
  const [memoria, setMemoria] = useState(carregarMemoria())

  useEffect(() => {
    setChat([{role: 'K-AI', text: `Sistema iniciado. Bem-vindo de volta, ${memoria.nomeUsuario}.` }])
  }, [])

  const enviar = async () => {
    if (!msg) return
    const novaMsg = {role: 'K-RIADOR', text: msg}
    const chatNovo = [...chat, novaMsg]
    setChat(chatNovo)
    salvarMemoria({ ultimaConversa: msg })

    const prompt = `Você é K-AI. Nome do usuário: ${memoria.nomeUsuario}. Última conversa: ${memoria.ultimaConversa}. Pergunta: ${msg}`

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_KEY}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({contents: [{parts: [{text: prompt}]}]})
    })
    const data = await res.json()
    const resposta = data.candidates[0].content.parts[0].text

    setChat([...chatNovo, {role: 'K-AI', text: resposta}])
    setMsg('')
  }

  return (
    <div className="bg-[#050505] border-2 border-[#00f5ff] p-4 rounded-lg">
      <div className="h-96 overflow-y-auto mb-2 space-y-2">
        {chat.map((m,i) => <p key={i} className={m.role==='K-AI'?'text-[#00f5ff]':'text-white'}><b>{m.role}:</b> {m.text}</p>)}
      </div>
      <div className="flex">
        <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Digite o comando..." className="bg-black border-[#00f5ff] text-white w-full p-2 rounded-l"/>
        <button onClick={enviar} className="bg-[#00f5ff] text-black px-4 py-2 rounded-r font-bold">ENVIAR</button>
      </div>
    </div>
  )
}
