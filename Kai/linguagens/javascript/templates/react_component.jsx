import { useState, useEffect } from 'react';
export default function KaiComponent({ title = "K-AI Component" }){
  const [count,setCount] = useState(0);
  const [evolving,setEvolving] = useState(false);
  useEffect(()=>{ if(evolving){ const t=setTimeout(()=>setEvolving(false),1200); return ()=>clearTimeout(t);} },[evolving]);
  return (
    <div className="p-6 rounded-2xl bg-[#11111b] border border-[#00ff88]/30 shadow-[0_0_30px_rgba(0,255,136,0.15)]">
      <h2 className="text-[#00ff88] font-mono font-bold text-xl">{title} {evolving && '🧬'}</h2>
      <p className="text-zinc-400 text-sm mt-2">Gerado por K-AI - Real React Component</p>
      <div className="mt-4 flex gap-2">
        <button onClick={()=>{setCount(c=>c+1); setEvolving(true)}} className="px-4 py-2 bg-[#00ff88] text-black font-mono font-bold rounded-lg">EVOLUIR ({count})</button>
        <button onClick={()=>setCount(0)} className="px-3 py-2 bg-white/10 text-white rounded-lg">Reset</button>
      </div>
      <div className="mt-4 h-2 bg-black rounded-full overflow-hidden">
        <div className="h-full bg-[#00ff88] transition-all" style={{width: `${Math.min(100,count*10)}%`}}/>
      </div>
    </div>
  )
}