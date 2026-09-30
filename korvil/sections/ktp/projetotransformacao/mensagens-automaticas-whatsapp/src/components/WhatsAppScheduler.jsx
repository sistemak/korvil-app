import { useState } from 'react'
export default function WhatsAppScheduler({ contacts }){
  const [selected, setSelected] = useState([])
  const [message, setMessage] = useState('')
  const [date, setDate] = useState('')
  return (
    <div style={{background:'#0a0a0a', border:'1px solid #22c55e33', borderRadius:16, padding:16}}>
      <h3>📅 Agendar (Component React)</h3>
      <p style={{fontSize:12, color:'#888'}}>Use apenas dentro de index.html principal - este é componente auxiliar 10/10</p>
    </div>
  )
}
// --- NÃO DUPLICAR - SEPARAÇÃO 10/10 ---
