// .github/scripts/commit-inscricao.js
// Roda dentro de GitHub Actions com secrets.GH_TOKEN (original real, sem mostrar nem vazar)
// Faz commit real de tudo: pasta mãe/arquivo.json + cronograma-de-alunos.js + cronograma-de-alunos.json
// Sem token falso, só GitHub e Node com GH_TOKEN secreto
// Lógica completa: reconhecimento automático aluno antigo, ordem numérica crescente, ID abaixo do nome, matrícula, mensalidade, mensalidade valor
// Nunca excluir nada, só adicionar acrescentando, nunca duplica mesmo arquivo se já existe

const REPO = 'sistemak/korvil-app';
const GH_TOKEN = process.env.GH_TOKEN;

if(!GH_TOKEN){
  console.error('GH_TOKEN não configurado em secrets.GH_TOKEN');
  process.exit(1);
}

function toB64(s){return Buffer.from(s,'utf8').toString('base64');}
function fromB64(s){return Buffer.from(s.replace(/\n/g,''),'base64').toString('utf8');}
function extrairCampo(txt,campo){
  try{
    const re=new RegExp("\\*"+campo+":\\*\\s*([^\\n\\r*]+)","i");
    const m=txt.match(re);
    if(m) return m[1].trim();
  }catch(e){}
  return "";
}
function normalizarNome(n){return (n||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'').trim();}
function normalizarCPF(c){return (c||'').replace(/\D/g,'').trim();}
function calcularScore(novo, existenteTexto){
  let score=0;
  let cpfNovo=normalizarCPF(novo.cpf), cpfExist=normalizarCPF(extrairCampo(existenteTexto,'CPF'));
  if(cpfNovo&&cpfExist&&cpfNovo===cpfExist&&cpfNovo.length===11) score+=100;
  let nomeNovo=normalizarNome(novo.nome), nomeExist=normalizarNome(extrairCampo(existenteTexto,'Nome'));
  if(nomeNovo&&nomeExist&&nomeNovo===nomeExist&&nomeNovo.length>5) score+=50;
  else if(nomeNovo&&nomeExist&&(nomeNovo.includes(nomeExist)||nomeExist.includes(nomeNovo))&&nomeNovo.length>5) score+=20;
  let nascNovo=(novo.nasc||'').trim(), nascExist=extrairCampo(existenteTexto,'Data Nascimento')||'';
  if(nascNovo&&nascExist&&nascNovo===nascExist&&nascNovo.length>5) score+=30;
  let whatsNovo=(novo.whats||'').replace(/\D/g,''), whatsExist=(extrairCampo(existenteTexto,'WhatsApp')||'').replace(/\D/g,'');
  if(whatsNovo&&whatsExist&&whatsNovo===whatsExist&&whatsNovo.length>=10) score+=20;
  let emailNovo=(novo.email||'').toLowerCase().trim(), emailExist=(extrairCampo(existenteTexto,'Email')||'').toLowerCase().trim();
  if(emailNovo&&emailExist&&emailNovo===emailExist&&emailNovo.includes('@')) score+=20;
  return score;
}

async function ghFetch(p, opts={}){
  const url = p.startsWith('https') ? p : `https://api.github.com${p}`;
  const res = await fetch(url, {
    ...opts,
    headers: {'Authorization':`token ${GH_TOKEN}`,'Accept':'application/vnd.github.v3+json','Content-Type':'application/json',...(opts.headers||{})}
  });
  return res;
}

async function listarMax(basePath){
  const res = await ghFetch(`/repos/${REPO}/contents/${basePath}?ref=main`);
  if(!res.ok) return 0;
  const lista = await res.json();
  let max=0;
  if(Array.isArray(lista)){
    for(const it of lista){
      const m=it.name.match(/^(\d+)-/);
      if(m){const n=parseInt(m[1],10); if(!isNaN(n)&&n>max) max=n;}
    }
  }
  return max;
}

async function listarTodosJsons(basePath){
  const res = await ghFetch(`/repos/${REPO}/contents/${basePath}?ref=main`);
  if(!res.ok) return [];
  const pastas = await res.json();
  let arquivos=[];
  for(const pasta of pastas){
    if(pasta.type!=='dir'||pasta.name.startsWith('.')) continue;
    try{
      const contRes = await ghFetch(`/repos/${REPO}/contents/${basePath}/${pasta.name}?ref=main`);
      if(!contRes.ok) continue;
      const arqs = await contRes.json();
      const jf = Array.isArray(arqs) ? arqs.find(f=>f.name.endsWith('.json')) : null;
      if(!jf) continue;
      const fileRes = await ghFetch(`/repos/${REPO}/contents/${basePath}/${pasta.name}/${jf.name}?ref=main`);
      if(!fileRes.ok) continue;
      const fd = await fileRes.json();
      const oldText = fromB64(fd.content);
      arquivos.push({pasta:pasta.name, arquivo:jf.name, sha:fd.sha, conteudo:oldText, path:`${basePath}/${pasta.name}/${jf.name}`});
    }catch(e){}
  }
  return arquivos;
}

async function main(){
  const payloadStr = process.argv[2] || process.env.PAYLOAD;
  if(!payloadStr){console.log('Sem payload - nada a commitar'); return;}
  
  let payload;
  try{
    payload = JSON.parse(payloadStr);
  }catch(e){
    console.error('Payload inválido', e);
    process.exit(1);
  }

  const {nomeCompleto, plano, dias, hora, objetivos, dadosExtras, dataInscricao} = payload;
  const hoje = dataInscricao || new Date().toLocaleDateString('pt-BR');

  const ehOnline = plano.tipo&&plano.tipo.includes('online');
  let basePath = ehOnline ? "korvil/sections/ktp/projetotransformacao/projetos/2026/alunos/online" : "korvil/sections/ktp/projetotransformacao/projetos/2026/alunos/presencial";
  let max = await listarMax(basePath);
  if(max===0){
    const baseAlt = ehOnline ? "korvil/sections/ktp/projeto/2026/alunos/online" : "korvil/sections/ktp/projeto/2026/alunos/presencial";
    const maxAlt = await listarMax(baseAlt);
    if(maxAlt>0){basePath=baseAlt; max=maxAlt;}
  }

  const todosJsons = await listarTodosJsons(basePath);
  const novoDadosTemp={nome:nomeCompleto, cpf:dadosExtras.cpf||'', nasc:dadosExtras.nasc||'', whats:dadosExtras.whats||'', email:dadosExtras.email||''};
  let alunoExistente=null, maiorScore=0;
  for(const item of todosJsons){
    const score=calcularScore(novoDadosTemp, item.conteudo);
    if(score>maiorScore){maiorScore=score; alunoExistente=item;}
  }

  let prox, pastaMae, nomeArq, fullPath, shaExistente=null;
  if(alunoExistente && maiorScore>=80){
    console.log(`Aluno existente detectado score ${maiorScore} - atualizando mesmo arquivo ${alunoExistente.pasta}`);
    pastaMae=alunoExistente.pasta;
    nomeArq=alunoExistente.arquivo;
    fullPath=alunoExistente.path;
    shaExistente=alunoExistente.sha;
    prox=parseInt(pastaMae.split('-')[0])||max+1;
  }else{
    prox=max+1;
    if(!ehOnline&&prox===43) prox=44;
    if(!ehOnline&&prox<42) prox=42;
    if(ehOnline&&prox<3) prox=3;
    const primeiro=nomeCompleto.split(/\s+/)[0]||'aluno';
    const primeiroNomeReal=primeiro.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g,'').replace(/[^a-z0-9]/g,'');
    pastaMae=`${prox}-${primeiroNomeReal}${prox}`;
    nomeArq=`${pastaMae}.json`;
    fullPath=`${basePath}/${pastaMae}/${nomeArq}`;
    console.log(`Novo aluno - próximo ID ${prox} pasta ${pastaMae}`);
  }

  const primeiroNomeParaId=nomeCompleto.split(/\s+/)[0].toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g,'').replace(/[^a-z0-9]/g,'');
  
  const conteudoModelo=`*🚨 NOVA INSCRIÇÃO K-TP PROJETO TRANSFORMAÇÃO 🚨*

*==================================*
*1. DADOS DO PLANO*
*==================================*
*Modalidade:* ${ehOnline?'ONLINE':'PRESENCIAL'}
*Tipo de Plano:* ${plano.nome||'Mensal Presencial 3x'}
*Dias:* ${dias.join(', ')||'Segunda, Quarta, Sexta'}
*Horário:* ${hora}
*Frequência:* ${plano.freq?plano.freq+'x na semana':'3x na semana'}
*Valor Mensal:* R$${plano.valor||'100'},00
*Matrícula Paga:* R$${plano.mat||'50'},00 - ${hoje}
*Mensalidade:* ${hoje}
*Mensalidade Valor:* R$${plano.valor||'100'},00
*Total 1º Pagamento:* R$${parseInt(plano.valor||100)+parseInt(plano.mat||50)},00

*==================================*
*2. DADOS PESSOAIS*
*==================================*
*Nome:* ${nomeCompleto}
*ID:* ${prox}
*CPF:* ${dadosExtras.cpf}
*Data Nascimento:* ${dadosExtras.nasc}
*Idade:* ${dadosExtras.idade}
*Gênero:* ${dadosExtras.genero}
*WhatsApp:* ${dadosExtras.whats}
*Email:* ${dadosExtras.email}

*==================================*
*3. ENDEREÇO*
*==================================*
*CEP:* ${dadosExtras.cep}
*Rua:* ${dadosExtras.rua}
*Número:* ${dadosExtras.numero}
*Bairro:* ${dadosExtras.bairro}
*Cidade:* ${dadosExtras.cidade}

*==================================*
*4. ANAMNESE - OBJETIVOS*
*==================================*
*Objetivos em Prioridade:* ${objetivos}
*Nível de Atividade:* ${dadosExtras.nivelAtividade}

*==================================*
*5. ANAMNESE - HISTÓRICO*
*==================================*
*Q1. Já praticou atividade física antes?* ${dadosExtras.q1}
*Q2. Como descreve sua ALIMENTAÇÃO atual?* ${dadosExtras.q2}
*Q3. Quantas horas DORME por noite?* ${dadosExtras.q3}
*Q4. Possui RESTRIÇÃO alimentar?* ${dadosExtras.q4}
*Q5. Qual parte do corpo quer MELHORAR mais?* ${dadosExtras.q5}
*Q6. Possui DEFICIENCIA ou LIMITAÇÃO física?* ${dadosExtras.q6}
*Q7. Está passando ou JÁ TEVE acompanhamento PSICOLÓGICO?* ${dadosExtras.q7}
*Q8. Está fazendo ALGUM TRATAMENTO físico ou psicológico?* ${dadosExtras.q8}
*Q9. Está fazendo USO DE MEDICAMENTOS? Quais?* ${dadosExtras.q9}

*==================================*
*STATUS: ATIVO*
*==================================*
`;

  console.log(`Salvando arquivo individual ${fullPath} com GH_TOKEN secreto`);
  const putRes = await ghFetch(`/repos/${REPO}/contents/${fullPath}`,{
    method:'PUT',
    body:JSON.stringify({
      message:`feat: inscricao ${pastaMae} em ${ehOnline?'online':'presencial'} [GITHUB-NODE-AUTO-REAL]`,
      content:toB64(conteudoModelo),
      branch:'main',
      ...(shaExistente?{sha:shaExistente}:{})
    })
  });
  console.log('Put arquivo status', putRes.status);
  if(!putRes.ok) console.log(await putRes.text());
  else console.log(`✅ Arquivo individual salvo real: ${fullPath}`);

  const centralPaths=[
    "korvil/sections/ktp/projetotransformacao/cronograma-de-alunos/2026/cronograma-de-alunos.js",
    "korvil/sections/ktp/projetotransformacao/cronograma-de-alunos/2026/cronograma-de-alunos.json"
  ];
  for(const centralPath of centralPaths){
    try{
      let shaCentral=null, centralStr=null;
      const getCentral = await ghFetch(`/repos/${REPO}/contents/${centralPath}?ref=main`);
      if(getCentral.ok){const j=await getCentral.json(); shaCentral=j.sha; centralStr=fromB64(j.content);}
      let centralData={ALUNOS_DB:{},ALUNOS_PRESENCIAL:{},ALUNOS_ONLINE:{},CRONOGRAMA_DB:{PRESENCIAL:[],ONLINE:[]}};
      if(centralStr){
        try{
          if(centralPath.endsWith('.js')){
            const tempWindow={};
            const func=new Function('window',centralStr+'\n; return window.KTP_CRONOGRAMA || {};');
            centralData=func(tempWindow)||centralData;
          }else{centralData=JSON.parse(centralStr);}
        }catch(e){console.log('Erro parse cronograma, criando novo', e.message);}
      }
      if(!centralData.ALUNOS_DB) centralData.ALUNOS_DB={};
      if(!centralData.ALUNOS_PRESENCIAL) centralData.ALUNOS_PRESENCIAL={};
      if(!centralData.ALUNOS_ONLINE) centralData.ALUNOS_ONLINE={};
      if(!centralData.CRONOGRAMA_DB) centralData.CRONOGRAMA_DB={PRESENCIAL:[],ONLINE:[]};
      if(!centralData.CRONOGRAMA_DB.PRESENCIAL) centralData.CRONOGRAMA_DB.PRESENCIAL=[];
      if(!centralData.CRONOGRAMA_DB.ONLINE) centralData.CRONOGRAMA_DB.ONLINE=[];

      const idSlug=`${primeiroNomeParaId}${prox}`;
      if(!centralData.ALUNOS_DB[idSlug]) centralData.ALUNOS_DB[idSlug]={"nome":nomeCompleto,"tipo":"ALUNO","id":prox,"pasta":pastaMae};
      if(ehOnline){if(!centralData.ALUNOS_ONLINE[idSlug]) centralData.ALUNOS_ONLINE[idSlug]={"nome":nomeCompleto,"tipo":"ALUNO"};}else{if(!centralData.ALUNOS_PRESENCIAL[idSlug]) centralData.ALUNOS_PRESENCIAL[idSlug]={"nome":nomeCompleto,"tipo":"ALUNO"};}

      const horaPrefix=hora.split(':')[0];
      const listaAlvo=ehOnline?centralData.CRONOGRAMA_DB.ONLINE:centralData.CRONOGRAMA_DB.PRESENCIAL;
      let slot=listaAlvo.find(s=>s.hora&&s.hora.startsWith(horaPrefix));
      if(!slot){slot={"hora":hora+" ⭐","status":"ATIVOS","alunos":[]}; listaAlvo.push(slot);}
      const existe=slot.alunos.find(a=>a.id===idSlug);
      const vencData=new Date(); vencData.setDate(vencData.getDate()+30); const vencStr=vencData.toLocaleDateString('pt-BR');
      if(!existe){
        const novoRegistro={"n":prox,"id":idSlug,"aluno":nomeCompleto,"dias":dias.join(', '),"freq":`${plano.freq}x`,"objetivo":objetivos,"valor":`R$${plano.valor},00`,"matricula":`R$${plano.mat},00`,"total":`R$${parseInt(plano.valor||0)+parseInt(plano.mat||0)},00`,"mensalidade":vencStr,"venc":vencStr,"status":"Ativo","cpf":dadosExtras.cpf,"nasc":dadosExtras.nasc,"idade":dadosExtras.idade,"genero":dadosExtras.genero,"whats":dadosExtras.whats,"email":dadosExtras.email,"nivel_atividade":dadosExtras.nivelAtividade,"q1":dadosExtras.q1,"q2":dadosExtras.q2,"q3":dadosExtras.q3,"q4":dadosExtras.q4,"q5":dadosExtras.q5,"q6":dadosExtras.q6,"q7":dadosExtras.q7,"q8":dadosExtras.q8,"q9":dadosExtras.q9,"plano":plano.nome||'',"cep":dadosExtras.cep,"rua":dadosExtras.rua,"numero":dadosExtras.numero,"bairro":dadosExtras.bairro,"cidade":dadosExtras.cidade,"horario":hora};
        slot.alunos.push(novoRegistro); slot.alunos.sort((a,b)=>a.n-b.n);
      }
      let novoConteudoStr='';
      if(centralPath.endsWith('.js')){
        novoConteudoStr=`// ${centralPath}\n// Atualizado automaticamente preservando tudo em ${new Date().toISOString()}\nwindow.KTP_CRONOGRAMA = window.KTP_CRONOGRAMA || {};\nwindow.KTP_CRONOGRAMA.ALUNOS_DB = ${JSON.stringify(centralData.ALUNOS_DB,null,2)};\nwindow.KTP_CRONOGRAMA.ALUNOS_PRESENCIAL = ${JSON.stringify(centralData.ALUNOS_PRESENCIAL,null,2)};\nwindow.KTP_CRONOGRAMA.ALUNOS_ONLINE = ${JSON.stringify(centralData.ALUNOS_ONLINE,null,2)};\nwindow.KTP_CRONOGRAMA.CRONOGRAMA_DB = ${JSON.stringify(centralData.CRONOGRAMA_DB,null,2)};\nvar Sr = window.KTP_CRONOGRAMA.ALUNOS_DB;\nvar pf = window.KTP_CRONOGRAMA.CRONOGRAMA_DB;\nvar ALUNOS_PRESENCIAL = window.KTP_CRONOGRAMA.ALUNOS_PRESENCIAL;\nvar ALUNOS_ONLINE = window.KTP_CRONOGRAMA.ALUNOS_ONLINE;\nvar CRONOGRAMA = window.KTP_CRONOGRAMA.CRONOGRAMA_DB;\n`;
      }else{novoConteudoStr=JSON.stringify(centralData,null,2);}
      const putCentral = await ghFetch(`/repos/${REPO}/contents/${centralPath}`,{method:'PUT', body:JSON.stringify({message:`feat: preserva adiciona ${pastaMae} no ${centralPath.endsWith('.js')?'js':'json'} [GITHUB-NODE-AUTO]`,content:toB64(novoConteudoStr),branch:'main',...(shaCentral?{sha:shaCentral}:{})})});
      console.log(`Put cronograma ${centralPath} status`, putCentral.status);
    }catch(e){console.log('Erro cronograma', e);}
  }
}

main();
