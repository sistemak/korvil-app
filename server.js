// RAIZ - mesmo server Node que serve korvil-loja, GH_TOKEN interno
const http=require('http');
const fs=require('fs');
const path=require('path');
const url=require('url');

const PORT=process.env.PORT||3000;
const GH_TOKEN=process.env.GH_TOKEN||process.env.GITHUB_TOKEN||'';
const LOJA_DIR=path.join(__dirname,'korvil','sections','korvil-loja');
const BASE_DIR=fs.existsSync(LOJA_DIR)?LOJA_DIR:__dirname;

function ensureContas(){
  const base=path.join(BASE_DIR,'login','contas');
  try{
    if(!fs.existsSync(base)) fs.mkdirSync(base,{recursive:true});
    const gk=path.join(base,'.gitkeep'); if(!fs.existsSync(gk)) fs.writeFileSync(gk,'');
    ['joao_s_s','joao_s_s.json'].forEach(b=>{
      const p=path.join(base,b);
      try{ if(fs.existsSync(p)){ const st=fs.statSync(p); if(st.isDirectory()) fs.rmSync(p,{recursive:true,force:true}); else fs.unlinkSync(p); } }catch{}
    });
  }catch(e){ console.warn('ensure error',e.message); }
}
ensureContas();

function json(res,code,obj){
  res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PUT,OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization'});
  res.end(JSON.stringify(obj));
}

function serveStatic(req,res){
  let pathname=url.parse(req.url).pathname;
  if(pathname==='/' ) pathname='/index.html';
  let filePath=path.join(BASE_DIR,pathname);
  if(!filePath.startsWith(BASE_DIR) && !filePath.startsWith(__dirname)) return json(res,403,{error:'forbidden'});
  // tenta LOJA_DIR primeiro, depois raiz
  if(!fs.existsSync(filePath)){
    const alt=path.join(__dirname,pathname);
    if(fs.existsSync(alt)) filePath=alt;
  }
  fs.stat(filePath,(err,stat)=>{
    if(err||!stat.isFile()){
      const fallback=path.join(BASE_DIR,'index.html');
      if(fs.existsSync(fallback) && !path.extname(pathname)){
        const data=fs.readFileSync(fallback); res.writeHead(200,{'Content-Type':'text/html'}); return res.end(data);
      }
      res.writeHead(404,{'Content-Type':'text/plain'}); return res.end('Not found '+pathname);
    }
    const ext=path.extname(filePath).toLowerCase();
    const mime={'.html':'text/html','.js':'application/javascript','.json':'application/json','.css':'text/css'}[ext]||'application/octet-stream';
    fs.readFile(filePath,(e,d)=>{ if(e){ res.writeHead(500); return res.end('error'); } res.writeHead(200,{'Content-Type':mime}); res.end(d); });
  });
}

function parseBody(req){
  return new Promise((res,rej)=>{ let b=''; req.on('data',c=>b+=c); req.on('end',()=>{ try{ res(b?JSON.parse(b):{}); }catch(e){ rej(new Error('JSON inválido')); } }); req.on('error',rej); });
}

const server=http.createServer(async (req,res)=>{
  if(req.method==='OPTIONS'){ res.writeHead(204,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PUT,OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization'}); return res.end(); }
  const parsed=url.parse(req.url,true);
  if(parsed.pathname.startsWith('/api/')){
    try{
      if(parsed.pathname==='/api/status' && req.method==='GET'){
        const base=path.join(BASE_DIR,'login','contas');
        let count=0; try{ count=fs.readdirSync(base).filter(f=>!f.startsWith('.')).length; }catch{}
        return json(res,200,{mode:'node',root:true,tokenActive:!!GH_TOKEN,contas:count,port:PORT,time:new Date().toISOString()});
      }
      if(parsed.pathname==='/api/criar-conta' && req.method==='POST'){
        const dados=await parseBody(req);
        const pastaMae=dados.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,24)||'usuario';
        const arquivo=pastaMae+'.json';
        const dir=path.join(BASE_DIR,'login','contas',pastaMae);
        fs.mkdirSync(dir,{recursive:true});
        const conta={...dados,pastaMae,arquivo,id:pastaMae+'_'+Date.now(),sistema:'KORVIL',createdAt:new Date().toISOString()};
        fs.writeFileSync(path.join(dir,arquivo),JSON.stringify(conta,null,2),'utf-8');
        console.log('[KORVIL RAIZ] pasta mãe criada REAL',pastaMae);
        return json(res,200,{ok:true,conta});
      }
      if(parsed.pathname==='/api/login' && req.method==='POST'){
        const {email}=await parseBody(req);
        const base=path.join(BASE_DIR,'login','contas');
        try{
          const pastas=fs.readdirSync(base).filter(f=>{ try{return fs.statSync(path.join(base,f)).isDirectory();}catch{return false;}});
          for(const p of pastas){
            const fp=path.join(base,p,p+'.json');
            if(fs.existsSync(fp)){ const j=JSON.parse(fs.readFileSync(fp,'utf-8')); if(j.email&&j.email.toLowerCase()===String(email).toLowerCase()) return json(res,200,{ok:true,conta:j}); }
          }
        }catch{}
        return json(res,404,{error:'Conta não encontrada'});
      }
      if(parsed.pathname==='/api/listar-contas' && req.method==='GET'){
        const base=path.join(BASE_DIR,'login','contas');
        let contas=[]; try{ const pastas=fs.readdirSync(base).filter(f=>fs.statSync(path.join(base,f)).isDirectory()); contas=pastas.map(p=>{ try{return JSON.parse(fs.readFileSync(path.join(base,p,p+'.json'),'utf-8'));}catch{return null;}}).filter(Boolean);}catch{}
        return json(res,200,{ok:true,contas});
      }
      return json(res,404,{error:'api not found'});
    }catch(e){ return json(res,500,{error:e.message}); }
  }
  serveStatic(req,res);
});

server.listen(PORT,()=>console.log('[KORVIL RAIZ] http://localhost:'+PORT+' tokenActive='+!!GH_TOKEN+' base='+BASE_DIR));
