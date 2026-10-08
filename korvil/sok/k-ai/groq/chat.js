// korvil/sok/k-ai/groq/chat.js - injects Meta IA style bar on any page
(function(){
  if(document.getElementById('kaiBottomBar')) return;
  const barCss = `
  #kaiBottomBar{position:fixed;bottom:0;left:0;right:0;height:62px;background:#010409;border-top:1px solid #30363d;display:flex;align-items:center;padding:0 14px;gap:10px;z-index:9999}
  #kaiBottomBar input{flex:1;background:#0d1117;border:1px solid #30363d;border-radius:6px;padding:11px 14px;color:#c9d1d9;outline:none;font-family:ui-monospace,monospace}
  #kaiBottomBar input:focus{border-color:#1f6feb}
  #kaiChat{position:fixed;bottom:72px;right:16px;width:360px;max-height:50vh;background:#0d1117;border:1px solid #30363d;border-radius:8px;display:flex;flex-direction:column;z-index:9999;overflow:hidden}
  #kaiChatHead{padding:10px 12px;border-bottom:1px solid #21262d;font-weight:600;font-size:13px;display:flex;justify-content:space-between}
  #kaiChatBody{flex:1;padding:10px;display:flex;flex-direction:column;gap:8px;overflow:auto;max-height:40vh}
  .kai-bubble{padding:8px 10px;border-radius:10px;font-size:13px;max-width:85%;word-break:break-word}
  .kai-bubble.user{align-self:flex-end;background:#1f6feb;color:#fff}
  .kai-bubble.ai{align-self:flex-start;background:#161b22;border:1px solid #30363d;color:#c9d1d9}
  `;
  const style=document.createElement('style'); style.textContent=barCss; document.head.appendChild(style);

  const chatWrap=document.createElement('div'); chatWrap.id='kaiChat';
  chatWrap.innerHTML='<div id="kaiChatHead"><span>k-ai groq</span><span style="color:#8b949e;font-size:11px">GROQ nos Secrets</span></div><div id="kaiChatBody"><div class="kai-bubble ai">k-ai pronto. Digite abaixo.</div></div>';
  document.body.appendChild(chatWrap);

  const bar=document.createElement('div'); bar.id='kaiBottomBar';
  bar.innerHTML='<span style="color:#3fb950;font-weight:700">k-ai&gt;</span><input id="kaiInputGlobal" placeholder="k-ai> digite prompt e Enter - ex: crie dashboard.tsx (igual Meta IA)"/><span style="color:#8b949e;font-size:11px">⏎</span>';
  document.body.appendChild(bar);

  const input=document.getElementById('kaiInputGlobal');
  const body=document.getElementById('kaiChatBody');
  function add(t,w){ const d=document.createElement('div'); d.className='kai-bubble '+w; d.textContent=t; body.appendChild(d); body.scrollTop=body.scrollHeight; return d; }
  function getToken(){ return localStorage.getItem('GH_TOKEN')||''; }

  input.addEventListener('keydown', async (e)=>{
    if(e.key!=='Enter') return;
    const prompt=input.value.trim(); if(!prompt) return;
    add(prompt,'user'); input.value='';
    const token=getToken();
    if(!token){ add('⚠️ Sem GH_TOKEN. Rode instalador master.','ai'); return; }
    const run=add('🚀 K-AI executando via GitHub Actions... (usando GROQ_API_KEY dos Secrets) - em 30s o arquivo aparece aqui','ai');
    try{
      const res=await fetch('https://api.github.com/repos/sistemak/korvil-app/issues',{method:'POST',headers:{'Authorization':'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({title:'k-ai: '+prompt.slice(0,80),body:prompt+'\n\n<!-- k-ai auto -->',labels:['k-ai']})});
      let data=await res.json();
      if(!res.ok && (res.status===422||res.status===404)){
        const r2=await fetch('https://api.github.com/repos/sistemak/korvil-app/issues',{method:'POST',headers:{'Authorization':'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({title:'k-ai: '+prompt.slice(0,80),body:prompt})});
        data=await r2.json();
        if(!r2.ok) throw new Error(JSON.stringify(data).slice(0,400));
      } else if(!res.ok){ throw new Error(JSON.stringify(data).slice(0,400)); }
      run.textContent='✅ Issue #'+data.number+' criada! '+data.html_url;
    }catch(err){ run.textContent='❌ '+err.message; }
  });
})();
