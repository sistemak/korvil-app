const http=require('http');
const fs=require('fs');
const path=require('path');
const PORT=process.env.PORT||3000;
const ROOT=path.join(__dirname);
const mime={'.html':'text/html','.js':'text/javascript','.json':'application/json','.css':'text/css','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'};
function serve(res,filePath){fs.readFile(filePath,(err,data)=>{if(err){res.writeHead(404);res.end('Not found');return;}const ext=path.extname(filePath);res.writeHead(200,{'Content-Type':mime[ext]||'text/plain'});res.end(data);});}
const server=http.createServer((req,res)=>{let p=req.url.split('?')[0]; if(p==='/') p='/korvil/sections/korvil-loja/index.html'; if(p==='/login') p='/korvil/sections/korvil-loja/login/index.html'; const filePath=path.join(ROOT,p); if(!filePath.startsWith(ROOT)){res.writeHead(403);res.end('Forbidden');return;} fs.stat(filePath,(err,stats)=>{if(err){res.writeHead(404);res.end('404 - KORVIL');return;} if(stats.isDirectory()){const idx=path.join(filePath,'index.html'); fs.access(idx,fs.constants.F_OK,(e)=>{if(!e) serve(res,idx); else {res.writeHead(200,{'Content-Type':'text/html'});res.end('<h1>KORVIL - '+p+'</h1>');}});} else serve(res,filePath);});});
server.listen(PORT,()=>{console.log('KORVIL server running at http://localhost:'+PORT);});