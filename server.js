// KORVIL LOJA - NODE COM GH_TOKEN TOTAL ACESSO AUTOMÁTICO
// GH_TOKEN = process.env.GH_TOKEN || token interno total acesso geral sem pedir pro usuário final
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
// ROOT server.js - mesmo código, serve tudo da raiz

// Lê token de env ou de arquivo salvo pelo master (se houver)
let GH_TOKEN = process.env.GH_TOKEN || '';
try{
  const tokenPath = path.join(__dirname, '.korvil_token');
  if(fs.existsSync(tokenPath)) GH_TOKEN = fs.readFileSync(tokenPath,'utf8').trim() || GH_TOKEN;
}catch{}
console.log('GH_TOKEN presente?', !!GH_TOKEN);

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

app.get('/api/status', (req,res)=>{
  res.json({ ok:true, gh_token_present: !!GH_TOKEN, time: new Date().toISOString() });
});

app.post('/api/criar-conta', async (req,res)=>{
  try{
    const conta = req.body;
    if(!conta || !conta.nome_completo || !conta.email) return res.status(400).json({ error:'Dados incompletos' });
    const pastaMae = gerarPastaMae(conta.nome_completo) || conta.pasta_mae;
    if(!pastaMae) return res.status(400).json({ error:'pasta-mae inválida' });
    const arquivo = pastaMae + '.json';
    const dir = path.join(__dirname, 'login', 'contas', pastaMae);
    ensureContasDir();
    fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, arquivo);
    const finalConta = {
      ...conta,
      pasta_mae: pastaMae,
      arquivo,
      atualizado_em: new Date().toISOString(),
    };
    fs.writeFileSync(filePath, JSON.stringify(finalConta,null,2), 'utf8');
    console.log('✓ Pasta mãe criada:', filePath);

    // Também faz PUT GitHub API criando mesmo arquivo no repo original
    if(GH_TOKEN){
      try{
        const ghPath = 'korvil/sections/korvil-loja/login/contas/'+pastaMae+'/'+arquivo;
        const contentB64 = Buffer.from(JSON.stringify(finalConta,null,2)).toString('base64');
        // busca sha se existe
        let sha;
        try{
          const getRes = await fetch('https://api.github.com/repos/sistemak/korvil-app/contents/'+ghPath+'?ref=main', {
            headers:{'Authorization':'Bearer '+GH_TOKEN, 'Accept':'application/vnd.github+json'}
          });
          if(getRes.ok){ const j = await getRes.json(); sha = j.sha; }
        }catch{}
        const putRes = await fetch('https://api.github.com/repos/sistemak/korvil-app/contents/'+ghPath, {
          method:'PUT',
          headers:{'Authorization':'Bearer '+GH_TOKEN,'Content-Type':'application/json','Accept':'application/vnd.github+json'},
          body: JSON.stringify({
            message: 'feat(contas): cria '+pastaMae+'/'+arquivo+' com todos dados exatos',
            content: contentB64,
            sha,
            branch:'main'
          })
        });
        const putTxt = await putRes.text();
        console.log('GitHub PUT', putRes.status, putTxt.slice(0,200));
      }catch(err){ console.error('GitHub sync erro', err.message); }
    }

    // salva lista local
    try{
      const listaPath = path.join(__dirname, 'login','contas','_index.json');
      let lista = [];
      if(fs.existsSync(listaPath)) lista = JSON.parse(fs.readFileSync(listaPath,'utf8'));
      lista = lista.filter(u=> u.pasta_mae!==pastaMae);
      lista.push(finalConta);
      fs.writeFileSync(listaPath, JSON.stringify(lista,null,2));
    }catch{}

    res.json({ ok:true, path: 'login/contas/'+pastaMae+'/'+arquivo, pasta_mae: pastaMae, arquivo });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', (req,res)=>{
  try{
    const { email, senha } = req.body;
    if(!email || !senha) return res.status(400).json({ error:'Email e senha obrigatórios' });
    const hash = crypto.createHash('sha256').update(senha).digest('hex');
    const base = path.join(__dirname, 'login','contas');
    if(!fs.existsSync(base)) return res.status(404).json({ error:'Nenhuma conta' });
    const pastas = fs.readdirSync(base).filter(p=> fs.statSync(path.join(base,p)).isDirectory());
    for(const pm of pastas){
      const file = path.join(base, pm, pm+'.json');
      if(!fs.existsSync(file)) continue;
      const data = JSON.parse(fs.readFileSync(file,'utf8'));
      if(data.email===email && data.senha_hash===hash){
        return res.json({ ok:true, user: data });
      }
    }
    res.status(401).json({ error:'Credenciais inválidas' });
  }catch(e){ res.status(500).json({ error:e.message }); }
});

app.post('/api/atualizar-conta', (req,res)=>{
  try{
    const conta = req.body;
    const pastaMae = conta.pasta_mae;
    const filePath = path.join(__dirname, 'login','contas', pastaMae, pastaMae+'.json');
    if(!fs.existsSync(filePath)) return res.status(404).json({ error:'Conta não existe' });
    const atual = JSON.parse(fs.readFileSync(filePath,'utf8'));
    const novo = { ...atual, ...conta, atualizado_em: new Date().toISOString() };
    fs.writeFileSync(filePath, JSON.stringify(novo,null,2));
    res.json({ ok:true });
  }catch(e){ res.status(500).json({ error:e.message }); }
});

app.listen(PORT, ()=> console.log('KORVIL server rodando em '+PORT+' - contas em login/contas/{pasta-mae}/{pasta-mae}.json'));
