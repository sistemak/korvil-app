// K-B.D v44 - 2026-09-17T08:32:43.824Z
export const korvilDB = {
  mem: JSON.parse(localStorage.getItem('korvil-db')||'[]'),
  criar(d){ d.id=Date.now(); d.path='korvil/'+d.nicho.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'/index.html'; this.mem.push(d); localStorage.setItem('korvil-db',JSON.stringify(this.mem)); this.autoCommit(d); return d; },
  async autoCommit(item){
    let token=localStorage.getItem('GH_TOKEN')||localStorage.getItem('gh_token')||'';
    if(!token) return;
    let p=item.path;
    let html='<!DOCTYPE html><html><head><meta charset="UTF-8"><title>'+item.nicho+' - K-B.D v44</title></head><body><h1>'+item.nicho+' - K-B.D v44</h1></body></html>';
    let b64=btoa(unescape(encodeURIComponent(html)));
    try{ let g=await fetch('https://api.github.com/repos/sistemak/korvil-app/contents/'+p,{headers:{Authorization:'token '+token}}); let sha=null; if(g.ok) sha=(await g.json()).sha; await fetch('https://api.github.com/repos/sistemak/korvil-app/contents/'+p,{method:'PUT',headers:{Authorization:'token '+token,'Content-Type':'application/json'},body:JSON.stringify({message:'K-B.D v44: '+p,content:b64,sha,branch:'main'})}); }catch(e){}
  },
  listar(){return this.mem;}
};