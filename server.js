require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// GH_TOKEN interno automatico total acesso geral, sem vazar, sem mostrar na UI, sem aparecer no frontend
const GH_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_PAT || '';
const REPO = 'sistemak/korvil-app';
const BRANCH = 'main';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));
app.use('/loja', express.static(path.join(__dirname, 'korvil/sections/korvil-loja')));

function normalizePastaMae(nome){
  const n = (nome||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const parts = n.split(/\s+/).filter(Boolean);
  if(parts.length<=1) return n.replace(/[^a-z0-9-]/g,'-').replace(/-+/g,'-') || 'usuario';
  if(parts.length===2) return `${parts[0]}-${parts[1][0]}`;
  return `${parts[0]}-${parts.slice(1).map(p=>p[0]).join('-')}`;
}

async function githubPutFile(filePath, contentString){
  if(!GH_TOKEN) return { skipped:true, reason:'SEM GH_TOKEN ENV - salvo local apenas' };
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${filePath.split('/').map(encodeURIComponent).join('/')}`;
  let sha;
  try{
    const getRes = await fetch(apiUrl, { headers: { Authorization: `Bearer ${GH_TOKEN}`, Accept: 'application/vnd.github+json' } });
    if(getRes.ok){ const j = await getRes.json(); sha = j.sha; }
  }catch(e){}
  const body = {
    message: `feat(contas): criar ${filePath} automatico via Node GH_TOKEN interno`,
    content: Buffer.from(contentString,'utf8').toString('base64'),
    branch: BRANCH,
    ...(sha?{sha}:{})
  };
  const putRes = await fetch(apiUrl, { method:'PUT', headers:{ Authorization: `Bearer ${GH_TOKEN}`, 'Content-Type':'application/json', Accept:'application/vnd.github+json' }, body: JSON.stringify(body) });
  if(!putRes.ok){ const t = await putRes.text(); throw new Error(`GitHub PUT falhou ${putRes.status}: ${t}`); }
  return await putRes.json();
}

app.post('/api/criar-conta', async (req,res)=>{
  try{
    const conta = req.body;
    if(!conta || !conta.nomeCompleto || !conta.email || !conta.senha) return res.status(400).json({ ok:false, error:'nome, email e senha obrigatorios' });
    const pastaMae = normalizePastaMae(conta.nomeCompleto);
    const fileName = `${pastaMae}.json`;
    const relativePath = `korvil/sections/korvil-loja/login/contas/${pastaMae}/${fileName}`;
    const fullDir = path.join(__dirname, 'korvil/sections/korvil-loja/login/contas', pastaMae);
    const fullPath = path.join(fullDir, fileName);
    fs.mkdirSync(fullDir, { recursive:true });
    const dataToSave = { ...conta, pastaMae, fileName, criadoEm: new Date().toISOString(), origem: 'Node GH_TOKEN interno automatico SEM TOKEN NO LOGIN' };
    fs.writeFileSync(fullPath, JSON.stringify(dataToSave, null, 2), 'utf8');
    let ghResult = null;
    try{ ghResult = await githubPutFile(relativePath, JSON.stringify(dataToSave, null, 2)); }catch(e){ console.error('GH PUT erro', e.message); }
    return res.json({ ok:true, pastaMae, fileName, path: relativePath, github: ghResult? 'commitado':'local', localPath: fullPath });
  }catch(err){
    console.error(err);
    return res.status(500).json({ ok:false, error: err.message });
  }
});

app.post('/api/github-dispatch', async (req,res)=>{
  try{
    const conta = req.body;
    const pastaMae = normalizePastaMae(conta.nomeCompleto || conta.nome || 'usuario');
    const fileName = `${pastaMae}.json`;
    const relativePath = `korvil/sections/korvil-loja/login/contas/${pastaMae}/${fileName}`;
    if(!GH_TOKEN){
      return res.json({ ok:true, mode:'PAGES_MODE', saved:false, note:'SEM GH_TOKEN ENV - usar workflow secrets.GH_TOKEN' });
    }
    const ghResult = await githubPutFile(relativePath, JSON.stringify(conta, null, 2));
    return res.json({ ok:true, dispatch:true, github: ghResult });
  }catch(e){
    return res.status(500).json({ ok:false, error:e.message });
  }
});

app.get('/api/status', (req,res)=>{
  res.json({ ok:true, gh_token_ativo: !!GH_TOKEN, repo: REPO, branch: BRANCH, mode: GH_TOKEN ? 'NODE AUTOMATICO TOTAL ACESSO GERAL' : 'PAGES_MODE FALLBACK' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`KORVIL Node automatico rodando porta ${PORT} - GH_TOKEN ${GH_TOKEN ? 'ATIVO interno' : 'AUSENTE configure env'}`));
