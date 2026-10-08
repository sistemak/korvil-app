// korvil/sok/k-ai/groq/chat.js - injeta caixa fixa k-ai em qualquer página
(function(){
  const BOX_ID='kaiBox';
  function mountKai(){
    if(document.getElementById(BOX_ID)) return;
    const box = document.createElement('div');
    box.id = BOX_ID;
    box.style.cssText = 'position:fixed;bottom:0;left:0;right:0;height:56px;background:#010409;border-top:1px solid #21262d;display:flex;align-items:center;gap:8px;padding:0 12px;z-index:99999;';
    box.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;width:100%;max-width:1280px;margin:0 auto;">
        <span style="color:#7d8590;font:12px monospace;">k-ai</span>
        <input id="kaiInput" placeholder="Digite: k-ai cria api/cadastro.js..." style="flex:1;background:#0d1117;border:1px solid #30363d;border-radius:6px;color:#e6edf3;padding:8px 12px;font:13px sans-serif;outline:none;" />
        <button id="kaiSend" style="background:#238636;color:white;border:1px solid rgba(240,246,252,0.1);padding:6px 16px;border-radius:6px;font:14px sans-serif;font-weight:600;cursor:pointer;">Enviar</button>
      </div>`;
    document.body.appendChild(box);
    const input = box.querySelector('#kaiInput');
    const btn = box.querySelector('#kaiSend');
    async function send(){
      const prompt = (input.value||'').trim();
      if(!prompt) return;
      const ev = new CustomEvent('k-ai:prompt',{detail:prompt});
      window.dispatchEvent(ev);
      console.log('[k-ai] prompt:',prompt);
      input.value='';
      if(prompt.startsWith('k-ai ')){
        // tenta chamar agent via fetch se GROQ key presente
        try{
          const res = await fetch('/api/k-ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt})});
          console.log('[k-ai] api response',res.status);
        }catch(e){ console.warn('[k-ai] offline',e); }
      }
    }
    btn.addEventListener('click',send);
    input.addEventListener('keydown',e=>{ if(e.key==='Enter') send(); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mountKai);
  else mountKai();
  const obs = new MutationObserver(()=>{ mountKai(); });
  obs.observe(document.documentElement,{childList:true,subtree:true});
  window.mountKai = mountKai;
})();