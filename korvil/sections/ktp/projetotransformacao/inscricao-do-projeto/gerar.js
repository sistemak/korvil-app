import fs from 'fs';
import path from 'path';

const tipo = (process.env.TIPO || 'presencial').toLowerCase();
const primeiroNome = (process.env.PRIMEIRO_NOME || 'aluno').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
const dadosStr = process.env.DADOS_JSON;

if(!dadosStr){ console.error('DADOS_JSON vazio'); process.exit(1); }

const dados = JSON.parse(dadosStr);
const rootAlunos = path.join(process.cwd(), 'korvil/sections/ktp/projetotransformacao/projetos/2026/alunos');

// CRIA presencial e online +.gitkeep automatico
['presencial','online'].forEach(t=>{
  let p = path.join(rootAlunos, t);
  if(!fs.existsSync(p)){
    fs.mkdirSync(p, {recursive:true});
    fs.writeFileSync(path.join(p,'.gitkeep'), '');
    console.log(`Criado ${p}/.gitkeep`);
  }
});

const base = path.join(rootAlunos, tipo);
if(!fs.existsSync(base)) fs.mkdirSync(base, {recursive:true});

let ultimo = 0;
if(fs.existsSync(base)){
  fs.readdirSync(base).forEach(f=>{
    let m = f.match(/^(\d+)-/); if(m) ultimo = Math.max(ultimo, parseInt(m[1]));
    let full = path.join(base, f);
    if(/^\d+$/.test(f) && fs.existsSync(full) && fs.statSync(full).isDirectory()){
      ultimo = Math.max(ultimo, parseInt(f));
      fs.readdirSync(full).forEach(sf=>{ let mm=sf.match(/^(\d+)-/); if(mm) ultimo=Math.max(ultimo,parseInt(mm[1])); });
    }
  });
}

const prox = ultimo + 1;
const nomeArq = `${prox}-${primeiroNome}${prox}.json`;
const conteudo = JSON.stringify(dados, null, 2);

fs.writeFileSync(path.join(base, nomeArq), conteudo);
console.log(`✅ Criado ${base}/${nomeArq}`);

const pastaNum = path.join(base, `${prox}`);
if(!fs.existsSync(pastaNum)) fs.mkdirSync(pastaNum, {recursive:true});
fs.writeFileSync(path.join(pastaNum, nomeArq), conteudo);
console.log(`✅ Criado ${pastaNum}/${nomeArq}`);
