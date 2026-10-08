// korvil/sok/k-ai/groq/index.js - MASTER INDEX que É o GitHub clone UI
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = process.env.PORT || 3000;
const REPO = 'sistemak/korvil-app';

const HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>sistemak/korvil-app - GitHub clone by K-AI</title>
<style>
:root{ --gh-header:#24292f; }
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;background:#fff;color:#24292f;padding-bottom:60px}
.gh-header{background:#24292f;height:62px;display:flex;align-items:center;padding:0 16px;gap:16px}
.gh-header .logo{color:white;font-weight:700}
.gh-header input{background:#010409;border:1px solid #30363d;color:#e6edf3;padding:6px 12px;border-radius:6px;width:300px}
.gh-repo{display:flex;align-items:center;gap:8px;padding:16px;background:#f6f8fa;border-bottom:1px solid #d0d7de}
.gh-repo h1{font-size:20px;font-weight:600}
.gh-badge{border:1px solid #d0d7de;border-radius:2em;padding:0 7px;font-size:12px;color:#57606a}
.gh-tabs{display:flex;gap:16px;padding:0 16px;border-bottom:1px solid #d0d7de;background:#f6f8fa}
.gh-tab{padding:8px 4px;font-size:14px;border-bottom:2px solid transparent;cursor:pointer}
.gh-tab.active{border-color:#fd8c73;font-weight:600}
.gh-main{max-width:1280px;margin:0 auto;padding:16px;display:grid;grid-template-columns:1fr 320px;gap:16px}
@media(max-width:900px){ .gh-main{grid-template-columns:1fr} }
.gh-filelist{border:1px solid #d0d7de;border-radius:6px}
.gh-filelist header{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#f6f8fa;border-bottom:1px solid #d0d7de}
.gh-row{display:flex;align-items:center;gap:10px;padding:8px 16px;border-top:1px solid #d0d7de;font-size:14px}
.gh-row:hover{background:#f6f8fa}
.btn-green{background:#2da44e;color:white;border:1px solid rgba(27,31,36,.15);padding:5px 16px;border-radius:6px;font-weight:600;cursor:pointer}
#kaiBox{position:fixed;bottom:0;left:0;right:0;height:56px;background:#010409;border-top:1px solid #21262d;display:flex;align-items:center;gap:8px;padding:0 12px;z-index:9999}
#kaiBox input{flex:1;background:#0d1117;border:1px solid #30363d;border-radius:6px;color:#e6edf3;padding:8px 12px}
#kaiBox button{background:#238636;color:white;border:1px solid rgba(240,246,252,.1);padding:6px 16px;border-radius:6px;font-weight:600;cursor:pointer}
</style>
</head><body>
<div class="gh-header"><div class="logo">GitHub</div><input value="sistemak/korvil-app" readonly/><div style="margin-left:auto;color:#e6edf3">K-AI • GROQ</div></div>
<div class="gh-repo"><svg width="16" height="16" viewBox="0 0 16 16" fill="#57606a"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 0 0 1.5h2.5A2.5 2.5 0 0 0 16 13V1.75A2.5 2.5 0 0 0 13.5 0H4.5A3.5 3.5 0 0 0 1 3.5v9.25a.75.75 0 0 0 0 1.5V2.5z"/></svg><h1>sistemak / korvil-app</h1><span class="gh-badge">Public</span><div style="margin-left:auto;display:flex;gap:8px"><button class="btn-green">Code <span style="font-size:12px">▼</span></button></div></div>
<div class="gh-tabs"><div class="gh-tab active">Code</div><div class="gh-tab">Issues</div><div class="gh-tab">Pull requests</div><div class="gh-tab">Actions</div></div>
<div class="gh-main">
  <div class="gh-filelist"><header><strong>korvil/sok/k-ai/groq/</strong><span style="font-size:12px;color:#57606a">groq master</span></header>
    <div id="list"></div>
  </div>
  <div style="border:1px solid #d0d7de;border-radius:6px;padding:16px"><h3 style="font-size:14px;margin-bottom:8px">Sobre K-AI</h3><p style="font-size:13px;color:#57606a">Index clonado. Chat GROQ fixo no rodapé. Arquivos reais em korvil/sok/k-ai/groq/. Token via GH_TOKEN.</p><pre id="status" style="margin-top:12px;background:#0d1117;color:#7ee787;padding:8px;border-radius:6px;font-size:11px;overflow:auto;max-height:160px">ready</pre></div>
</div>
<div id="kaiBox"><span style="color:#7d8590;font:12px monospace">k-ai</span><input id="kaiInput" placeholder="Digite: k-ai cria api/cadastro.js..."/><button id="kaiSend">Enviar</button></div>
<script type="module">
import { MODEL } from './config.js';
const listEl=document.getElementById('list');
const statusEl=document.getElementById('status');
async function loadList(){
  try{
    const token = localStorage.getItem('GH_TOKEN')||'';
    const headers = token?{Authorization:'token '+token}:{};
    const res = await fetch('https://api.github.com/repos/sistemak/korvil-app/contents/korvil/sok/k-ai/groq',{headers});
    if(!res.ok){ statusEl.textContent='Erro list: '+res.status; return; }
    const files = await res.json();
    listEl.innerHTML = files.map(f=>'<div class=gh-row><span>'+(f.type==='dir'?'📁':'📄')+'</span><a href=https://github.com/sistemak/korvil-app/blob/main/'+f.path+' target=_blank style=text-decoration:none;color:#0969da>'+f.name+'</a><span style=margin-left:auto;color:#57606a;font-size:12px>'+f.type+'</span></div>').join('');
    statusEl.textContent='Model '+MODEL+' | '+files.length+' arquivos carregados via API';
  }catch(e){ statusEl.textContent='Erro: '+e.message; }
}
loadList();
document.getElementById('kaiSend').onclick=()=>{
  const v=document.getElementById('kaiInput').value.trim();
  if(!v) return;
  const ev=new CustomEvent('k-ai:prompt',{detail:v});
  window.dispatchEvent(ev);
  statusEl.textContent+='\n> '+v;
  document.getElementById('kaiInput').value='';
  if(window.kaiHandle) window.kaiHandle(v);
};
window.addEventListener('k-ai:prompt',e=>{ console.log('[k-ai]',e.detail); });
</script>
<script src="./chat.js"></script>
</body></html>`;

const server = http.createServer((req,res)=>{
  if(req.url.includes('config.js') || req.url.includes('chat.js')){
    const fp = path.join(__dirname, path.basename(req.url));
    if(fs.existsSync(fp)){ res.writeHead(200,{'Content-Type':'application/javascript'}); return res.end(fs.readFileSync(fp)); }
  }
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
  res.end(HTML);
});
server.listen(PORT,()=>console.log('K-AI GitHub clone listening on '+PORT+' - http://localhost:'+PORT));

// Vercel / serverless handler compat
export default function handler(req,res){ res.setHeader('Content-Type','text/html'); res.end(HTML); }
