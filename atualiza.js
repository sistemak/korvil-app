const fs = require('fs');
const dados = JSON.parse(Buffer.from(process.argv[2], 'base64').toString()); // DECODIFICA
let arq = fs.readFileSync('cronograma-de-alunos.json', 'utf8');

let ALUNOS_DB = JSON.parse(arq.match(/let ALUNOS_DB = ({[\s\S]*?});/)[1].replace(/(\w+):/g,'"$1":'));
let CRONOGRAMA_DB = JSON.parse(arq.match(/let CRONOGRAMA_DB = ({[\s\S]*?});/)[1].replace(/(\w+):/g,'"$1":'));

const nomeLower = dados.nome.toLowerCase();
let idExistente = Object.keys(ALUNOS_DB).find(k => ALUNOS_DB[k].nome.toLowerCase() === nomeLower);
const planoKey = "PRESENCIAL";

if(idExistente){
  ALUNOS_DB[idExistente].nome = dados.nome;
  for(let p in CRONOGRAMA_DB){
    CRONOGRAMA_DB[p].forEach(b=>{
      let i = b.alunos.findIndex(a=>a.id===idExistente);
      if(i!==-1) b.alunos[i].aluno = dados.nome;
    })
  }
} else {
  const ultimoIdNum = Math.max(...Object.keys(ALUNOS_DB).map(k=>parseInt(k.replace(/\D/g,''))||0));
  const novoId = "aluno" + (ultimoIdNum + 1);
  const ultimoN = Math.max(...Object.values(CRONOGRAMA_DB).flatMap(p=>p.flatMap(b=>b.alunos)).map(a=>a.n)||0);
  const novoN = ultimoN + 1;

  ALUNOS_DB[novoId] = {nome: dados.nome, tipo: "ALUNO"};

  let bloco = CRONOGRAMA_DB[planoKey].find(b=>b.status==="ATIVOS");
  bloco.alunos.push({n:novoN, id:novoId,...dados, aluno:dados.nome});
}

arq = arq.replace(/let ALUNOS_DB = {[\s\S]*?};/, 'let ALUNOS_DB = ' + JSON.stringify(ALUNOS_DB, null, 2) + ';');
arq = arq.replace(/let CRONOGRAMA_DB = {[\s\S]*?};/, 'let CRONOGRAMA_DB = ' + JSON.stringify(CRONOGRAMA_DB, null, 2) + ';');
fs.writeFileSync('cronograma-de-alunos.json', arq);
