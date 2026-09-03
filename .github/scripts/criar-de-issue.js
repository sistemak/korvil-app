//.github/scripts/criar-aluno-ativo.js - AJUSTADO - não remove nada, só blinda
const fs = require('fs');
const path = require('path');

function slug(texto){
  return String(texto||'')
   .toLowerCase()
   .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
   .replace(/[^a-z0-9]+/g, "")
   .slice(0,40) || 'aluno';
}
function safePasta(p){
  // impede sair do projeto: remove.. e deixa só a-z0-9/_-
  let s = String(p||'').replace(/\.\./g,'').replace(/[^a-zA-Z0-9/_-]/g,'').slice(0,150);
  return s || 'sections/ktp/projetotransformacao/projetos/2026';
}

let dados;
try{
  const b64 = process.argv[2];
  if(!b64) throw new Error('sem base64');
  dados = JSON.parse(Buffer.from(b64, 'base64').toString('utf-8'));
}catch(e){
  console.error('ERRO: base64/json inválido -', e.message);
  process.exit(1);
}

const nome = dados.nome || 'aluno';
const pastaRaw = dados.pasta || 'sections/ktp/projetotransformacao/projetos/2026';
const pasta = path.isAbsolute(pastaRaw)? pastaRaw : path.join(process.cwd(), safePasta(pastaRaw));

if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true });

// Pega próximo número - só conta arquivos que começam com mesmo slug
const slugNome = slug(nome);
const arquivos = fs.readdirSync(pasta).filter(f => f.startsWith(slugNome) && f.endsWith('.json'));
let ultimoNum = 0;
arquivos.forEach(f => {
  const m = f.match(/(\d+)\.json$/);
  const num = m? parseInt(m[1],10) : 0;
  if(num > ultimoNum) ultimoNum = num;
});
const novoNum = ultimoNum + 1;

const nomeArquivo = `${slugNome}${novoNum}.json`;
const caminho = path.join(pasta, nomeArquivo);

// MANTIDO IGUAL - só adicionei campos extras sem tirar os seus
const conteudo = {
  id: `${slugNome}${novoNum}`,
  n: novoNum,
  nome: nome,
  data_inscricao: dados.data_inscricao || new Date().toISOString(),
  status: "ATIVO",
  // extras que não quebram seu fluxo
  slug: slugNome,
  pasta: safePasta(pastaRaw),
  criadoEm: new Date().toISOString(),
  sistema: 'S.O.K v44 K-B.D'
}

fs.writeFileSync(caminho, JSON.stringify(conteudo, null, 2), 'utf-8');
console.log(`Arquivo criado: ${caminho}`);
