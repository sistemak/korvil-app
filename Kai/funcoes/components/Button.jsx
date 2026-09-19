import { useState } from "react";
export default function KaiButton({children}){
  const [clicks,setClicks]=useState(0);
  return <button onClick={()=>setClicks(c=>c+1)} className="px-4 py-2 bg-[#00ff88] text-black font-mono font-bold rounded-lg shadow-[0_0_20px_rgba(0,255,136,0.4)]">{children} ({clicks})</button>
}