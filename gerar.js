/* gerar.js - MASTER V16 FINAL
   - Gera pasta mae padrao {prox}-{slug}{prox} ex: 42-marcos42
   - .json dentro apenas: {prox}-{slug}{prox}/{prox}-{slug}{prox}.json
   - Nunca fora, nunca generico, nunca copia exemplo Edna
   - Salva com dados reais da inscricao em ordem exata TELA 1-2-3
   - Ja exclui codigos antigos desde 42 ate ultimo (nao lista legados)
*/

function slugify(nomeReal){
  if(!nomeReal) return 'aluno';
  const primeiro = nomeReal.trim().split(/\s+/)[0] || 'aluno';
  return primeiro.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]/g,'')
    .slice(0,20) || 'aluno';
}

export function gerarNomePasta(prox, nomeReal){
  const slug = slugify(nomeReal);
  const base = prox + '-' + slug + prox;
  return {
    pasta: base,
    arquivo: base + '.json',
    caminhoCompleto: base + '/' + base + '.json',
    slug: slug,
    prox: prox
  };
}

export async function obterProximoNumero(opts){
  const owner = (opts && opts.owner) || 'sistemak';
  const repo = (opts && opts.repo) || 'korvil-app';
  const branch = (opts && opts.branch) || 'main';
  try{
    const res = await fetch('https://api.github.com/repos/' + owner + '/' + repo + '/contents?ref=' + branch);
    if(!res.ok) throw new Error('falha ao listar repo');
    const itens = await res.json();
    let max = 41;
    const regex = /^(\d+)-/;
    for(const it of itens){
      if(it.type === 'dir'){
        const m = it.name.match(regex);
        if(m){
          const n = parseInt(m[1],10);
          if(!isNaN(n) && n >= 42 && n > max) max = n;
        }
      }
    }
    return max + 1;
  }catch(e){
    console.warn('obterProximoNumero fallback', e);
    return Math.floor(Date.now()/1000) % 900 + 100;
  }
}

export function gerarTextoFormatadoExato(dados){
  return '*TELA 1: ANAMNESE*\n\n' +
'1.1. ANAMNESE - OBJETIVOS\n\n' +
'Objetivos em Prioridade: ' + (dados.objetivos || '') + '\n' +
'Nível de Atividade: ' + (dados.nivel || '') + '\n\n' +
'1.2. ANAMNESE - HISTÓRICO\n\n' +
'Q1. Já praticou atividade física antes? ' + (dados.q1 || '') + '\n' +
'Q2. Como descreve sua ALIMENTAÇÃO atual? ' + (dados.q2 || '') + '\n' +
'Q3. Quantas horas DORME por noite? ' + (dados.q3 || '') + '\n' +
'Q4. Possui RESTRIÇÃO alimentar? ' + (dados.q4 || '') + '\n' +
'Q5. Qual parte do corpo quer MELHORAR mais? ' + (dados.q5 || '') + '\n' +
'Q6. Possui DEFICIENCIA ou LIMITAÇÃO física? ' + (dados.q6 || '') + '\n' +
'Q7. Está passando ou JÁ TEVE acompanhamento PSICOLÓGICO? ' + (dados.q7 || '') + '\n' +
'Q8. Está fazendo ALGUM TRATAMENTO físico ou psicológico? ' + (dados.q8 || '') + '\n' +
'Q9. Está fazendo USO DE MEDICAMENTOS? Quais? ' + (dados.q9 || '') + '\n\n' +
'*TELA 2: PLANOS*\n\n' +
'2.1. DADOS DO PLANO\n\n' +
'Modalidade: ' + (dados.modalidade || '') + '\n' +
'Tipo de Plano: ' + (dados.tipoPlano || '') + '\n' +
'Dias: ' + (dados.dias || '') + '\n' +
'Horário: ' + (dados.horario || '') + '\n' +
'Frequência: ' + (dados.frequencia || '') + '\n' +
'Valor Mensal: ' + (dados.valorMensal || '') + '\n' +
'Matrícula Paga: ' + (dados.matricula || '') + ' - ' + (dados.dataMatricula || '') + '\n' +
'Total 1º Pagamento: ' + (dados.total || '') + '\n' +
'Data da Mensalidade: ' + (dados.dataMensalidade || '') + '\n\n' +
'*TELA 3: DADOS*\n\n' +
'3.1. DADOS PESSOAIS\n\n' +
'Nome: ' + (dados.nome || '') + '\n' +
'CPF: ' + (dados.cpf || '') + '\n' +
'Data Nascimento: ' + (dados.nascimento || '') + '\n' +
'Idade: ' + (dados.idade || '') + '\n' +
'Gênero: ' + (dados.genero || '') + '\n' +
'WhatsApp: ' + (dados.whatsapp || '') + '\n' +
'Email: ' + (dados.email || '') + '\n\n' +
'3.2. ENDEREÇO\n\n' +
'CEP: ' + (dados.cep || '') + '\n' +
'Rua: ' + (dados.rua || '') + '\n' +
'Número: ' + (dados.numero || '') + '\n' +
'Bairro: ' + (dados.bairro || '') + '\n' +
'Cidade: ' + (dados.cidade || '') + '\n\n' +
'STATUS: ATIVO';
}

export function gerarConteudoJsonExato(dados, textoFormatado){
  const payload = {};
  payload['TELA 1: ANAMNESE'] = {
    '1.1. ANAMNESE - OBJETIVOS': {
      'Objetivos em Prioridade': dados.objetivos || '',
      'Nível de Atividade': dados.nivel || ''
    },
    '1.2. ANAMNESE - HISTÓRICO': {
      'Q1. Já praticou atividade física antes?': dados.q1 || '',
      'Q2. Como descreve sua ALIMENTAÇÃO atual?': dados.q2 || '',
      'Q3. Quantas horas DORME por noite?': dados.q3 || '',
      'Q4. Possui RESTRIÇÃO alimentar?': dados.q4 || '',
      'Q5. Qual parte do corpo quer MELHORAR mais?': dados.q5 || '',
      'Q6. Possui DEFICIENCIA ou LIMITAÇÃO física?': dados.q6 || '',
      'Q7. Está passando ou JÁ TEVE acompanhamento PSICOLÓGICO?': dados.q7 || '',
      'Q8. Está fazendo ALGUM TRATAMENTO físico ou psicológico?': dados.q8 || '',
      'Q9. Está fazendo USO DE MEDICAMENTOS? Quais?': dados.q9 || ''
    }
  };
  payload['TELA 2: PLANOS'] = {
    '2.1. DADOS DO PLANO': {
      'Modalidade': dados.modalidade || '',
      'Tipo de Plano': dados.tipoPlano || '',
      'Dias': dados.dias || '',
      'Horário': dados.horario || '',
      'Frequência': dados.frequencia || '',
      'Valor Mensal': dados.valorMensal || '',
      'Matrícula Paga': (dados.matricula || '') + ' - ' + (dados.dataMatricula || ''),
      'Total 1º Pagamento': dados.total || '',
      'Data da Mensalidade': dados.dataMensalidade || ''
    }
  };
  payload['TELA 3: DADOS'] = {
    '3.1. DADOS PESSOAIS': {
      'Nome': dados.nome || '',
      'CPF': dados.cpf || '',
      'Data Nascimento': dados.nascimento || '',
      'Idade': dados.idade || '',
      'Gênero': dados.genero || '',
      'WhatsApp': dados.whatsapp || '',
      'Email': dados.email || ''
    },
    '3.2. ENDEREÇO': {
      'CEP': dados.cep || '',
      'Rua': dados.rua || '',
      'Número': dados.numero || '',
      'Bairro': dados.bairro || '',
      'Cidade': dados.cidade || ''
    },
    'STATUS': 'ATIVO'
  };
  payload['texto_formatado'] = textoFormatado;
  payload['_meta'] = {
    'gerado_em': new Date().toISOString(),
    'ordem': 'TELA 1-2-3 exata com dados reais da inscricao, nunca exemplo Edna',
    'pasta_padrao': '{prox}-{slug}{prox}/{prox}-{slug}{prox}.json'
  };
  return JSON.stringify(payload, null, 2);
}
