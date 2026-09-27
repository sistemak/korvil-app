// server.js raiz - GH_TOKEN interno automático sem vazar, total acesso geral automático
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const GH_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || process.env.KORVIL_GH_TOKEN || '';
const app = express();
app.use(express.json({limit:'15mb'}));
app.use(express.static(__dirname));

const CONTAS_DIR = path.join(__dirname, 'korvil/sections/korvil-loja/login/contas');

function ensureDir(p){ fs.mkdirSync(p,{recursive:true}); }
function gerarPastaMae(nome){
  const n = nome.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const parts = n.split(/\s+/).filter(Boolean);
  if(!parts.length) return '';
  let r = parts.length===1?parts[0]: parts.length===2? parts[0]+'-'+parts[1][0] : parts[0]+'-'+parts[1][0]+'-'+parts[2][0];
  return r.replace(/[^a-z0-9-]/g,'').replace(/--+/g,'-').replace(/^-+|-+$/g,'');
}
function sha256(t){ return crypto.createHash('sha256').update(t).digest('hex'); }

app.post('/api/criar-conta', async (req,res)=>{
  try{
    const {nome_completo,email,senha,cpf,whatsapp,cep,rua,numero,bairro,cidade,estado,foto_perfil,pastaMae,arquivo} = req.body;
    if(!nome_completo||nome_completo.length<3) return res.status(400).json({ok:false, error:'nome inválido'});
    if(!email||!email.includes('@')) return res.status(400).json({ok:false, error:'email inválido'});
    if(!senha||senha.length<6) return res.status(400).json({ok:false, error:'senha min 6'});

    const pm = pastaMae || gerarPastaMae(nome_completo);
    const arq = arquivo || (pm+'.json');
    const conta = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      arquivo: arq,
      pasta_mae: pm,
      nome_completo: nome_completo.trim(),
      primeiro_nome: nome_completo.trim().split(/\s+/)[0],
      email: email.trim(),
      senha_hash: sha256(senha),
      cpf: (cpf||'').trim(),
      whatsapp: (whatsapp||'').trim(),
      cep: (cep||'').trim(),
      numero: (numero||'').trim(),
      rua: (rua||'').trim(),
      bairro: (bairro||'').trim(),
      cidade: (cidade||'').trim(),
      estado: (estado||'').trim().toUpperCase(),
      foto_perfil: foto_perfil||'',
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    };

    // Cria pasta mãe real
    ensureDir(path.join(CONTAS_DIR, pm));
    const filePathFs = path.join(CONTAS_DIR, pm, arq);
    fs.writeFileSync(filePathFs, JSON.stringify(conta,null,2), 'utf8');
    console.log('✓ Pasta mãe criada:', filePathFs);

    // Também cria no GitHub repo original se GH_TOKEN interno disponível
    if(GH_TOKEN){
      try{
        const filePathRepo = 'korvil/sections/korvil-loja/login/contas/'+pm+'/'+arq;
        const contentB64 = Buffer.from(JSON.stringify(conta,null,2)).toString('base64');
        const apiUrl = 'https://api.github.com/repos/sistemak/korvil-app/contents/'+filePathRepo;

        // tenta pegar sha existente
        let sha=null;
        try{
          const getRes = await fetch(apiUrl, {headers:{Authorization:'token '+GH_TOKEN, Accept:'application/vnd.github.v3+json'}});
          if(getRes.ok){ const j=await getRes.json(); sha=j.sha; }
        }catch{}

        await fetch(apiUrl, {method:'PUT', headers:{Authorization:'token '+GH_TOKEN, Accept:'application/vnd.github.v3+json', 'Content-Type':'application/json'}, body: JSON.stringify({message:'KORVIL: conta '+pm+' criada - '+conta.email+' - '+new Date().toISOString(), content: contentB64, branch:'main', ...(sha?{sha}:{})})});
        console.log('✓ GitHub API commit OK:', filePathRepo);
      }catch(e){ console.warn('GitHub API falhou (mas pasta local criada):', e.message); }
    }

    // Nunca retorna HTML quando deveria JSON - corrige Unexpected token '<'
    return res.json({ok:true, pastaMae: pm, arquivo: arq, path: 'korvil/sections/korvil-loja/login/contas/'+pm+'/'+arq});
  }catch(e){
    console.error(e);
    return res.status(500).json({ok:false, error: e.message});
  }
});

app.get('/api/contas', (req,res)=>{
  try{
    if(!fs.existsSync(CONTAS_DIR)) return res.json([]);
    const pastas = fs.readdirSync(CONTAS_DIR).filter(f=>fs.statSync(path.join(CONTAS_DIR,f)).isDirectory());
    const contas = pastas.map(p=>{
      const files = fs.readdirSync(path.join(CONTAS_DIR,p)).filter(f=>f.endsWith('.json'));
      if(!files.length) return null;
      try{ const c = JSON.parse(fs.readFileSync(path.join(CONTAS_DIR,p,files[0]),'utf8')); return c; }catch{return null;}
    }).filter(Boolean);
    res.json(contas);
  }catch(e){ res.status(500).json({error:e.message}); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log('KORVIL MASTER SERVER rodando porta '+PORT+' GH_TOKEN interno '+(GH_TOKEN?'ativo ✓':'não configurado')));
