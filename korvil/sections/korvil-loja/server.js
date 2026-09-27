require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const GH_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_PAT || '';
const REPO = 'sistemak/korvil-app';
const BRANCH = 'main';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

function normalizePastaMae(nome){
  const n = (nome||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const parts = n.split(/\s+/).filter(Boolean);
  if(!parts.length) return 'usuario';
  if(parts.length===1) return parts[0].replace(/[^a-z0-9-]/g,'-').replace(/-+/g,'-');
  if(parts.length===2) return `${parts[0]}-${parts[1][0]}`;
  return `${parts[0]}-${parts.slice(1).map(p=>p[0]).join('-')}`;
}

async function githubPutFile(filePath, content){
  if(!GH_TOKEN) return null;
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${filePath.split('/').map(encodeURIComponent).join('/')}`;
  let sha;
  try{ const r = await fetch(apiUrl, { headers:{ Authorization: `Bearer ${GH_TOKEN}`, Accept:'application/vnd.github+json' } }); if(r.ok){ const j=await r.json(); sha=j.sha; } }catch{}
  const body = { message: `feat(contas): ${filePath} via GH_TOKEN interno automatico`, content: Buffer.from(content,'utf8').toString('base64'), branch: BRANCH, ...(sha?{sha}:{}) };
  const put = await fetch(apiUrl, { method:'PUT', headers:{ Authorization: `Bearer ${GH_TOKEN}`, 'Content-Type':'application/json', Accept:'application/vnd.github+json' }, body: JSON.stringify(body) });
  if(!put.ok) throw new Error(await put.text());
  return put.json();
}

app.post('/api/criar-conta', async (req,res)=>{
  try{
    const conta = req.body;
    const pastaMae = normalizePastaMae(conta.nomeCompleto);
    const fileName = `${pastaMae}.json`;
    const rel = `korvil/sections/korvil-loja/login/contas/${pastaMae}/${fileName}`;
    const fullDir = path.join(__dirname, 'login/contas', pastaMae);
    const fullPath = path.join(fullDir, fileName);
    fs.mkdirSync(fullDir, { recursive:true });
    const data = { ...conta, pastaMae, fileName, criadoEm: new Date().toISOString(), origem:'Node automatico sem token no login' };
    fs.writeFileSync(fullPath, JSON.stringify(data,null,2), 'utf8');
    let gh=null; try{ gh=await githubPutFile(rel, JSON.stringify(data,null,2)); }catch(e){ console.error(e); }
    res.json({ ok:true, pastaMae, fileName, path: rel, github: gh? 'ok':'local' });
  }catch(e){ res.status(500).json({ ok:false, error:e.message }); }
});

app.listen(process.env.PORT||3001, ()=> console.log('KORVIL LOJA server.js GH_TOKEN '+(GH_TOKEN?'ATIVO':'AUSENTE')));
