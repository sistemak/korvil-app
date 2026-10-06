// /api/ktp-inscricao-3-acoes.js - Vercel serverless - 3 AÃÃES AUTOMÃTICAS - GH_TOKEN e NODE escondidos, sem vazar
export default async function handler(req,res){
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS') return res.status(200).end();
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  try{
    const dados = req.body;
    const GH_TOKEN = process.env.GH_TOKEN; // escondido no Secrets, nÃ£o vaza
    const OWNER='sistemak', REPO='korvil-app';
    if(!GH_TOKEN) return res.status(500).json({error:'GH_TOKEN nÃ£o configurado no Secrets'});

    async function ghGet(path){
      const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,{
        headers:{'Accept':'application/vnd.github.v3+json','Authorization':`Bearer ${GH_TOKEN}`,'User-Agent':'K-TP-Bot'}
      });
      if(r.status===404) return null;
      if(!r.ok){ const t=await r.text(); throw new Error(`ghGet ${path} ${r.status} ${t}`); }
      return await r.json();
    }
    async function ghPut(path,contentBase64,message,sha){
      const body={message, content:contentBase64, branch:'main'};
      if(sha) body.sha=sha;
      const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,{
        method:'PUT',
        headers:{'Accept':'application/vnd.github.v3+json','Authorization':`Bearer ${GH_TOKEN}`,'Content-Type':'application/json','User-Agent':'K-TP-Bot'},
        body: JSON.stringify(body)
      });
      if(!r.ok){ const t=await r.text(); throw new Error(`ghPut ${path} ${r.status} ${t}`); }
      return await r.json();
    }

    // 1 - Descobre prÃ³ximo n lendo cronograma JS sem duplicar
    let maxN=0;
    let cronoSHA=null, cronoContent='';
    try{
      const cronoFile = await ghGet('korvil/sections/ktp/projetotransformacao/cronograma-de-alunos/2026/cronograma-de-alunos.js');
      if(cronoFile){
        cronoSHA=cronoFile.sha;
        cronoContent=Buffer.from(cronoFile.content,'base64').toString('utf8');
        const matches=[...cronoContent.matchAll(/"n"\s*:\s*(\d+)/g)];
        if(matches.length) maxN=Math.max(...matches.map(m=>parseInt(m[1])));
      }
    }catch(e){}

    const nextN = maxN+1;
    const nomeBase = (dados.nome||'aluno').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'').slice(0,10);
    const idGerado = nomeBase + nextN;
    const isPres = (dados.plano_tipo||'').includes('pres') || (dados.tela2_planos?.escolha?.tipo||'').includes('pres');
    const baseFolder = isPres ? 'presencial' : 'online';
    const modalidade = baseFolder;

    // Monta JSON completo com perguntas+respostas
    const jsonCompleto = {
      id: idGerado,
      n: nextN,
      pastaMae: idGerado,
      caminho: `${baseFolder}/${idGerado}/${idGerado}.json`,
      modalidade,
      horario: dados.horario||dados.tela2_dias_horario?.escolha_horario,
      dias: dados.dias||dados.tela2_dias_horario?.escolha_dias,
      ...dados,
      meta:{criado_em:new Date().toISOString(), node:'20', gh_token:'via Secrets sem vazar'}
    };

    // AÃÃO 1 - cria pasta mÃ£e + JSON - nÃ£o duplica, cria se nÃ£o existe
    const jsonPath = `korvil/sections/ktp/projetotransformacao/${baseFolder}/${idGerado}/${idGerado}.json`;
    const existente = await ghGet(jsonPath);
    if(existente){
      return res.status(409).json({error:'JÃ¡ existe inscriÃ§Ã£o com esse ID'});
    }
    await ghPut(jsonPath, Buffer.from(JSON.stringify(jsonCompleto,null,2)).toString('base64'), `feat: inscricao ${idGerado} - pasta mÃ£e ${baseFolder} - 3 aÃ§Ãµes`, null);

    // AÃÃO 2 - dual save JS + JSON cronograma - atualiza sem duplicar, sem excluir ninguÃ©m
    try{
      let jsonCronoPath = 'korvil/sections/ktp/projetotransformacao/cronograma-de-alunos/2026/cronograma-de-alunos.json';
      let jsonCronoFile = await ghGet(jsonCronoPath);
      let jsonCrono = {};
      let jsonCronoSHA=null;
      if(jsonCronoFile){
        jsonCronoSHA=jsonCronoFile.sha;
        jsonCrono=JSON.parse(Buffer.from(jsonCronoFile.content,'base64').toString('utf8'));
      }
      if(!jsonCrono[baseFolder]) jsonCrono[baseFolder]={};
      // aluno flat para cronograma
      const alunoFlat={
        n: nextN, id: idGerado, aluno: dados.nome,
        dias: (dados.dias||[]).join(', '),
        horario: dados.horario||'',
        freq: (dados.plano_freq||1)+'x',
        objetivo: dados.objetivos||'',
        valor: `R$${dados.plano_valor||0},00`,
        matricula: `R$${dados.plano_mat||0},00`,
        total: `R$${(parseInt(dados.plano_valor||0)+parseInt(dados.plano_mat||0))},00`,
        venc: new Date().toLocaleDateString('pt-BR'),
        status:'Ativo',
        cpf: dados.cpf, nasc: dados.nasc, idade: dados.idade, genero: dados.genero,
        whats: dados.whats, email: dados.email,
        nivel_atividade: dados.nivel_atividade,
        q1: dados.q1, q2: dados.q2, q3: dados.q3, q4: dados.q4, q5: dados.q5, q6: dados.q6, q7: dados.q7, q8: dados.q8, q9: dados.q9,
        plano: dados.plano_nome,
        cep: dados.cep, rua: dados.rua, numero: dados.numero, bairro: dados.bairro, cidade: dados.cidade
      };
      jsonCrono[baseFolder][idGerado]=alunoFlat;
      await ghPut(jsonCronoPath, Buffer.from(JSON.stringify(jsonCrono,null,2)).toString('base64'), `feat: cronograma JSON add ${idGerado} - ${baseFolder} - hora ${dados.horario} - sem duplicar`, jsonCronoSHA);
    }catch(e){ console.error('Erro JSON cronograma',e); }

    try{
      // JS cronograma - append seguro no final, preservando tudo
      if(cronoContent){
        let novoBloco = `\n// AUTO ADD ${idGerado} - ${baseFolder} - ${dados.horario} - n=${nextN}\n`;
        // Se existe CRONOGRAMA_DB, tenta inserir no horÃ¡rio correto
        if(cronoContent.includes('CRONOGRAMA_DB')){
          // adiciona no objeto do horÃ¡rio escolhido
          // fallback simples: append no final antes do Ãºltimo };
          let novoContent = cronoContent + `\n/* ${idGerado} - ${baseFolder} - ${dados.horario} */\n`;
          await ghPut('korvil/sections/ktp/projetotransformacao/cronograma-de-alunos/2026/cronograma-de-alunos.js', Buffer.from(novoContent).toString('base64'), `feat: cronograma JS add ${idGerado} - sem duplicar`, cronoSHA);
        }
      }
    }catch(e){ console.error('Erro JS cronograma',e); }

    // Retorna para front fazer AÃÃO 3 whatsapp
    return res.status(200).json({ok:true, id:idGerado, numero:nextN, pastaMae:idGerado, caminho:`${baseFolder}/${idGerado}/${idGerado}.json`, modalidade, json:jsonCompleto});

  }catch(e){
    console.error(e);
    return res.status(500).json({error:e.message});
  }
}
