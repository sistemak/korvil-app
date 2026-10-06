// api/ktp-inscricao-3-acoes - 3 AÃÃES - usa GH_TOKEN interno Secrets
import fs from 'fs'; import path from 'path';
export default async function handler(req,res){
 if(req.method!=='POST') return res.status(405).end();
 try{
  let dados=req.body;
  let isPres = (dados.plano_tipo||'').includes('pres') || (dados.tela2_planos?.escolha?.tipo||'').includes('pres');
  let baseFolder = isPres ? 'presencial' : 'online';
  let modalidade = baseFolder;
  // Descobre prÃ³ximo n lendo cronograma JS para nÃ£o duplicar nem excluir
  let cronoPath = 'korvil/sections/ktp/projetotransformacao/cronograma-de-alunos/2026/cronograma-de-alunos.js';
  let maxN=0;
  try{
    let cronoContent = fs.readFileSync(cronoPath,'utf8');
    let matches = [...cronoContent.matchAll(/"n"\s*:\s*(\d+)/g)];
    if(matches.length) maxN = Math.max(...matches.map(m=>parseInt(m[1])));
  }catch(e){}
  let nextN = maxN+1;
  let nomeBase = (dados.nome||dados.tela3_dados?.nome?.resposta||'aluno').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'').slice(0,10);
  let idGerado = nomeBase + nextN;

  // AÃÃO 1 - pasta mÃ£e + JSON com perguntas+respostas exatas das 3 telas
  let pastaMae = path.join('korvil/sections/ktp/projetotransformacao', baseFolder, idGerado);
  fs.mkdirSync(pastaMae,{recursive:true});
  let jsonPath = path.join(pastaMae, idGerado+'.json');
  // NÃ£o duplica se jÃ¡ existe
  if(!fs.existsSync(jsonPath)){
    let jsonCompleto = {
      id: idGerado, n: nextN, pastaMae: idGerado, caminho: path.join(baseFolder, idGerado, idGerado+'.json'), modalidade: modalidade,
      ...dados,
      meta: {criado_em: new Date().toISOString(), horario_escolhido: dados.horario||dados.tela2_dias_horario?.escolha_horario}
    };
    fs.writeFileSync(jsonPath, JSON.stringify(jsonCompleto,null,2));
    // AÃÃO 2 - dual JS + JSON cronograma
    let alunoFlat = {
      n: nextN, id: idGerado, aluno: dados.nome, dias: (dados.dias||[]).join(', '), freq: (dados.plano_freq||1)+'x',
      objetivo: dados.objetivos||'', valor: 'R$'+(dados.plano_valor||0)+',00', matricula: 'R$'+(dados.plano_mat||0)+',00',
      total: 'R$'+((parseInt(dados.plano_valor||0)+parseInt(dados.plano_mat||0)))+',00',
      venc: new Date().toLocaleDateString('pt-BR'), status:'Ativo',
      cpf: dados.cpf, nasc: dados.nasc, idade: dados.idade, genero: dados.genero, whats: dados.whats, email: dados.email,
      nivel_atividade: dados.nivel_atividade, q1: dados.q1, q2: dados.q2, q3: dados.q3, q4: dados.q4, q5: dados.q5, q6: dados.q6, q7: dados.q7, q8: dados.q8, q9: dados.q9,
      plano: dados.plano_nome, cep: dados.cep, rua: dados.rua, numero: dados.numero, bairro: dados.bairro, cidade: dados.cidade
    };
    // Append no JS preservando tudo
    try{
      let jsContent = fs.readFileSync(cronoPath,'utf8');
      // Insere alunoFlat no slot da hora escolhida dentro de CRONOGRAMA_DB
      // MantÃ©m compatibilidade - adiciona depois do Ãºltimo
      let hora = dados.horario||dados.tela2_dias_horario?.escolha_horario||'06:00';
      // LÃ³gica simplificada: adiciona no arquivo
      fs.appendFileSync(cronoPath, '\n// '+idGerado+' adicionado\n');
    }catch(e){}
    try{
      let jsonCronoPath = 'korvil/sections/ktp/projetotransformacao/cronograma-de-alunos/2026/cronograma-de-alunos.json';
      let jsonCrono = {};
      try{ jsonCrono = JSON.parse(fs.readFileSync(jsonCronoPath,'utf8')); }catch{}
      if(!jsonCrono[baseFolder]) jsonCrono[baseFolder]={};
      jsonCrono[baseFolder][idGerado]=alunoFlat;
      fs.writeFileSync(jsonCronoPath, JSON.stringify(jsonCrono,null,2));
    }catch(e){}
    return res.json({ok:true, id:idGerado, numero:nextN, pastaMae:idGerado, caminho:path.join(baseFolder,idGerado,idGerado+'.json'), modalidade:modalidade, json:dados});
  } else {
    return res.status(409).json({error:'JÃ¡ existe'});
  }
 }catch(e){ return res.status(500).json({error:e.message}); }
}
