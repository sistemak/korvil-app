// KORVIL LOGIC COMPARTILHADA - SEM TOKEN MANUAL
function normalizePastaMae(nome){
  const n=(nome||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const parts=n.split(/\s+/).filter(Boolean);
  if(!parts.length) return 'usuario';
  if(parts.length===1) return parts[0].replace(/[^a-z0-9-]/g,'-').replace(/-+/g,'-');
  if(parts.length===2) return `${parts[0]}-${parts[1][0]}`;
  return `${parts[0]}-${parts.slice(1).map(p=>p[0]).join('-')}`;
}
async function criarContaAutomatica(conta){
  const pastaMae=normalizePastaMae(conta.nomeCompleto);
  const fileName=pastaMae+'.json';
  // tentativa Node automatico
  try{
    const res=await fetch('/api/criar-conta',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(conta)});
    const text=await res.text();
    let data;
    try{ data=JSON.parse(text); }catch(e){ if(text.trim().startsWith('<')) throw new Error('PAGES_MODE'); throw e; }
    if(!res.ok) throw new Error(data.error||'erro api');
    return { ok:true, pastaMae, fileName, modo:'NODE GH_TOKEN interno', data };
  }catch(err){
    if(err.message==='PAGES_MODE'){
      // fallback Pages Mode sem token manual - salva local e tenta dispatch
      console.warn('PAGES_MODE detectado, fallback automatico');
      const payload={...conta,pastaMae,fileName,criadoEm:new Date().toISOString(),origem:'Pages Mode fallback automatico'};
      try{
        localStorage.setItem('korvil_user', JSON.stringify(payload));
        localStorage.setItem('korvil_primeiro_uso_feito','1');
        // tenta chamar dispatch que usa GH_TOKEN interno do workflow
        await fetch('/api/github-dispatch',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)}).catch(()=>{});
      }catch{}
      // salva tambem em memoria local de contas
      try{
        const key='korvil_contas_'+pastaMae;
        localStorage.setItem(key, JSON.stringify(payload));
      }catch{}
      return { ok:true, pastaMae, fileName, modo:'PAGES_MODE fallback automatico sem token manual', data:payload };
    }
    throw err;
  }
}
if(typeof window!=='undefined'){ window.KorvilCriarConta={ normalizePastaMae, criarContaAutomatica }; }
