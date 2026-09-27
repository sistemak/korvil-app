// korvil/sections/korvil-loja/server.js - mesmo lógica GH_TOKEN interno automático
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const GH_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
const app = express();
app.use(express.json({limit:'15mb'}));
const CONTAS_DIR = path.join(__dirname, 'login/contas');
function ensureDir(p){ fs.mkdirSync(p,{recursive:true}); }
function gerarPastaMae(nome){ const n=nome.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim(); const parts=n.split(/\s+/).filter(Boolean); let r=parts.length===1?parts[0]:parts.length===2?parts[0]+'-'+parts[1][0]:parts[0]+'-'+parts[1][0]+'-'+parts[2][0]; return r.replace(/[^a-z0-9-]/g,'').replace(/--+/g,'-').replace(/^-+|-+$/g,''); }
function sha256(t){ return crypto.createHash('sha256').update(t).digest('hex'); }
app.post('/api/criar-conta', async (req,res)=>{
  const {nome_completo,email,senha,cpf,whatsapp,cep,rua,numero,bairro,cidade,estado,foto_perfil,pastaMae,arquivo}=req.body;
  const pm=pastaMae||gerarPastaMae(nome_completo);
  const arq=arquivo||pm+'.json';
  const conta={id:crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2), arquivo:arq, pasta_mae:pm, nome_completo:nome_completo.trim(), primeiro_nome:nome_completo.trim().split(/\s+/)[0], email:email.trim(), senha_hash:sha256(senha), cpf:(cpf||'').trim(), whatsapp:(whatsapp||'').trim(), cep:(cep||'').trim(), numero:(numero||'').trim(), rua:(rua||'').trim(), bairro:(bairro||'').trim(), cidade:(cidade||'').trim(), estado:(estado||'').trim().toUpperCase(), foto_perfil:foto_perfil||'', criado_em:new Date().toISOString(), atualizado_em:new Date().toISOString()};
  ensureDir(path.join(CONTAS_DIR,pm));
  fs.writeFileSync(path.join(CONTAS_DIR,pm,arq), JSON.stringify(conta,null,2));
  if(GH_TOKEN){
    try{ const filePathRepo='korvil/sections/korvil-loja/login/contas/'+pm+'/'+arq; const contentB64=Buffer.from(JSON.stringify(conta,null,2)).toString('base64'); const apiUrl='https://api.github.com/repos/sistemak/korvil-app/contents/'+filePathRepo; let sha=null; try{ const getRes=await fetch(apiUrl,{headers:{Authorization:'token '+GH_TOKEN}}); if(getRes.ok){const j=await getRes.json(); sha=j.sha;}}catch{} await fetch(apiUrl,{method:'PUT', headers:{Authorization:'token '+GH_TOKEN,'Content-Type':'application/json'}, body:JSON.stringify({message:'KORVIL: conta '+pm+' - '+conta.email, content:contentB64, branch:'main', ...(sha?{sha}:{})})}); }catch(e){ console.warn(e.message); }
  }
  res.json({ok:true,pastaMae:pm,arquivo:arq,path:'korvil/sections/korvil-loja/login/contas/'+pm+'/'+arq});
});
app.listen(process.env.PORT||3001, ()=>console.log('korvil-loja server GH_TOKEN interno '+(GH_TOKEN?'ativo':'off')));
