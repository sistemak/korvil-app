(function(){
  function mountKaiChat(){
    if(document.getElementById('kai-root-bar')) return;
    var bar=document.createElement('div');
    bar.id='kai-root-bar';
    bar.style.cssText='position:fixed;bottom:0;left:0;right:0;height:56px;background:#010409;border-top:1px solid #30363d;display:flex;align-items:center;padding:0 16px;z-index:99999;font-family:ui-monospace,monospace';
    bar.innerHTML='<div style="width:8px;height:8px;background:#3fb950;border-radius:50%;margin-right:10px;box-shadow:0 0 8px #3fb950"></div><span style="color:#3fb950;margin-right:12px;font-weight:600">k-ai ></span><input id="kaiInputGlobal" placeholder="Prompt K-AI • Enter para gerar arquivo" style="flex:1;background:transparent;border:none;color:#e6edf3;outline:none;font-size:14px"><span style="color:#484f58;font-size:11px;margin-left:12px">GROQ llama-3.3</span>';
    document.body.appendChild(bar);
    document.body.style.paddingBottom='56px';
    var input=bar.querySelector('input');
    input.addEventListener('keydown', function(e){
      if(e.key==='Enter'){
        var prompt=e.target.value.trim();
        if(!prompt) return;
        input.placeholder='Gerando...';
        input.disabled=true;
        try{
          if(window.KAI_GROQ_GENERATE){
            window.KAI_GROQ_GENERATE(prompt);
          }else{
            var ev=new CustomEvent('kai-prompt',{detail:{prompt:prompt}});
            window.dispatchEvent(ev);
            var log=document.createElement('div');
            log.textContent='> '+prompt;
            log.style.cssText='position:fixed;bottom:64px;right:16px;background:#010409;border:1px solid #30363d;color:#3fb950;padding:8px 12px;border-radius:6px;font-size:12px;max-width:320px';
            document.body.appendChild(log);
            setTimeout(function(){log.remove();},3000);
          }
        }catch(err){ console.error(err); }
        input.value='';
        input.disabled=false;
        input.placeholder='Prompt K-AI • Enter para gerar arquivo';
        input.focus();
      }
    });
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',mountKaiChat);}else{mountKaiChat();}
  var obs=new MutationObserver(function(){mountKaiChat();});
  obs.observe(document.body,{childList:true,subtree:false});
  window.mountKaiChat=mountKaiChat;
})();
