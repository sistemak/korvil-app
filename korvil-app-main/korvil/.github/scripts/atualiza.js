//.github/scripts/atualiza.js - UNIVERSAL v44 - S.O.K - serve pra TODAS as coisas
const fs = require('fs');
const path = require('path');

function safe(s){ return String(s||'').trim().slice(0,200); }

let dados;
try{
  let raw = process.argv[2];
  if(!raw) throw new Error('sem dados');
  // aceita base64 OU json direto (seu workflow_dispatch manda json)
  try{
    dados = JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'));
  }catch{
    dados = JSON.parse(raw); // tenta json direto
  }
}catch(e){
  console.error('ERRO: dados inválido, precisa ser base64 ou json:', e.message);
  process.exit(1);
}

console.log('ATUALIZA UNIVERSAL - dados:', Object.keys(dados));

// ===== 1) SE FOR ALUNO - atualiza cronograma-de-alunos.json (seu código atual) =====
if(dados.nome || dados.aluno){
  const arquivoPath = path.join(process.cwd(), 'cronograma-de-alunos.json');
  if(fs.existsSync(arquivoPath)){
    try{
      let arq = fs.readFileSync(arquivoPath, 'utf8');
      const mAlunos = arq.match(/let ALUNOS_DB = ({[\s\S]*?});/);
      const mCron = arq.match(/let CRONOGRAMA_DB = ({[\s\S]*?});/);
      if(mAlunos && mCron){
        let ALUNOS_DB = JSON.parse(mAlunos[1].replace(/(\w+):/g,'"$1":'));
        let CRONOGRAMA_DB = JSON.parse(mCron[1].replace(/(\w+):/g,'"$1":'));

        const nomeLower = safe(dados.nome||dados.aluno).toLowerCase();
        let idExistente = Object.keys(ALUNOS_DB).find(k => (ALUNOS_DB[k].nome||'').toLowerCase() === nomeLower);
        const planoKey = dados.plano || "PRESENCIAL";

        if(idExistente){
          ALUNOS_DB[idExistente].nome = dados.nome||dados.aluno;
          for(let p in CRONOGRAMA_DB){
            (CRONOGRAMA_DB[p]||[]).forEach(b=>{
              let i = (b.alunos||[]).findIndex(a=>a.id===idExistente);
              if(i!==-1) b.alunos[i].aluno = dados.nome||dados.aluno;
            });
          }
        } else {
          const ultimoIdNum = Math.max(0,...Object.keys(ALUNOS_DB).map(k=>parseInt(k.replace(/\D/g,''))||0));
          const novoId = "aluno" + (ultimoIdNum + 1);
          const ultimoN = Math.max(0,...Object.values(CRONOGRAMA_DB).flatMap(p=>p.flatMap(b=> (b.alunos||[]).map(a=>a.n||0))));
          ALUNOS_DB[novoId] = {nome: dados.nome||dados.aluno, tipo: "ALUNO"};
          if(!CRONOGRAMA_DB[planoKey]) CRONOGRAMA_DB[planoKey] = [{status:"ATIVOS", alunos:[]}];
          let bloco = CRONOGRAMA_DB[planoKey].find(b=>b.status==="ATIVOS") || {status:"ATIVOS", alunos:[]};
          if(!CRONOGRAMA_DB[planoKey].includes(bloco)) CRONOGRAMA_DB[planoKey].push(bloco);
          bloco.alunos.push({n:ultimoN+1, id:novoId,...dados, aluno:dados.nome||dados.aluno});
        }

        const backup = arquivoPath + '.bak-' + Date.now();
        fs.writeFileSync(backup, arq);
        arq = arq.replace(/let ALUNOS_DB = {[\s\S]*?};/, 'let ALUNOS_DB = ' + JSON.stringify(ALUNOS_DB, null, 2) + ';');
        arq = arq.replace(/let CRONOGRAMA_DB = {[\s\S]*?};/, 'let CRONOGRAMA_DB = ' + JSON.stringify(CRONOGRAMA_DB, null, 2) + ';');
        fs.writeFileSync(arquivoPath, arq);
        console.log('✅ cronograma-de-alunos.json atualizado');
      }
    }catch(e){ console.error('erro cronograma:', e.message); }
  }
}

// ===== 2) SE FOR QUALQUER OUTRA COISA - atualiza index da pasta =====
// Ex: dados.pasta = "sections/korvil-loja/parceiros" ou "sections/sistema-k/produtos"
if(dados.pasta){
  try{
    const pastaSafe = String(dados.pasta).replace(/\.\./g,'').replace(/[^a-zA-Z0-9/_-]/g,'');
    const fullPasta = path.join(process.cwd(), pastaSafe);
    if(fs.existsSync(fullPasta)){
      // lista todos json da pasta e gera um index.json
      const arquivos = fs.readdirSync(fullPasta).filter(f=>f.endsWith('.json'));
      const indexPath = path.join(fullPasta, 'index.json');
      const index = arquivos.map(f=>{
        try{ return JSON.parse(fs.readFileSync(path.join(fullPasta,f),'utf8')); }catch{ return {arquivo:f}; }
      });
      fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
      console.log(`✅ index.json atualizado em ${pastaSafe} com ${arquivos.length} itens`);
    }
  }catch(e){ console.error('erro index:', e.message); }
}

// ===== 3) SEMPRE - log do que foi feito =====
console.log('ATUALIZA UNIVERSAL FINALIZADO - serve pra tudo que você colocar');
