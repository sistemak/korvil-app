// server.js - KORVIL LOJA - Node puro - ATUALIZADO
// Só cria conta quando TODOS dados preenchidos e válidos. Exclui conta via GitHub API.

const http = require('http');
const https = require('https');
const crypto = require('crypto');
const url = require('url');

const REPO_OWNER = 'sistemak';
const REPO_NAME = 'korvil-app';
const REPO_BRANCH = 'main';

// --- Util: remover acento, gerar pasta mãe ---
function removerAcentos(str){
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}
function gerarNomePasta(nomeCompleto){
  if(!nomeCompleto) return '';
  const limpo = removerAcentos(nomeCompleto.trim()).toLowerCase();
  const partes = limpo.split(/\s+/).filter(Boolean);
  if(partes.length === 0) return '';
  if(partes.length === 1) return partes[0];
  const primeiro = partes[0];
  const iniciais = partes.slice(1).map(p=>p[0]).join('');
  return `${primeiro}_${iniciais}`.replace(/[^a-z0-9_]/g,'').slice(0,40);
}

function hashSenha(senha){
  return crypto.createHash('sha256').update(senha).digest('hex');
}

function validarEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --- GitHub API: excluir conta ---
async function excluirConta(pastaMae, githubToken){
  const path = `korvil/sections/korvil-loja/login/contas/${pastaMae}/${pastaMae}.json`;
  const apiUrl = `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(path)}`;

  // 1. GET para pegar SHA
  const getSha = await githubRequest('GET', apiUrl, null, githubToken);
  if(!getSha || !getSha.sha){
    throw new Error('Arquivo não encontrado para exclusão: ' + path);
  }

  // 2. DELETE com SHA
  const body = JSON.stringify({
    message: `KORVIL: exclui conta ${pastaMae} [auto]`,
    sha: getSha.sha,
    branch: REPO_BRANCH
  });
  const del = await githubRequest('DELETE', apiUrl, body, githubToken);
  return del;
}

function githubRequest(method, apiPath, body, token){
  return new Promise((resolve, reject)=>{
    const options = {
      hostname: 'api.github.com',
      path: apiPath + (apiPath.includes('?')?'&':'?') + 'ref=' + REPO_BRANCH,
      method,
      headers: {
        'User-Agent': 'korvil-loja-server',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      }
    };
    const req = https.request(options, (res)=>{
      let data='';
      res.on('data', c=>data+=c);
      res.on('end', ()=>{
        try{
          const json = JSON.parse(data || '{}');
          if(res.statusCode>=200 && res.statusCode<300) resolve(json);
          else reject(new Error(`GitHub ${res.statusCode}: ${data}`));
        }catch(e){ resolve({raw:data, status: res.statusCode}); }
      });
    });
    req.on('error', reject);
    if(body) req.write(body);
    req.end();
  });
}

function githubGetContas(token){
  return githubRequest('GET', `/repos/${REPO_OWNER}/${REPO_NAME}/contents/korvil/sections/korvil-loja/login/contas`, null, token);
}

// --- Server ---
const server = http.createServer(async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  if(req.method==='OPTIONS'){ res.writeHead(204); return res.end(); }

  const parsed = url.parse(req.url, true);

  if(req.method==='POST' && parsed.pathname==='/criar-conta'){
    let body=''; req.on('data', c=>body+=c);
    req.on('end', async ()=>{
      try{
        const { nome, email, senha, confirmarSenha } = JSON.parse(body);
        // VALIDAÇÃO COMPLETA - NUNCA cria incompleto
        if(!nome || !email || !senha || !confirmarSenha){
          res.writeHead(400); return res.end(JSON.stringify({ok:false, erro:'Preencha todos os dados'}));
        }
        if(nome.trim().length < 3){ res.writeHead(400); return res.end(JSON.stringify({ok:false, erro:'Nome deve ter >=3'})); }
        if(!validarEmail(email)){ res.writeHead(400); return res.end(JSON.stringify({ok:false, erro:'Email inválido'})); }
        if(senha.length < 6){ res.writeHead(400); return res.end(JSON.stringify({ok:false, erro:'Senha >=6 caracteres'})); }
        if(senha !== confirmarSenha){ res.writeHead(400); return res.end(JSON.stringify({ok:false, erro:'Senhas não conferem'})); }

        const pastaMae = gerarNomePasta(nome);
        if(!pastaMae){ res.writeHead(400); return res.end(JSON.stringify({ok:false, erro:'Nome inválido para pasta'})); }

        // verifica se já existe
        try{
          const existe = await githubRequest('GET', `/repos/${REPO_OWNER}/${REPO_NAME}/contents/korvil/sections/korvil-loja/login/contas/${pastaMae}/${pastaMae}.json`, null, process.env.GH_TOKEN);
          if(existe && existe.sha){ res.writeHead(409); return res.end(JSON.stringify({ok:false, erro:'Conta já existe: '+pastaMae})); }
        }catch(_){ /* não existe, pode criar */ }

        const contaJson = {
          id: crypto.randomUUID(),
          pasta: pastaMae,
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          senha_hash: hashSenha(senha),
          criado_em: new Date().toISOString()
        };

        const path = `korvil/sections/korvil-loja/login/contas/${pastaMae}/${pastaMae}.json`;
        const putBody = JSON.stringify({
          message: `KORVIL: cria conta ${pastaMae}`,
          content: Buffer.from(JSON.stringify(contaJson, null, 2)).toString('base64'),
          branch: REPO_BRANCH
        });
        await githubRequest('PUT', `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURIComponent(path)}`, putBody, process.env.GH_TOKEN);

        res.writeHead(201); res.end(JSON.stringify({ok:true, pastaMae, conta: contaJson}));
      }catch(e){ res.writeHead(500); res.end(JSON.stringify({ok:false, erro: e.message})); }
    });
    return;
  }

  if(req.method==='POST' && parsed.pathname==='/excluir-conta'){
    let body=''; req.on('data', c=>body+=c);
    req.on('end', async ()=>{
      try{
        const { pastaMae, token } = JSON.parse(body);
        const ghToken = token || process.env.GH_TOKEN;
        if(!pastaMae){ res.writeHead(400); return res.end(JSON.stringify({ok:false, erro:'pastaMae obrigatória'})); }
        const result = await excluirConta(pastaMae, ghToken);
        res.writeHead(200); res.end(JSON.stringify({ok:true, result}));
      }catch(e){ res.writeHead(500); res.end(JSON.stringify({ok:false, erro:e.message})); }
    });
    return;
  }

  res.writeHead(404); res.end('Not found');
});

server.listen(3000, ()=>console.log('KORVIL server 3000 - só cria conta completa'));
