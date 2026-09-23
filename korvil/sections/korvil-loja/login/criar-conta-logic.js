// só cria quando clicar, valida, usa Node se disponível senão GitHub API
// Export para uso no index.html ou server
function validar(d){
  if(!d.nome||d.nome.length<2) throw new Error('Nome inválido');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) throw new Error('Email inválido');
  if(!d.senha||d.senha.length<6) throw new Error('Senha min 6');
  return true;
}
function pastaMaeFromNome(nome){
  return nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,24)||'usuario';
}
async function criarContaDual(dados, opts={}){
  validar(dados);
  const pastaMae=pastaMaeFromNome(dados.nome);
  const arquivo=pastaMae+'.json';
  const conta={...dados,pastaMae,arquivo,id:pastaMae+'_'+Date.now(),sistema:'KORVIL'};
  const isGithubPages = typeof location!=='undefined' && location.hostname.includes('github.io');
  // tenta Node
  try{
    if(typeof fetch!=='undefined'){
      const res=await fetch('/api/criar-conta',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(dados)});
      const text=await res.text();
      let data; try{data=JSON.parse(text);}catch{ if(text.trim().startsWith('<')||text.includes('<!DOCTYPE')) throw new Error('PAGES_MODE'); throw new Error('Resposta inválida'); }
      if(!res.ok) throw new Error(data.error||'Erro');
      return {mode:'node', conta:data.conta||conta};
    }
  }catch(err){
    if(err.message==='PAGES_MODE' || isGithubPages || opts.forceGithub){
      // GitHub API fallback
      const token=opts.token || (typeof window!=='undefined'?(window.__KORVIL_GH_TOKEN__||localStorage.getItem('loja_github_token')||''):'');
      if(!token) return {mode:'pages_local', conta};
      const contentBase64=typeof Buffer!=='undefined'?Buffer.from(JSON.stringify(conta,null,2)).toString('base64'):btoa(unescape(encodeURIComponent(JSON.stringify(conta,null,2))));
      const filePath='korvil/sections/korvil-loja/login/contas/'+pastaMae+'/'+arquivo;
      const apiUrl='https://api.github.com/repos/sistemak/korvil-app/contents/'+filePath;
      let sha; try{ const getRes=await fetch(apiUrl,{headers:{Authorization:'token '+token}}); if(getRes.ok){ const j=await getRes.json(); sha=j.sha; } }catch{}
      const putRes=await fetch(apiUrl,{method:'PUT',headers:{Authorization:'token '+token,'Content-Type':'application/json'},body:JSON.stringify({message:'KORVIL conta '+pastaMae+' '+dados.email,content:contentBase64,branch:'main',...(sha?{sha}:{})})});
      if(!putRes.ok) throw new Error('GitHub API fail '+putRes.status);
      return {mode:'github_api', conta};
    }
    throw err;
  }
  return {mode:'node', conta};
}
if(typeof module!=='undefined') module.exports={validar,pastaMaeFromNome,criarContaDual};
