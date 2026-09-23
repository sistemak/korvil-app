import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const GH_TOKEN = process.env.GH_TOKEN;
const REPO_OWNER = 'sistemak';
const REPO_NAME = 'korvil-app';

app.use(cors());
app.use(express.json({limit:'5mb'}));
app.use(express.static(path.join(__dirname)));

function gerarNomePasta(nomeCompleto){
  const n = nomeCompleto.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const partes = n.split(/\s+/).filter(Boolean);
  if(partes.length===0) return '';
  if(partes.length===1) return partes[0].replace(/[^a-z0-9]/g,'');
  const primeiro = partes[0].replace(/[^a-z0-9]/g,'');
  const iniciais = partes.slice(1).map(p=> (p[0]||'').replace(/[^a-z0-9]/g,'')).filter(Boolean).join('_');
  return primeiro + (iniciais? '_' + iniciais : '');
}

app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname,'korvil','sections','korvil-loja','index.html'));
});
app.get('/login', (req,res)=>{
  res.sendFile(path.join(__dirname,'korvil','sections','korvil-loja','login','index.html'));
});

app.post('/criar-conta', async (req,res)=>{
  try{
    const {nome,email,senha} = req.body;
    if(!nome || nome.length<3) return res.status(400).json({error:'Nome min 3'});
    if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({error:'Email inválido'});
    if(!senha || senha.length<6) return res.status(400).json({error:'Senha min 6'});
    const pasta = gerarNomePasta(nome);
    const id = Date.now().toString(36)+Math.random().toString(36).slice(2);
    const criado_em = new Date().toISOString();
    const senha_hash = Buffer.from(senha).toString('base64');
    const jsonData = {id,pasta,nome,email,senha_hash,criado_em,primeiro_uso:true,origem:'server-node'};

    if(!GH_TOKEN) return res.status(500).json({error:'GH_TOKEN não configurado'});

    const octokit = new Octokit({auth: GH_TOKEN});
    const pathRepo = `korvil/sections/korvil-loja/login/contas/${pasta}/${pasta}.json`;
    let sha;
    try{
      const {data} = await octokit.repos.getContent({owner:REPO_OWNER,repo:REPO_NAME,path:pathRepo});
      if(!Array.isArray(data)) sha=data.sha;
    }catch(e){ /* não existe ainda */ }

    const content = Buffer.from(JSON.stringify(jsonData,null,2)).toString('base64');
    await octokit.repos.createOrUpdateFileContents({
      owner:REPO_OWNER,repo:REPO_NAME,path:pathRepo,
      message:`KORVIL AUTO [server]: nova conta ${pasta} - ${email}`,
      content, sha, branch:'main'
    });

    res.json({ok:true,pasta,path:pathRepo,jsonData});
  }catch(err){
    console.error(err);
    res.status(500).json({error:err.message});
  }
});

app.post('/login', async (req,res)=>{
  // apenas valida localmente - o front já faz permanente via localStorage
  const {email,senha} = req.body;
  if(!email || !senha) return res.status(400).json({error:'Falta email/senha'});
  res.json({ok:true,message:'Use localStorage korvil_user no front para permanente'});
});

app.listen(PORT, ()=> console.log(`KORVIL LOJA ULTRA rodando http://localhost:${PORT} | GH_TOKEN ${GH_TOKEN?'OK':'FALTANDO'}`));
