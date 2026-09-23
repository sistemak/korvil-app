const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const GH_TOKEN = process.env.GH_TOKEN || '';
const REPO_OWNER = process.env.REPO_OWNER || 'sistemak';
const REPO_NAME = process.env.REPO_NAME || 'korvil-app';
const REPO_BRANCH = process.env.REPO_BRANCH || 'main';
const KTP_BASE_PATH = 'korvil/sections/ktp/projetotransformacao/projetos/2026/alunos';
const KTP_ALLOWED_ORIGINS = (process.env.KTP_ALLOWED_ORIGINS || 'https://sistemak.github.io,http://localhost:3000,http://localhost:8000').split(',').map(value => value.trim()).filter(Boolean);
const pesoRequests = new Map();

app.use(express.json({ limit: '20mb' }));
app.use(express.static(__dirname));
app.use('/login', express.static(path.join(__dirname, 'login')));

function gerarPastaMae(nome){
  const sem = nome.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim();
  const partes = sem.split(/\s+/).filter(Boolean);
  if(!partes.length) return '';
  if(partes.length===1) return partes[0];
  return [partes[0], ...partes.slice(1).map(p=>p[0])].join('-');
}

function ensureContasDir(){
  const base = path.join(__dirname, 'login', 'contas');
  if(!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });
  const gitkeep = path.join(base, '.gitkeep');
  if(!fs.existsSync(gitkeep)) fs.writeFileSync(gitkeep,'');
}

function ktpOriginAllowed(req){
  const origin = req.headers.origin;
  return !origin || KTP_ALLOWED_ORIGINS.includes(origin);
}

function validKtpId(id){ return /^[a-z0-9_-]{1,64}$/i.test(String(id || '')); }
function validPeso(value){
  const number = Number(String(value || '').replace(',', '.'));
  return Number.isFinite(number) && number >= 1 && number <= 500;
}
function ktpTipo(id){ return /^(tchuco|dani)/i.test(id) ? 'online' : 'presencial'; }
function ktpPath(id){ return `${KTP_BASE_PATH}/${ktpTipo(id)}/${id}/registros/pesos.html`; }
function githubHeaders(){ return { Authorization:`Bearer ${GH_TOKEN}`, Accept:'application/vnd.github+json', 'User-Agent':'korvil-ktp-peso-api' }; }

async function githubSha(filePath){
  const result = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${encodeURIComponent(REPO_BRANCH)}`, { headers: githubHeaders() });
  if(result.status === 404) return null;
  if(!result.ok) throw new Error(`GitHub GET falhou: ${result.status}`);
  return (await result.json()).sha;
}

app.get('/api/status',(req,res)=>res.json({ ok:true, gh_token_present:Boolean(GH_TOKEN), time:new Date().toISOString() }));
app.get('/api/ktp/ping',(req,res)=>res.json({ ok:true, service:'korvil-ktp-peso-api', githubConfigured:Boolean(GH_TOKEN) }));

app.post('/api/ktp/peso', async (req,res)=>{
  try{
    if(!ktpOriginAllowed(req)) return res.status(403).json({ ok:false, message:'Origem não autorizada.' });
    const { id, pesoDigitado, dataRegistro, semanaStr } = req.body || {};
    if(!validKtpId(id)) return res.status(400).json({ ok:false, message:'ID inválido.' });
    if(!validPeso(pesoDigitado)) return res.status(400).json({ ok:false, message:'Peso inválido.' });
    if(!GH_TOKEN) return res.status(503).json({ ok:false, message:'API não configurada no servidor.' });

    const now = Date.now();
    const last = pesoRequests.get(id) || 0;
    if(now - last < 10000) return res.status(429).json({ ok:false, message:'Aguarde alguns segundos antes de registrar novamente.' });
    pesoRequests.set(id, now);

    const peso = String(pesoDigitado).replace(',', '.');
    const registro = dataRegistro || new Date().toLocaleString('pt-BR', { timeZone:'America/Sao_Paulo' });
    const semana = semanaStr || new Date().toLocaleDateString('pt-BR', { timeZone:'America/Sao_Paulo' });
    const filePath = ktpPath(id);
    const html = `<!DOCTYPE html>\n<html lang="pt-BR"><head><meta charset="UTF-8"><title>${id} - pesos</title></head><body><h1>K-TP 11º ANO 2026 - ${id}</h1><p>Semana: ${semana}</p><p>Peso: ${peso}kg</p><p>Registro: ${registro}</p></body></html>`;
    const sha = await githubSha(filePath);
    const result = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`, {
      method:'PUT', headers:{ ...githubHeaders(), 'Content-Type':'application/json' },
      body:JSON.stringify({ message:`feat(ktp): registra peso de ${id} (${peso}kg)`, content:Buffer.from(html,'utf8').toString('base64'), ...(sha ? { sha } : {}), branch:REPO_BRANCH })
    });
    if(!result.ok) throw new Error(`GitHub PUT falhou: ${result.status}`);
    return res.json({ ok:true, path:filePath, message:'Peso registrado com sucesso.' });
  }catch(error){
    console.error('[KTP peso]', error.message);
    return res.status(500).json({ ok:false, message:'Não foi possível registrar o peso.' });
  }
});

app.post('/api/criar-conta', async (req,res)=>{
  try{
    const conta = req.body;
    if(!conta || !conta.nome_completo || !conta.email) return res.status(400).json({ error:'Dados incompletos' });
    const pastaMae = gerarPastaMae(conta.nome_completo) || conta.pasta_mae;
    if(!pastaMae) return res.status(400).json({ error:'pasta-mae inválida' });
    const arquivo = pastaMae + '.json';
    const dir = path.join(__dirname, 'login', 'contas', pastaMae);
    ensureContasDir(); fs.mkdirSync(dir, { recursive:true });
    const finalConta = { ...conta, pasta_mae:pastaMae, arquivo, atualizado_em:new Date().toISOString() };
    fs.writeFileSync(path.join(dir, arquivo), JSON.stringify(finalConta,null,2), 'utf8');
    try{
      const listaPath = path.join(__dirname,'login','contas','_index.json');
      let lista = fs.existsSync(listaPath) ? JSON.parse(fs.readFileSync(listaPath,'utf8')) : [];
      lista = lista.filter(u=>u.pasta_mae!==pastaMae); lista.push(finalConta);
      fs.writeFileSync(listaPath, JSON.stringify(lista,null,2));
    }catch{}
    res.json({ ok:true, path:'login/contas/'+pastaMae+'/'+arquivo, pasta_mae:pastaMae, arquivo });
  }catch(err){ res.status(500).json({ error:err.message }); }
});

app.post('/api/login',(req,res)=>{
  try{
    const { email, senha } = req.body;
    if(!email || !senha) return res.status(400).json({ error:'Email e senha obrigatórios' });
    const hash = crypto.createHash('sha256').update(senha).digest('hex');
    const base = path.join(__dirname,'login','contas');
    if(!fs.existsSync(base)) return res.status(404).json({ error:'Nenhuma conta' });
    const pastas = fs.readdirSync(base).filter(p=>fs.statSync(path.join(base,p)).isDirectory());
    for(const pm of pastas){
      const file = path.join(base,pm,pm+'.json');
      if(!fs.existsSync(file)) continue;
      const data = JSON.parse(fs.readFileSync(file,'utf8'));
      if(data.email===email && data.senha_hash===hash) return res.json({ ok:true, user:data });
    }
    res.status(401).json({ error:'Credenciais inválidas' });
  }catch(e){ res.status(500).json({ error:e.message }); }
});

app.post('/api/atualizar-conta',(req,res)=>{
  try{
    const conta = req.body; const pastaMae = conta.pasta_mae;
    if(!/^[a-z0-9-]+$/i.test(pastaMae || '')) return res.status(400).json({ error:'pasta_mae inválida' });
    const filePath = path.join(__dirname,'login','contas',pastaMae,pastaMae+'.json');
    if(!fs.existsSync(filePath)) return res.status(404).json({ error:'Conta não existe' });
    const atual = JSON.parse(fs.readFileSync(filePath,'utf8'));
    fs.writeFileSync(filePath, JSON.stringify({ ...atual, ...conta, atualizado_em:new Date().toISOString() },null,2));
    res.json({ ok:true });
  }catch(e){ res.status(500).json({ error:e.message }); }
});

app.listen(PORT,()=>console.log('KORVIL server rodando em '+PORT));
