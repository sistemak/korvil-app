// V25 FINAL REAL - NUNCA GENERICO 42-marcos42 - SEMPRE DINAMICO REAL
// korvil/sections/ktp/projetotransformacao/inscricao-do-projeto/gerar.js
import fs from 'fs';
import path from 'path';

const TIPO_ENV = (process.env.TIPO || process.env.tipo || 'presencial').toLowerCase();
const TIPO = TIPO_ENV.includes('pres') ? 'presencial' : 'online';

const PRIMEIRO_NOME_RAW = process.env.PRIMEIRO_NOME || process.env.primeiroNome || '';
const NOME_COMPLETO = process.env.NOME_COMPLETO || process.env.nome || PRIMEIRO_NOME_RAW;

function slugPrimeiroNome(nome) {
  const primeiro = (nome || '').trim().split(/\s+/)[0] || '';
  return primeiro.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
}

const primeiroNome = slugPrimeiroNome(PRIMEIRO_NOME_RAW || NOME_COMPLETO);
if (!primeiroNome) {
  console.error('❌ PRIMEIRO_NOME vazio - use nome exato preenchido na inscrição');
  process.exit(1);
}

const ROOT_ALUNOS = path.join(process.cwd(), 'korvil/sections/ktp/projetotransformacao/projetos/2026/alunos');
const BASE = path.join(ROOT_ALUNOS, TIPO);
if (!fs.existsSync(BASE)) fs.mkdirSync(BASE, {recursive:true});

// REGEX SÓ FORMATO MÃE VÁLIDO: número-nome+numero -> ex: 46-joao46 | ignora 42, 42-marcos42? 42-marcos42 tem formato mas é bug se duplicado, porém regex oficial é ^(\d+)-[a-z0-9]+\d+$
const REGEX_MAE = /^(\d+)-[a-z0-9]+\d+$/;

let ultimo = 0;
const entries = fs.readdirSync(BASE, {withFileTypes:true});
for (const e of entries) {
  if (!e.isDirectory()) continue; // ignora json solto
  const m = e.name.match(REGEX_MAE);
  if (!m) continue; // ignora pasta só número 42, 43 e fora do padrão
  const num = parseInt(m[1],10);
  if (num > ultimo) ultimo = num;
}

const PROX = ultimo + 1;
const PASTA_MAE = `${PROX}-${primeiroNome}${PROX}`;
const NOME_ARQ = `${PASTA_MAE}.json`;
const FULL_PATH = path.join(BASE, PASTA_MAE, NOME_ARQ);

fs.mkdirSync(path.dirname(FULL_PATH), {recursive:true});

const dados = {
  id: PROX,
  pastaMae: PASTA_MAE,
  arquivo: NOME_ARQ,
  caminho: `${TIPO}/${PASTA_MAE}/${NOME_ARQ}`,
  fullPath: `korvil/sections/ktp/projetotransformacao/projetos/2026/alunos/${TIPO}/${PASTA_MAE}/${NOME_ARQ}`,
  primeiroNome,
  nomeCompleto: NOME_COMPLETO,
  tipo: TIPO,
  criadoEm: new Date().toISOString(),
  versao: 'V25 FINAL REAL'
};

// SÓ UM WRITE DENTRO DA MÃE, NUNCA FORA, NUNCA PASTA SÓ NUMERO
fs.writeFileSync(FULL_PATH, JSON.stringify(dados, null, 2), 'utf8');
console.log(`✅ Criado SÓ DENTRO DA MÃE: ${FULL_PATH}`);
