// korvil/sections/korvil-loja/server.js
// Node PURO - sem dependências externas
// Cria pasta mãe + .json real em login/contas/{pastaMae}/{arquivo}
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname; // korvil/sections/korvil-loja
const CONTAS_DIR = path.join(ROOT, 'login', 'contas');

function ensureContas(){
  if(!fs.existsSync(CONTAS_DIR)) fs.mkdirSync(CONTAS_DIR, {recursive:true});
  const gitkeep = path.join(CONTAS_DIR, '.gitkeep');
  if(!fs.existsSync(gitkeep)) fs.writeFileSync(gitkeep, '');
}
ensureContas();

function cors(res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
}
function sendJSON(res, status, data){
  cors(res);
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8'});
  res.end(JSON.stringify(data));
}
function normalizeNome(str){
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
}
function gerarNomeArquivo(nomeCompleto){
  const parts = normalizeNome(nomeCompleto).split(/\s+/).filter(Boolean);
  if(parts.length===0) return 'usuario.json';
  const primeiro = parts[0];
  const inicial2 = parts[1] ? parts[1][0] : '';
  const inicial3 = parts[2] ? parts[2][0] : '';
  let base = primeiro;
  if(inicial2) base += '-' + inicial2;
  if(inicial3) base += '-' + inicial3;
  // sanitiza
  base = base.replace(/[^a-z0-9-]/g,'');
  return base + '.json'; // ex: joao-s-s.json
}
function hashSenha(senha){
  return crypto.createHash('sha256').update(senha).digest('hex');
}
function readBody(req){
  return new Promise((resolve,reject)=>{
    let data=''; req.on('data', c=>data+=c); req.on('end',()=>{ try{ resolve(data?JSON.parse(data):{});}catch(e){ reject(e);} }); req.on('error',reject);
  });
}
function listarContas(){
  const out=[];
  if(!fs.existsSync(CONTAS_DIR)) return out;
  const pastas = fs.readdirSync(CONTAS_DIR, {withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name);
  for(const pasta of pastas){
    const pPath = path.join(CONTAS_DIR, pasta);
    const files = fs.readdirSync(pPath).filter(f=>f.endsWith('.json'));
    for(const f of files){
      try{
        const full = path.join(pPath,f);
        const txt = fs.readFileSync(full,'utf8');
        const j = JSON.parse(txt);
        out.push(j);
      }catch{}
    }
  }
  return out;
}

function serveStatic(req,res){
  let urlPath = req.url.split('?')[0];
  if(urlPath==='/' ) urlPath = '/index.html';
  if(urlPath==='/login') urlPath = '/login/index.html';
  if(urlPath==='/login/') urlPath = '/login/index.html';
  const safePath = path.normalize(urlPath).replace(/^\.\.\//,'').replace(/^\//,'');
  const full = path.join(ROOT, safePath);
  if(!full.startsWith(ROOT)){ res.writeHead(403); res.end('Forbidden'); return true; }
  if(fs.existsSync(full) && fs.statSync(full).isFile()){
    const ext = path.extname(full).toLowerCase();
    const map = {'.html':'text/html; charset=utf-8','.js':'application/javascript','.json':'application/json','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'};
    res.writeHead(200, {'Content-Type': map[ext]||'application/octet-stream'});
    fs.createReadStream(full).pipe(res);
    return true;
  }
  return false;
}

const server = http.createServer(async (req,res)=>{
  cors(res);
  if(req.method==='OPTIONS'){ res.writeHead(204); res.end(); return; }

  // ROTAS API
  if(req.url.startsWith('/api/criar-conta') && req.method==='POST'){
    try{
      const body = await readBody(req);
      const {nome_completo,email,senha,cpf,whatsapp,cep,rua,numero,bairro,cidade,estado,foto_perfil} = body;
      if(!nome_completo || nome_completo.trim().length<3) return sendJSON(res,400,{ok:false,erro:'Nome mínimo 3'});
      if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return sendJSON(res,400,{ok:false,erro:'Email inválido'});
      if(!senha || senha.length<6) return sendJSON(res,400,{ok:false,erro:'Senha mínimo 6'});
      // verifica duplicado
      const contas = listarContas();
      if(contas.find(c=>c.email && c.email.toLowerCase()===email.toLowerCase())) return sendJSON(res,409,{ok:false,erro:'Email já cadastrado'});

      const nomeArquivo = gerarNomeArquivo(nome_completo);
      const pastaMae = nomeArquivo.replace('.json','');
      const pastaFull = path.join(CONTAS_DIR, pastaMae);
      fs.mkdirSync(pastaFull, {recursive:true});
      const fileFull = path.join(pastaFull, nomeArquivo);
      const id = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
      const primeiro_nome = nome_completo.trim().split(/\s+/)[0];
      const agora = new Date().toISOString();
      const conta = {
        id,
        arquivo: nomeArquivo,
        pasta_mae: pastaMae,
        nome_completo: nome_completo.trim(),
        primeiro_nome,
        email: email.trim().toLowerCase(),
        senha_hash: hashSenha(senha),
        cpf: (cpf||'').trim(),
        whatsapp: (whatsapp||'').trim(),
        cep: (cep||'').trim(),
        rua: (rua||'').trim(),
        numero: (numero||'').trim(),
        bairro: (bairro||'').trim(),
        cidade: (cidade||'').trim(),
        estado: (estado||'').trim(),
        foto_perfil: foto_perfil||'',
        criado_em: agora,
        atualizado_em: agora
      };
      fs.writeFileSync(fileFull, JSON.stringify(conta, null, 2), 'utf8');
      console.log('[KORVIL] Conta criada:', pastaMae+'/'+nomeArquivo, email);
      return sendJSON(res,200,{ok:true, arquivo:nomeArquivo, pastaMae, path: 'korvil/sections/korvil-loja/login/contas/'+pastaMae+'/'+nomeArquivo, conta});
    }catch(e){ console.error(e); return sendJSON(res,500,{ok:false,erro:'Erro interno: '+e.message}); }
  }

  if(req.url.startsWith('/api/login') && req.method==='POST'){
    try{
      const {email,senha} = await readBody(req);
      if(!email||!senha) return sendJSON(res,400,{ok:false,erro:'Email e senha obrigatórios'});
      const contas = listarContas();
      const conta = contas.find(c=>c.email.toLowerCase()===email.toLowerCase());
      if(!conta) return sendJSON(res,404,{ok:false,erro:'Conta não encontrada'});
      if(conta.senha_hash!==hashSenha(senha)) return sendJSON(res,401,{ok:false,erro:'Senha incorreta'});
      const {senha_hash, ...safe} = conta;
      return sendJSON(res,200,{ok:true, conta:safe});
    }catch(e){ return sendJSON(res,500,{ok:false,erro:e.message}); }
  }

  if(req.url.startsWith('/api/atualizar-conta') && req.method==='POST'){
    try{
      const body = await readBody(req);
      const {arquivo,pasta_mae} = body;
      if(!arquivo||!pasta_mae) return sendJSON(res,400,{ok:false,erro:'arquivo e pasta_mae obrigatórios'});
      const fileFull = path.join(CONTAS_DIR, pasta_mae, arquivo);
      if(!fs.existsSync(fileFull)) return sendJSON(res,404,{ok:false,erro:'Conta não existe no filesystem'});
      const atual = JSON.parse(fs.readFileSync(fileFull,'utf8'));
      const novos = {...atual};
      const campos = ['nome_completo','email','whatsapp','cpf','cep','rua','numero','bairro','cidade','estado','foto_perfil'];
      for(const c of campos){ if(body[c]!==undefined) novos[c]=body[c]; }
      if(body.nome_completo) novos.primeiro_nome = body.nome_completo.trim().split(/\s+/)[0];
      novos.atualizado_em = new Date().toISOString();
      fs.writeFileSync(fileFull, JSON.stringify(novos,null,2),'utf8');
      const {senha_hash, ...safe}=novos;
      return sendJSON(res,200,{ok:true, conta:safe});
    }catch(e){ return sendJSON(res,500,{ok:false,erro:e.message}); }
  }

  if(req.url.startsWith('/api/contas') && req.method==='GET'){
    const contas = listarContas().map(c=>{ const {senha_hash, foto_perfil, ...rest}=c; return rest; });
    return sendJSON(res,200,{ok:true, total:contas.length, contas});
  }

  // STATIC
  if(serveStatic(req,res)) return;

  // 404
  cors(res);
  res.writeHead(404, {'Content-Type':'text/html'});
  res.end('<h1>404</h1><p>Korvil - arquivo não encontrado</p><p><a href="/">Ir para loja</a></p>');
});

server.listen(PORT, ()=>console.log('[KORVIL] Rodando em http://localhost:'+PORT+' | ROOT='+ROOT+' | CONTAS='+CONTAS_DIR));
