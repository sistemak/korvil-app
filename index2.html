<!DOCTYPE html>
<html lang="pt-br">
<head><style>
@font-face {
  font-family: "Optimistic";
  font-style: normal;
  font-weight: 400 600;
  font-display: swap;
  src: url("/fonts/OptimisticAI_VF_Optimized.woff2") format("woff2");
}
@font-face {
  font-family: "Optimistic Mono";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/OptimisticMono_W_TextRegular.woff2") format("woff2");
}
:where(html) {
  font-family: "Optimistic", system-ui, sans-serif;
}
:where(code, pre, kbd, samp) {
  font-family: "Optimistic Mono", ui-monospace, monospace;
}
</style>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KORVIL V8 LIVE SYNC - SELECT ALL + GITHUB EXPLORER</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<style>
:root{--accent:#00ffea;--bg:#070a12;--card:#101420}
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:#fff;font-family:Consolas,monospace;height:100vh;overflow:hidden}
#app{display:flex;height:100vh}
#left{flex:1.2;border-right:2px solid var(--accent);display:flex;flex-direction:column;background:var(--bg)}
#right{flex:0.8;min-width:500px;background:#05070f;display:flex;flex-direction:column}
.top{height:54px;display:flex;align-items:center;gap:6px;padding:0 10px;background:var(--card);border-bottom:1px solid #222;flex-wrap:wrap}
.btn{border:1px solid #444;background:#000;color:#fff;padding:6px 10px;border-radius:15px;cursor:pointer;font-size:10px;transition:.2s;display:inline-flex;align-items:center;gap:4px}
.btn.ac{border-color:var(--accent);color:var(--accent)}.btn.ac:hover{background:var(--accent);color:#000}
.btn.neon{background:var(--accent);color:#000;font-weight:bold;box-shadow:0 0 15px var(--accent);padding:8px 14px;border-radius:8px}
.btn.danger{border-color:#ff2d7a;color:#ff2d7a}.btn.danger:hover{background:#ff2d7a;color:#fff}
.stage{flex:1;overflow:auto;padding:10px;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;align-content:start}
.item{background:var(--card);border:2px solid #222;border-radius:10px;overflow:hidden;cursor:pointer;position:relative}
.item.selected{border-color:var(--accent);box-shadow:0 0 12px var(--accent)}
.item.selected::after{content:'✓';position:absolute;top:4px;right:4px;background:var(--accent);color:#000;font-size:8px;padding:2px 5px;border-radius:10px;font-weight:bold}
.item img,.item video{width:100%;height:90px;object-fit:cover;display:block;pointer-events:none}
#repoView{flex:1;overflow:auto;background:#0a0c18;display:flex;flex-direction:column}
.repo-breadcrumb{padding:8px 10px;background:#000;border-bottom:1px solid #1a1f35;display:flex;gap:6px;flex-wrap:wrap;align-items:center;font-size:10px}
.repo-breadcrumb span{cursor:pointer;color:var(--accent);padding:2px 6px;border-radius:6px;background:#0f1426}
.repo-breadcrumb span:hover{background:var(--accent);color:#000}
.repo-breadcrumb .sep{opacity:.3;cursor:default;background:transparent;color:#fff}
.repo-list{flex:1;overflow:auto}
.repo-folder, .repo-file-github{padding:9px 10px;background:#111320;border-bottom:1px solid #1a1d2e;display:flex;justify-content:space-between;align-items:center;font-size:10px;cursor:pointer}
.repo-folder:hover, .repo-file-github:hover{background:#151a2f;border-color:var(--accent)}
.repo-folder{font-weight:bold;color:#8ecbff}
.repo-file-github{color:#c9d1d9}
.repo-actions{display:flex;gap:4px;flex-shrink:0}
.drop-active{outline:3px dashed var(--accent)!important;background:rgba(0,255,234,0.1)!important}
#template-layer{position:fixed;inset:0;z-index:-1;pointer-events:none;opacity:.3}
input.in{background:#000;border:1px solid #333;color:#fff;padding:6px 8px;border-radius:8px;font-size:10px}
#log{height:90px;background:#000;border-top:1px solid var(--accent);overflow:auto;padding:6px;font-size:8px;color:var(--accent);white-space:pre-wrap}
</style>
</head>
<body>
<div id="template-layer"></div>
<div id="app">
  <div id="left">
    <div class="top">
      <b style="font-size:10px">ESQ: LOCAL</b>
      <button class="btn ac" onclick="document.getElementById('f').click()">+ ANEXAR</button>
      <button class="btn" onclick="document.getElementById('folder').click()">📁</button>
      <button class="btn ac" onclick="selecionarTodos()" title="Selecionar todos da esquerda">☑ TODOS</button>
      <span id="selCount" style="font-size:9px;background:#000;padding:3px 8px;border-radius:10px;border:1px solid var(--accent);color:var(--accent)">0 sel</span>
      <button class="btn danger" onclick="limparSel()" title="Lixeira - apaga só da esquerda">🗑️</button>
      <button class="btn" onclick="limparSel()" style="border-color:#555">LIMPAR</button>
      <button class="btn ac" onclick="implantLast()">IMPLANTAR</button>
    </div>
    <div style="padding:6px;background:#0a0e1a;font-size:8px;text-align:center;border-bottom:1px solid #111">☑ TODOS = seleciona tudo • 🗑️ / LIMPAR = apaga só ESQUERDA • Direita só apaga na 🗑️ de lá</div>
    <div class="stage" id="sLeft"></div>
  </div>
  <div id="right">
    <div style="padding:10px;background:#000;border-bottom:2px solid var(--accent);display:flex;flex-direction:column;gap:6px">
      <button class="btn neon" onclick="abrirRepo()">▶ INICIAR K-AI OS v2026.42</button>
      <div style="display:flex;gap:4px">
        <input id="ghO" class="in" value="korvilp-sudo" style="width:70px"><input id="ghR" class="in" value="korvil-app" style="width:70px"><input id="ghT" type="password" class="in" placeholder="ghp_..." style="flex:1">
        <button class="btn ac" onclick="saveCfg()">SALVAR</button>
      </div>
      <button class="btn ac" style="width:100%" onclick="baixarZipCompleto()">📦 BAIXAR ZIP COMPLETO</button>
    </div>
    <div id="repoView">
      <div class="repo-breadcrumb" id="breadcrumb"><span onclick="navegarPara('')">🏠 root</span></div>
      <div class="repo-list" id="repoList"><div style="padding:30px;text-align:center;opacity:.4;font-size:10px">Cole token e clique INICIAR<br>Vai mostrar igual GitHub com pastas</div></div>
    </div>
    <div id="log">[LOG] Pronto...</div>
  </div>
</div>
<input type="file" id="f" hidden multiple><input type="file" id="folder" hidden webkitdirectory multiple>
<script>
let db, ativos=[], repoCache=[], selecionados=new Set();
let currentPath = ""; // path atual na direita
let cfg={};
try{cfg=JSON.parse(localStorage.getItem('korvil-v8-cfg')||'{"owner":"korvilp-sudo","repo":"korvil-app"}');}catch(e){cfg={}}
if(!cfg.owner) cfg.owner='korvilp-sudo';
if(!cfg.repo) cfg.repo='korvil-app';
ghO.value=cfg.owner; ghR.value=cfg.repo; ghT.value=cfg.token||'';

const openDB=indexedDB.open('korvil-v8',3);
openDB.onupgradeneeded=e=>{const d=e.target.result; if(!d.objectStoreNames.contains('k')) d.createObjectStore('k',{keyPath:'id'});};
openDB.onsuccess=e=>{db=e.target.result; carregarTudo();};
function save(o){return new Promise((res,rej)=>{const tx=db.transaction('k','readwrite'); tx.objectStore('k').put(o); tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error);});}
function getAll(){return new Promise((res,rej)=>{const tx=db.transaction('k','readonly'); const q=tx.objectStore('k').getAll(); q.onsuccess=()=>res(q.result||[]); q.onerror=()=>rej(q.error);});}
function delDB(id){return new Promise((res,rej)=>{const tx=db.transaction('k','readwrite'); tx.objectStore('k').delete(id); tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error);});}
function log(m){const el=document.getElementById('log'); el.innerText=`[${new Date().toLocaleTimeString()}] ${m}\n`+el.innerText.slice(0,4000);}

const fEl=document.getElementById('f'), folderEl=document.getElementById('folder');
fEl.onchange=e=>{if(e.target.files.length) handle(e.target.files); e.target.value='';};
folderEl.onchange=e=>{if(e.target.files.length) handle(e.target.files); e.target.value='';};
async function handle(files){
 for(let file of files){
  const cat=file.type.startsWith('image')?'image':file.type.startsWith('video')?'video':'code';
  await save({id:Date.now()+'_'+Math.random().toString(16).slice(2),name:file.name,path:file.webkitRelativePath||file.name,type:file.type,size:file.size,cat,date:new Date().toISOString(),blob:file});
 }
 await carregarTudo(); log(`Anexou ${files.length} na ESQUERDA`);
}
async function carregarTudo(){
 ativos=await getAll();
 try{const last=JSON.parse(localStorage.getItem('korvil-v8-last')||'{}'); if(last.template) document.getElementById('template-layer').innerHTML=last.template;}catch(e){}
 renderLeft();
}
function renderLeft(){
 const sL=document.getElementById('sLeft'); const selEl=document.getElementById('selCount');
 sL.innerHTML=''; selEl.innerText=selecionados.size+' sel';
 if(ativos.length===0){ sL.innerHTML='<div style="grid-column:1/-1;text-align:center;opacity:.3;padding:50px">Vazio - + ANEXAR</div>'; return; }
 ativos.forEach(o=>{
  const url=URL.createObjectURL(o.blob);
  const div=document.createElement('div'); div.className='item'+(selecionados.has(o.id)?' selected':''); div.draggable=true;
  let thumb=o.cat==='image'?`<img src="${url}">`:o.cat==='video'?`<video src="${url}" muted loop></video>`:`<div style="padding:18px;text-align:center;font-size:9px">${o.name.slice(0,22)}</div>`;
  div.innerHTML=`${thumb}<div style="padding:4px 6px;font-size:8px"><div style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${o.name}</div><div style="opacity:.4">${(o.size/1024).toFixed(0)}kb</div></div>`;
  div.ondragstart=e=>{e.dataTransfer.setData('from','left'); e.dataTransfer.setData('id',o.id);};
  div.onclick=()=>{ if(selecionados.has(o.id)) selecionados.delete(o.id); else selecionados.add(o.id); renderLeft(); };
  div.ondblclick=()=>implant(o.id);
  sL.appendChild(div);
 });
}

// ==== BOTÕES NOVOS DA ESQUERDA ====
function selecionarTodos(){
  if(ativos.length===0){ log('Nada na esquerda pra selecionar'); return; }
  if(selecionados.size===ativos.length){
    selecionados.clear();
    log('Desmarcou todos da ESQUERDA');
  } else {
    ativos.forEach(a=>selecionados.add(a.id));
    log(`Selecionou todos: ${selecionados.size} da ESQUERDA`);
  }
  renderLeft();
}
async function limparSel(){
  if(selecionados.size===0){ log('Nenhum selecionado na ESQUERDA - clique nos cards ou use ☑ TODOS'); return; }
  if(!confirm(`Apagar ${selecionados.size} arquivo(s) SÓ da ESQUERDA?\n\nNÃO apaga da DIREITA. Direita só apaga clicando na 🗑️ lá.`)) return;
  const ids=[...selecionados];
  for(let id of ids) await delDB(id);
  const qtd=ids.length;
  selecionados.clear();
  await carregarTudo();
  log(`🗑️ LIMPAR ESQ: ${qtd} removido(s) só da ESQUERDA | DIREITA intacta`);
}
function implant(id){
  const o=ativos.find(a=>a.id===id); if(!o) return;
  const url=URL.createObjectURL(o.blob);
  const lay=document.getElementById('template-layer');
  if(o.cat==='video') lay.innerHTML=`<video src="${url}" autoplay loop muted style="width:100%;height:100%;object-fit:cover"></video>`;
  else if(o.cat==='image') lay.innerHTML=`<img src="${url}" style="width:100%;height:100%;object-fit:cover">`;
  try{ localStorage.setItem('korvil-v8-last', JSON.stringify({template:lay.innerHTML.slice(0,80000)})); }catch(e){}
  log(`Implantou ${o.name}`);
}
function implantLast(){ if(selecionados.size===0){ log('Selecione um arquivo'); return; } const lastId=[...selecionados].pop(); implant(lastId); }
function saveCfg(){ cfg={owner:ghO.value,repo:ghR.value,token:ghT.value}; localStorage.setItem('korvil-v8-cfg',JSON.stringify(cfg)); log('Config salva'); }

// ===== DIREITA = GITHUB EXPLORER IGUAL SITE =====
function navegarPara(path){
  currentPath = path;
  renderRepo();
}
function getTreeForPath(prefix){
  // prefix = "" ou "kai-core/" etc
  const filesInPath = new Map(); // nome -> {isFolder, fullPath, type}
  const pref = prefix ? (prefix.endsWith('/')?prefix:prefix+'/') : '';
  for(let entry of repoCache){
    if(!entry.path.startsWith(pref)) continue;
    const rest = entry.path.slice(pref.length);
    if(!rest) continue;
    const parts = rest.split('/');
    const first = parts[0];
    if(!first) continue;
    const isFolder = parts.length>1 || entry.type==='tree';
    const existing = filesInPath.get(first);
    if(!existing){
      filesInPath.set(first, {name:first, fullPath:pref+first, isFolder:isFolder, isBlob:!isFolder, type:entry.type});
    } else {
      if(isFolder) existing.isFolder=true;
    }
  }
  return Array.from(filesInPath.values()).sort((a,b)=>{
    if(a.isFolder && !b.isFolder) return -1;
    if(!a.isFolder && b.isFolder) return 1;
    return a.name.localeCompare(b.name);
  });
}
async function abrirRepo(){
 const listEl=document.getElementById('repoList'); listEl.innerHTML='<div style="padding:20px;text-align:center">Carregando...</div>';
 if(!cfg.token){ listEl.innerHTML='<div style="padding:20px;color:#ff2d7a">Cole token</div>'; return; }
 try{
  const h={Authorization:`token ${cfg.token}`};
  let r=await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}/git/trees/main?recursive=1`,{headers:h});
  if(!r.ok) r=await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}/git/trees/master?recursive=1`,{headers:h});
  if(!r.ok) throw new Error('Repo não encontrado');
  const data=await r.json(); repoCache=data.tree||[]; currentPath=""; log(`Repo aberto: ${repoCache.length} arquivos`); renderRepo();
 }catch(e){ document.getElementById('repoList').innerHTML=`Erro: ${e.message}`; log('Erro repo: '+e.message); }
}
function renderRepo(){
 const breadcrumb=document.getElementById('breadcrumb');
 const listEl=document.getElementById('repoList');
 // breadcrumb
 const parts = currentPath ? currentPath.split('/').filter(Boolean) : [];
 let htmlCrumb = `<span onclick="navegarPara('')">🏠 root</span>`;
 let acc="";
 parts.forEach((p,i)=>{
   acc += (acc?"/":"")+p;
   htmlCrumb += `<span class="sep">/</span><span onclick="navegarPara('${acc}')">${p}</span>`;
 });
 breadcrumb.innerHTML = htmlCrumb + `<span style="margin-left:auto;opacity:.4;font-size:8px">${repoCache.length} arquivos</span>`;

 const items = getTreeForPath(currentPath);
 if(items.length===0){ listEl.innerHTML='<div style="padding:20px;opacity:.4">Pasta vazia</div>'; return; }
 listEl.innerHTML="";
 // botão voltar
 if(currentPath){
   const up = currentPath.split('/').slice(0,-1).join('/');
   const divUp=document.createElement('div'); divUp.className='repo-folder'; divUp.innerHTML=`<span>📁 .. (voltar)</span><span style="opacity:.4">↑</span>`;
   divUp.onclick=()=>navegarPara(up);
   listEl.appendChild(divUp);
 }
 items.forEach(item=>{
   const row=document.createElement('div');
   row.className = item.isFolder ? 'repo-folder' : 'repo-file-github';
   row.draggable = !item.isFolder;
   if(item.isFolder){
     row.innerHTML=`<span>📁 ${item.name}</span><span style="opacity:.4">${getChildCount(item.fullPath)} itens →</span>`;
     row.onclick=()=>navegarPara(item.fullPath);
   } else {
     // arquivo
     row.innerHTML=`<span style="display:flex;align-items:center;gap:6px">📄 ${item.name}</span><div class="repo-actions"><button class="btn" style="padding:2px 6px" onclick="event.stopPropagation(); removerDoRepo('${item.fullPath.replace(/'/g,"\\'")}')" title="Deleta SÓ da DIREITA (repo)">🗑️</button><button class="btn ac" style="padding:2px 6px" onclick="event.stopPropagation(); puxarArquivo('${item.fullPath.replace(/'/g,"\\'")}')">← BAIXAR</button></div>`;
     row.ondragstart=e=>{e.dataTransfer.setData('from','right'); e.dataTransfer.setData('path',item.fullPath); row.classList.add('dragging');};
     row.ondragend=()=>row.classList.remove('dragging');
     row.onclick=()=>{ /* opcional: preview */ log(`Arquivo: ${item.fullPath}`); };
   }
   listEl.appendChild(row);
 });
}
function getChildCount(folderPath){
  const pref = folderPath + '/';
  let c=0; for(let e of repoCache){ if(e.path.startsWith(pref)){ const rest=e.path.slice(pref.length); if(rest && !rest.includes('/')) c++; else if(rest) c++; } if(c>50) break; } return c;
}

// drag drop
const sLeft=document.getElementById('sLeft'), repoView=document.getElementById('repoView');
[sLeft, repoView].forEach(el=>{
 el.addEventListener('dragover',e=>{e.preventDefault(); el.classList.add('drop-active');});
 el.addEventListener('dragleave',()=>el.classList.remove('drop-active'));
 el.addEventListener('drop',async e=>{
  e.preventDefault(); el.classList.remove('drop-active');
  const from=e.dataTransfer.getData('from');
  if(el.id==='sLeft' && from==='right'){ const p=e.dataTransfer.getData('path'); if(p) await puxarArquivo(p); }
  if(el.id==='repoView' && from==='left'){ const id=e.dataTransfer.getData('id'); const obj=ativos.find(a=>a.id===id); if(obj){ await pushReal(obj); log(`PUSH: ${obj.path}`); await abrirRepo(); } }
  if(e.dataTransfer.files?.length && el.id==='sLeft'){ await handle(e.dataTransfer.files); }
 });
});
async function pushReal(obj){
 // respeita pasta atual da direita ao fazer push
 let targetPath = obj.path;
 if(currentPath){
   const fileName = obj.path.split('/').pop();
   targetPath = currentPath + '/' + fileName;
 }
 if(!cfg.token) return alert('Sem token');
 const b64=await new Promise(r=>{const fr=new FileReader(); fr.onload=()=>r(fr.result.split(',')[1]); fr.readAsDataURL(obj.blob);});
 let sha=null; try{const chk=await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(targetPath)}`,{headers:{Authorization:`token ${cfg.token}`}}); if(chk.ok) sha=(await chk.json()).sha;}catch(e){}
 const res=await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(targetPath)}`,{method:'PUT',headers:{Authorization:`token ${cfg.token}`,'Content-Type':'application/json'},body:JSON.stringify({message:`LIVE SYNC: ${targetPath}`,content:b64,sha})});
 if(!res.ok){ const t=await res.text(); log('ERRO PUSH: '+t.slice(0,200)); } else log('COMMIT OK: '+targetPath);
}
async function puxarArquivo(path){
 try{
  const r=await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(path)}`,{headers:{Authorization:`token ${cfg.token}`}});
  const d=await r.json(); if(!d.content) throw new Error('sem conteúdo');
  const binary=atob(d.content.replace(/\n/g,'')); const bytes=new Uint8Array(binary.length); for(let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
  const blob=new Blob([bytes]); const obj={id:Date.now()+'_'+Math.random().toString(16).slice(2),name:path.split('/').pop(),path:path,type:'',size:blob.size,cat:'code',ext:path.split('.').pop(),date:new Date().toISOString(),blob:blob};
  await save(obj); await carregarTudo(); log(`PUXOU: ${path} → ESQUERDA`);
 }catch(e){ log('Erro puxar: '+e.message); }
}
async function removerDoRepo(path){
 // SÓ DA DIREITA - regra exigida
 if(!confirm(`Deletar "${path}" SÓ do repositório da DIREITA?\n\nVai fazer commit DELETE no GitHub.\nESQUERDA não será afetada.`)) return;
 try{
  const r=await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(path)}`,{headers:{Authorization:`token ${cfg.token}`}});
  if(!r.ok) throw new Error('Não achou arquivo');
  const d=await r.json();
  const delRes=await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(path)}`,{method:'DELETE',headers:{Authorization:`token ${cfg.token}`,'Content-Type':'application/json'},body:JSON.stringify({message:`DELETE: ${path}`,sha:d.sha})});
  if(delRes.ok){ log(`🗑️ DELETADO DA DIREITA: ${path} | ESQUERDA intacta`); renderRepo(); setTimeout(()=>abrirRepo(),800); } else { const t=await delRes.text(); log('Erro deletar: '+t.slice(0,200)); }
 }catch(e){ log('Erro deletar: '+e.message); }
}
async function baixarZipCompleto(){
 if(!cfg.token){ alert('Precisa token'); return; }
 if(repoCache.length===0) await abrirRepo();
 const zip=new JSZip(); let c=0;
 for(let f of repoCache.filter(x=>x.type==='blob').slice(0,300)){
  try{const r=await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURIComponent(f.path)}`,{headers:{Authorization:`token ${cfg.token}`}}); const d=await r.json(); if(d.content){ const bin=atob(d.content.replace(/\n/g,'')); zip.file(f.path, bin, {binary:true}); c++; }}catch(e){}
 }
 const blob=await zip.generateAsync({type:'blob'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`${cfg.repo}-${Date.now()}.zip`; a.click(); log(`ZIP ${c} arquivos`);
}
</script>
<script>(function(){var loc=location.href.replace(/#.*$/,"");var ATTR_NAMES=["data-product-id","data-productid","data-product_id","product-id","productid","product_id","data-source-entity-id","source-entity-id","source_entity_id","data-product","data-metadata","data-meta"];var DATASET_KEYS=["productId","productid","product_id","sourceEntityId","sourceentityid","source_entity_id","product","metadata","meta"];function readProductId(value){if(typeof value!=="string"||value.length===0)return null;if(/^[0-9]{6,}$/.test(value))return value;var match=value.match(/(?:product(?:_|-)?id|source(?:_|-)?entity(?:_|-)?id)["'=:\s]+([0-9]{6,})/i);return match?match[1]:null}function extractProductId(start){for(var node=start;node&&node!==document.body;node=node.parentElement){for(var i=0;i<ATTR_NAMES.length;i++){var attrValue=node.getAttribute&&node.getAttribute(ATTR_NAMES[i]);var attrProductId=readProductId(attrValue);if(attrProductId)return attrProductId}var dataset=node.dataset||null;if(dataset){for(var j=0;j<DATASET_KEYS.length;j++){var dataValue=dataset[DATASET_KEYS[j]];var dataProductId=readProductId(dataValue);if(dataProductId)return dataProductId}}}return null}function isInlineMediaSlotElement(node){return !!(node&&node.getAttribute&&node.getAttribute("data-clippy-inline-media-slot")!==null)}function findInlineMediaSlot(start){for(var node=start;node&&node!==document.body;node=node.parentElement){if(isInlineMediaSlotElement(node))return node}return null}function readInlineMediaUrl(node){if(!node)return null;return node.getAttribute&&((node.getAttribute("data-clippy-inline-media-url")||node.getAttribute("data-url")||node.getAttribute("data_url")))||node.href||null}function stripHash(url){return String(url).replace(/#.*$/,"")}function urlsMatch(a,b){if(!a||!b)return false;try{return stripHash(new URL(a,loc).href)===stripHash(new URL(b,loc).href)}catch(_){return stripHash(a)===stripHash(b)}}function isFirstPartyReelUrl(value){try{var url=new URL(value,loc);if(url.protocol!=="https:")return false;var host=url.hostname.toLowerCase();var supported=host==="instagram.com"||host.endsWith(".instagram.com")||host==="facebook.com"||host.endsWith(".facebook.com");return supported&&/\/reels?\//i.test(url.pathname)}catch(_){return false}}function isInlineMediaUrlClick(node,href){var slot=findInlineMediaSlot(node);if(!slot)return false;var slotUrl=readInlineMediaUrl(slot);if(slotUrl)return urlsMatch(href,slotUrl);return isFirstPartyReelUrl(href)}function findDataHref(start){for(var node=start;node&&node!==document.body;node=node.parentElement){if(node.getAttribute){var href=node.getAttribute("data-href")||node.getAttribute("data-url");if(href)return{href:href,node:node}}}return null}var nativeOpen=window.open;window.open=function(url){if(parent!==window&&typeof url==="string"&&/^https?:\/\//.test(url)){parent.postMessage({type:"ecto:usercontent-link-click",href:url},"*");return null}return nativeOpen?nativeOpen.apply(window,arguments):null};document.addEventListener("click",function(e){var target=e.target instanceof Element?e.target:null;if(!target)return;if(parent===window)return;var a=target.closest?target.closest("a[href]"):null;if(a&&a.href&&/^https?:\/\//.test(a.href)&&a.href.replace(/#.*$/,"")!==loc){if(isInlineMediaUrlClick(a,a.href))return;var productId=extractProductId(target)||extractProductId(a);if(productId){e.preventDefault();parent.postMessage({type:"ecto-artifact-link-click",productId:productId},"*");return}e.preventDefault();parent.postMessage({type:"ecto:usercontent-link-click",href:a.href},"*");return}var dataHref=findDataHref(target);if(dataHref&&/^https?:\/\//.test(dataHref.href)&&dataHref.href.replace(/#.*$/,"")!==loc){if(isInlineMediaUrlClick(dataHref.node,dataHref.href))return;e.preventDefault();parent.postMessage({type:"ecto:usercontent-link-click",href:dataHref.href},"*")}},true)})();</script><script>(function(){var FOCUS_TYPE="ecto:artifact-focus-request";var CLOSE_TYPE="ecto:artifact-close-request";function focusArtifactDocument(){var body=document.body;if(!body)return;try{window.focus();}catch(e){}if(!body.hasAttribute("tabindex"))body.setAttribute("tabindex","-1");try{body.focus({preventScroll:true});}catch(e){try{body.focus();}catch(e2){}}}window.addEventListener("message",function(event){if(event.source!==window.parent)return;var data=event.data;if(!data||typeof data!=="object"||data.type!==FOCUS_TYPE)return;if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",focusArtifactDocument,{once:true});return;}focusArtifactDocument();});window.addEventListener("keydown",function(event){if(event.key!=="Escape")return;window.setTimeout(function(){if(event.defaultPrevented)return;window.parent.postMessage({type:CLOSE_TYPE},"*");},0);});})();</script></body>
</html>
