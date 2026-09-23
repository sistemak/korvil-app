// server.js NA RAIZ - serve korvil/sections/korvil-loja/ com Node puro
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const LOJA_ROOT = path.join(__dirname, 'korvil','sections','korvil-loja');
const CONTAS_DIR = path.join(LOJA_ROOT, 'login','contas');

function ensure(){
  if(!fs.existsSync(LOJA_ROOT)) fs.mkdirSync(LOJA_ROOT,{recursive:true});
  if(!fs.existsSync(CONTAS_DIR)) fs.mkdirSync(CONTAS_DIR,{recursive:true});
  const gk = path.join(CONTAS_DIR,'.gitkeep');
  if(!fs.existsSync(gk)) fs.writeFileSync(gk,'');
}
ensure();

function cors(res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
}
function json(res,status,obj){
  cors(res); res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'}); res.end(JSON.stringify(obj));
}
function norm(s){ return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim(); }
function genFile(nome){ const p=norm(nome).split(/\s+/).filter(Boolean); if(!p.length) return 'usuario.json'; let b=p[0]; if(p[1]) b+='-'+p[1][0]; if(p[2]) b+='-'+p[2][0]; b=b.replace(/[^a-z0-9-]/g,''); return b+'.json'; }
function h(s){ return crypto.createHash('sha256').update(s).digest('hex'); }
function body(req){ return new Promise((res,rej)=>{ let d=''; req.on('data',c=>d+=c); req.on('end',()=>{ try{ res(d?JSON.parse(d):{});}catch(e){rej(e);} }); }); }
function listar(){
  const out=[]; if(!fs.existsSync(CONTAS_DIR)) return out;
  for(const dir of fs.readdirSync(CONTAS_DIR,{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name)){
    const fullDir=path.join(CONTAS_DIR,dir);
    for(const f of fs.readdirSync(fullDir).filter(x=>x.endsWith('.json'))){
      try{ out.push(JSON.parse(fs.readFileSync(path.join(fullDir,f),'utf8')));}catch{}
    }
  }
  return out;
}
function serve(req,res){
  let u=req.url.split('?')[0];
  if(u==='/'||u==='') u='/korvil/sections/korvil-loja/index.html';
  if(u==='/login') u='/korvil/sections/korvil-loja/login/index.html';
  if(u==='/login/') u='/korvil/sections/korvil-loja/login/index.html';
  // se pedir /korvil/... serve direto, se pedir /index.html na raiz? redireciona
  let filePath;
  if(u.startsWith('/korvil/')) filePath=path.join(__dirname, u.replace(/^\//,''));
  else if(u.startsWith('/api/')) return false;
  else {
    // tenta dentro de LOJA_ROOT
    const rel = u.replace(/^\//,'');
    filePath = path.join(LOJA_ROOT, rel);
    if(!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()){
      // fallback para index da loja
      if(!path.extname(filePath)) filePath=path.join(LOJA_ROOT,'index.html');
    }
  }
  const rootCheck = path.join(__dirname);
  if(!filePath.startsWith(rootCheck)){ res.writeHead(403); res.end('Forbidden'); return true; }
  if(fs.existsSync(filePath) && fs.statSync(filePath).isFile()){
    const ext=path.extname(filePath).toLowerCase();
    const mime={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'}[ext]||'application/octet-stream';
    res.writeHead(200,{'Content-Type':mime}); fs.createReadStream(filePath).pipe(res); return true;
  }
  return false;
}

const srv=http.createServer(async(req,res)=>{
  cors(res);
  if(req.method==='OPTIONS'){ res.writeHead(204); res.end(); return; }

  if(req.url.startsWith('/api/criar-conta') && req.method==='POST'){
    try{
      const b=await body(req);
      const {nome_completo,email,senha} = b;
      if(!nome_completo||nome_completo.trim().length<3) return json(res,400,{ok:false,erro:'Nome mínimo 3'});
      if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(res,400,{ok:false,erro:'Email inválido'});
      if(!senha||senha.length<6) return json(res,400,{ok:false,erro:'Senha mínimo 6'});
      const contas=listar();
      if(contas.find(c=>c.email.toLowerCase()===email.toLowerCase())) return json(res,409,{ok:false,erro:'Email já existe'});
      const arq=genFile(nome_completo);
      const pasta=arq.replace('.json','');
      const pastaFull=path.join(CONTAS_DIR,pasta);
      fs.mkdirSync(pastaFull,{recursive:true});
      const fileFull=path.join(pastaFull,arq);
      const conta={
        id: crypto.randomUUID?crypto.randomUUID():crypto.randomBytes(16).toString('hex'),
        arquivo:arq, pasta_mae:pasta,
        nome_completo:nome_completo.trim(),
        primeiro_nome:nome_completo.trim().split(/\s+/)[0],
        email:email.trim().toLowerCase(),
        senha_hash:h(senha),
        cpf:(b.cpf||'').trim(), whatsapp:(b.whatsapp||'').trim(), cep:(b.cep||'').trim(),
        rua:(b.rua||'').trim(), numero:(b.numero||'').trim(), bairro:(b.bairro||'').trim(), cidade:(b.cidade||'').trim(), estado:(b.estado||'').trim(),
        foto_perfil:b.foto_perfil||'',
        criado_em:new Date().toISOString(), atualizado_em:new Date().toISOString()
      };
      fs.writeFileSync(fileFull, JSON.stringify(conta,null,2),'utf8');
      console.log('[KORVIL ROOT] Conta:',pasta+'/'+arq);
      return json(res,200,{ok:true, arquivo:arq, pastaMae:pasta, path:'korvil/sections/korvil-loja/login/contas/'+pasta+'/'+arq, conta});
    }catch(e){ return json(res,500,{ok:false,erro:e.message}); }
  }
  if(req.url.startsWith('/api/login') && req.method==='POST'){
    try{
      const {email,senha}=await body(req);
      const contas=listar();
      const c=contas.find(x=>x.email.toLowerCase()===email.toLowerCase());
      if(!c) return json(res,404,{ok:false,erro:'Conta não encontrada'});
      if(c.senha_hash!==h(senha)) return json(res,401,{ok:false,erro:'Senha incorreta'});
      const {senha_hash,...safe}=c; return json(res,200,{ok:true, conta:safe});
    }catch(e){ return json(res,500,{ok:false,erro:e.message}); }
  }
  if(req.url.startsWith('/api/atualizar-conta') && req.method==='POST'){
    try{
      const b=await body(req);
      const fp=path.join(CONTAS_DIR,b.pasta_mae,b.arquivo);
      if(!fs.existsSync(fp)) return json(res,404,{ok:false,erro:'Não existe'});
      const atual=JSON.parse(fs.readFileSync(fp,'utf8'));
      for(const k of ['nome_completo','email','whatsapp','cpf','cep','rua','numero','bairro','cidade','estado','foto_perfil']) if(b[k]!==undefined) atual[k]=b[k];
      if(b.nome_completo) atual.primeiro_nome=b.nome_completo.trim().split(/\s+/)[0];
      atual.atualizado_em=new Date().toISOString();
      fs.writeFileSync(fp, JSON.stringify(atual,null,2),'utf8');
      const {senha_hash,...safe}=atual; return json(res,200,{ok:true, conta:safe});
    }catch(e){ return json(res,500,{ok:false,erro:e.message}); }
  }
  if(req.url.startsWith('/api/contas')){
    const contas=listar().map(({senha_hash,foto_perfil,...r})=>r);
    return json(res,200,{ok:true,total:contas.length,contas});
  }

  if(serve(req,res)) return;
  cors(res); res.writeHead(404,{'Content-Type':'text/html'}); res.end('<h1>404 KORVIL</h1><a href="/korvil/sections/korvil-loja/index.html">Loja</a>');
});
srv.listen(PORT, ()=>console.log('[KORVIL ROOT] http://localhost:'+PORT+' LOJA_ROOT='+LOJA_ROOT));
