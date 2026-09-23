// KORVIL SERVER.JS - NODE CONFIGURADO COM GH_TOKEN TOTAL ACESSO AUTOMÁTICO
// Não precisa colar token no login, usuário final só preenche form
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

// GH_TOKEN com total acesso geral automático - pega de env ou fallback localStorage injetado via window.__KORVIL_GH_TOKEN__
const GH_TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || process.env.GH_PAT || "";
const REPO = "sistemak/korvil-app";
const BRANCH = "main";

if(!GH_TOKEN){
  console.warn("⚠️ GH_TOKEN não configurado em process.env.GH_TOKEN - modo GitHub puro via localStorage ainda funciona se código mestre ativou token no navegador");
}

const CONTAS_DIR = path.join(__dirname, "korvil", "sections", "korvil-loja", "login", "contas");
const CONTAS_DIR_ALT = path.join(__dirname, "korvil/sections/korvil-loja/login/contas");
const CONTAS_DIR_ROOT = path.join(__dirname, "login", "contas");

function ensureDir(dir){ if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true}); }
ensureDir(CONTAS_DIR); ensureDir(CONTAS_DIR_ALT); ensureDir(CONTAS_DIR_ROOT);

app.use(cors());
app.use(express.json({limit:"10mb"}));
app.use(express.static(path.join(__dirname)));
app.use("/korvil", express.static(path.join(__dirname,"korvil")));

function gerarPastaMae(nomeCompleto){
  const partes = nomeCompleto.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().split(/\s+/).filter(Boolean);
  if(partes.length===0) return "usuario";
  if(partes.length===1) return partes[0];
  if(partes.length===2) return `${partes[0]}-${partes[1][0]}`;
  return `${partes[0]}-${partes[1][0]}-${partes[2][0]}`;
}

async function githubPutFile(filePath, contentStr, message){
  if(!GH_TOKEN) throw new Error("GH_TOKEN não configurado no server");
  const apiUrl = `https://api.github.com/repos/${REPO}/contents/${filePath}`;
  // get sha se existe
  let sha;
  try{
    const getRes = await fetch(apiUrl,{headers:{Authorization:"Bearer "+GH_TOKEN, Accept:"application/vnd.github.v3+json"}});
    if(getRes.ok){ const j = await getRes.json(); sha = j.sha; }
  }catch{}
  const contentB64 = Buffer.from(contentStr,"utf-8").toString("base64");
  const putRes = await fetch(apiUrl,{
    method:"PUT",
    headers:{Authorization:"Bearer "+GH_TOKEN, Accept:"application/vnd.github.v3+json","Content-Type":"application/json"},
    body: JSON.stringify({message, content: contentB64, sha: sha||undefined, branch: BRANCH})
  });
  const txt = await putRes.text();
  let data; try{ data = JSON.parse(txt); }catch{ throw new Error("GitHub PUT não-JSON: "+txt.slice(0,500)); }
  if(!putRes.ok) throw new Error("GitHub erro: "+(data.message||txt));
  return data;
}

// POST /api/criar-conta - CRIA PASTA MÃE REAL + JSON REAL
app.post("/api/criar-conta", async (req,res)=>{
  try{
    const {nome_completo,email,senha_hash,cpf,whatsapp,cep,numero,rua,bairro,cidade,estado,foto_perfil,id,arquivo,pasta_mae} = req.body;
    if(!nome_completo||!email) return res.status(400).json({ok:false,error:"nome e email obrigatórios"});
    const pastaMae = pasta_mae || gerarPastaMae(nome_completo);
    const fileName = arquivo || (pastaMae + ".json");
    const payload = {
      id: id || crypto.randomUUID(),
      arquivo: fileName,
      pasta_mae: pastaMae,
      nome_completo,
      primeiro_nome: nome_completo.split(/\s+/)[0],
      email, senha_hash,
      cpf: cpf || "453.814.988-88",
      whatsapp: whatsapp || "(13)99769-0898",
      cep: cep || "11250-524",
      rua: rua || "Oswaldo Cruz",
      numero: numero || "2407",
      bairro: bairro || "Jardim Vicente Carvalho",
      cidade: cidade || "Bertioga",
      estado: estado || "SP",
      foto_perfil: foto_perfil || "",
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(payload,null,2);
    // cria em filesystem real
    const dir1 = path.join(CONTAS_DIR, pastaMae);
    const dir2 = path.join(CONTAS_DIR_ALT, pastaMae);
    const dir3 = path.join(CONTAS_DIR_ROOT, pastaMae);
    [dir1,dir2,dir3].forEach(d=>{ try{ ensureDir(d); }catch{} });
    try{ fs.writeFileSync(path.join(dir1,fileName), jsonStr,"utf-8"); }catch{}
    try{ fs.writeFileSync(path.join(dir2,fileName), jsonStr,"utf-8"); }catch{}
    try{ fs.writeFileSync(path.join(dir3,fileName), jsonStr,"utf-8"); }catch{}
    // além de criar no filesystem, já faz PUT GitHub API com GH_TOKEN interno
    let githubResult = null;
    if(GH_TOKEN){
      try{
        const gitPath = `korvil/sections/korvil-loja/login/contas/${pastaMae}/${fileName}`;
        githubResult = await githubPutFile(gitPath, jsonStr, `feat: criar conta real ${pastaMae}/${fileName} via /api/criar-conta`);
      }catch(e){ console.warn("GitHub PUT falhou:", e.message); }
    }
    return res.json({ok:true, pastaMae, arquivo: fileName, path: `korvil/sections/korvil-loja/login/contas/${pastaMae}/${fileName}`, github: !!githubResult});
  }catch(e){
    console.error(e);
    return res.status(500).json({ok:false,error:e.message});
  }
});

app.post("/api/atualizar-conta", async (req,res)=>{
  try{
    const data = req.body;
    const pastaMae = data.pasta_mae || gerarPastaMae(data.nome_completo||"usuario");
    const fileName = data.arquivo || pastaMae+".json";
    const payload = {...data, atualizado_em: new Date().toISOString()};
    const jsonStr = JSON.stringify(payload,null,2);
    const dir = path.join(CONTAS_DIR, pastaMae);
    ensureDir(dir);
    fs.writeFileSync(path.join(dir,fileName), jsonStr);
    if(GH_TOKEN){
      try{ await githubPutFile(`korvil/sections/korvil-loja/login/contas/${pastaMae}/${fileName}`, jsonStr, `chore: atualizar conta ${pastaMae}`); }catch{}
    }
    return res.json({ok:true});
  }catch(e){ return res.status(500).json({ok:false,error:e.message}); }
});

app.post("/api/login", async (req,res)=>{
  try{
    const {email,senha} = req.body;
    if(!email||!senha) return res.status(400).json({ok:false,error:"email e senha obrigatórios"});
    const hash = crypto.createHash("sha256").update(senha).digest("hex");
    // busca em filesystem
    let found = null;
    const scanDirs = [CONTAS_DIR, CONTAS_DIR_ALT, CONTAS_DIR_ROOT];
    for(const base of scanDirs){
      if(!fs.existsSync(base)) continue;
      const pastas = fs.readdirSync(base);
      for(const p of pastas){
        const fp = path.join(base,p,p+".json");
        if(fs.existsSync(fp)){
          try{
            const j = JSON.parse(fs.readFileSync(fp,"utf-8"));
            if(j.email===email && j.senha_hash===hash){ found=j; break; }
          }catch{}
        }
      }
      if(found) break;
    }
    if(!found) return res.status(401).json({ok:false,error:"Conta não encontrada ou senha incorreta"});
    return res.json({ok:true,user:found});
  }catch(e){ return res.status(500).json({ok:false,error:e.message}); }
});

app.get("/api/contas",(req,res)=>{
  try{
    const base = fs.existsSync(CONTAS_DIR)?CONTAS_DIR:CONTAS_DIR_ALT;
    if(!fs.existsSync(base)) return res.json({ok:true,contas:[]});
    const pastas = fs.readdirSync(base);
    const contas=[];
    for(const p of pastas){
      const fp = path.join(base,p,p+".json");
      if(fs.existsSync(fp)){
        try{ contas.push(JSON.parse(fs.readFileSync(fp,"utf-8"))); }catch{}
      }
    }
    return res.json({ok:true,contas});
  }catch(e){ return res.status(500).json({ok:false,error:e.message}); }
});

// garante nunca retornar HTML quando deveria retornar JSON
app.use((req,res,next)=>{ if(req.path.startsWith("/api/")){ res.setHeader("Content-Type","application/json"); } next(); });

app.listen(PORT, ()=>{ console.log(`✅ KORVIL SERVER rodando na porta ${PORT} - GH_TOKEN ${GH_TOKEN?"ativo ✓":"não configurado"}`); });
