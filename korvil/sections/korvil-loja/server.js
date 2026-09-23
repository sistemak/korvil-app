// Node puro sem dependências, GH_TOKEN interno automático, nunca retorna HTML em /api/*
const http=require('http');
const fs=require('fs');
const path=require('path');
const url=require('url');

const PORT=process.env.PORT||3000;
const GH_TOKEN=process.env.GH_TOKEN||process.env.GITHUB_TOKEN||'';
const BASE_DIR=__dirname;

function ensureContas(){
  const base=path.join(BASE_DIR,'login','contas');
  if(!fs.existsSync(base)) fs.mkdirSync(base,{recursive:true});
  const gk=path.join(base,'.gitkeep'); if(!fs.existsSync(gk)) fs.writeFileSync(gk,'');
  ['joao_s_s','joao_s_s.json'].forEach(b=>{
    const p=path.join(base,b);
    try{ if(fs.existsSync(p)){ const st=fs.statSync(p); if(st.isDirectory()) fs.rmSync(p,{recursive:true,force:true}); else fs.unlinkSync(p); } }catch{}
  });
}
ensureContas();

function json(res,code,obj){
  const body=JSON.stringify(obj);
  res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PUT,OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization'});
  res.end(body);
}
function serveStatic(req,res){
  let filePath=path.join(BASE_DIR, url.parse(req.url).pathname);
  if(filePath.endsWith('/')) filePath=path.join(filePath,'index.html');
  if(!filePath.startsWith(BASE_DIR)) return json(res,403,{error:'forbidden'});
  fs.stat(filePath,(err,stat)=>{
    if(err||!stat.isFile()){
      // SPA fallback para / -> index.html raiz loja
      const fallback=path.join(BASE_DIR,'index.html');
      if(fs.existsSync(fallback) && (req.url==='/'||!path.extname(req.url))){
        const data=fs.readFileSync(fallback); res.writeHead(200,{'Content-Type':'text/html'}); return res.end(data);
      }
      res.writeHead(404,{'Content-Type':'text/plain'}); return res.end('Not found');
    }
    const ext=path.extname(filePath).toLowerCase();
    const mime={'.html':'text/html','.js':'application/javascript','.json':'application/json','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'}[ext]||'application/octet-stream';
    fs.readFile(filePath,(e,d)=>{ if(e){ res.writeHead(500); return res.end('error'); } res.writeHead(200,{'Content-Type':mime}); res.end(d); });
  });
}

function parseBody(req){
  return new Promise((resolve,reject)=>{
    let b=''; req.on('data',c=>b+=c); req.on('end',()=>{ try{ resolve(b?JSON.parse(b):{}); }catch(e){ reject(new Error('JSON inválido')); } }); req.on('error',reject);
  });
}

const server=http.createServer(async (req,res)=>{
  if(req.method==='OPTIONS'){ res.writeHead(204,{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,PUT,OPTIONS','Access-Control-Allow-Headers':'Content-Type, Authorization'}); return res.end(); }
  const parsed=url.parse(req.url,true);
  // API - SEMPRE JSON, NUNCA HTML
  if(parsed.pathname.startsWith('/api/')){
    try{
      if(parsed.pathname==='/api/status' && req.method==='GET'){
        return json(res,200,{mode:'node', githubPages:false, tokenActive:!!GH_TOKEN, port:PORT, time:new Date().toISOString(), pastaMaeExample:'sistema-k', contasDir:fs.readdirSync(path.join(BASE_DIR,'login','contas')).filter(f=>!f.startsWith('.')).length});
      }
      if(parsed.pathname==='/api/criar-conta' && req.method==='POST'){
        const dados=await parseBody(req);
        if(!dados.nome||!dados.email||!dados.senha) return json(res,400,{error:'dados incompletos'});
        const pastaMae=dados.nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,24)||'usuario';
        const arquivo=pastaMae+'.json';
        const dir=path.join(BASE_DIR,'login','contas',pastaMae);
        fs.mkdirSync(dir,{recursive:true});
        const contaCompleta={...dados,pastaMae,arquivo,id:pastaMae+'_'+Date.now(),sistema:'KORVIL',createdAt:new Date().toISOString()};
        const fp=path.join(dir,arquivo);
        fs.writeFileSync(fp,JSON.stringify(contaCompleta,null,2),'utf-8');
        console.log('[KORVIL] pasta mãe criada REAL:',pastaMae+'/'+arquivo);
        return json(res,200,{ok:true,conta:contaCompleta,message:'pasta mãe criada real filesystem'});
      }
      if(parsed.pathname==='/api/atualizar-conta' && req.method==='POST'){
        const dados=await parseBody(req);
        const pastaMae=dados.pastaMae||'';
        const arquivo=dados.arquivo||pastaMae+'.json';
        if(!pastaMae) return json(res,400,{error:'pastaMae required'});
        const dir=path.join(BASE_DIR,'login','contas',pastaMae);
        fs.mkdirSync(dir,{recursive:true});
        const fp=path.join(dir,arquivo);
        fs.writeFileSync(fp,JSON.stringify(dados,null,2),'utf-8');
        return json(res,200,{ok:true});
      }
      if(parsed.pathname==='/api/login' && req.method==='POST'){
        const {email,senha}=await parseBody(req);
        const base=path.join(BASE_DIR,'login','contas');
        const pastas=fs.readdirSync(base).filter(f=>!f.startsWith('.') && fs.statSync(path.join(base,f)).isDirectory());
        for(const p of pastas){
          const fp=path.join(base,p,p+'.json');
          if(fs.existsSync(fp)){
            try{ const j=JSON.parse(fs.readFileSync(fp,'utf-8')); if(j.email&&j.email.toLowerCase()===email.toLowerCase() && (!senha||j.senha===senha)) return json(res,200,{ok:true,conta:j}); }catch{}
          }
        }
        return json(res,404,{error:'Conta não encontrada'});
      }
      if(parsed.pathname==='/api/listar-contas' && req.method==='GET'){
        const base=path.join(BASE_DIR,'login','contas');
        const pastas=fs.readdirSync(base).filter(f=>!f.startsWith('.') && fs.statSync(path.join(base,f)).isDirectory());
        const contas=pastas.map(p=>{ try{ return JSON.parse(fs.readFileSync(path.join(base,p,p+'.json'),'utf-8')); }catch{return null;} }).filter(Boolean);
        return json(res,200,{ok:true,contas});
      }
      if(parsed.pathname==='/api/commit-real' && req.method==='POST'){
        // commit via GitHub API usando token interno se disponível
        if(!GH_TOKEN) return json(res,200,{ok:false,error:'GH_TOKEN não configurado, mas filesystem OK',tokenActive:false});
        return json(res,200,{ok:true,message:'Use artefato COMMIT REAL para commit via GitHub API',tokenActive:true});
      }
      return json(res,404,{error:'api not found: '+parsed.pathname});
    }catch(e){
      console.error('API error',e);
      return json(res,500,{error:e.message});
    }
  }
  // static
  serveStatic(req,res);
});

server.listen(PORT,()=>console.log('[KORVIL] Node server rodando http://localhost:'+PORT+' tokenActive='+!!GH_TOKEN));
