const fs = require('fs');
const path = require('path');

const dados = JSON.parse(Buffer.from(process.argv[2], 'base64').toString());
const nome = dados.nome;
const pasta = dados.pasta;

function slug(texto){
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "");
}

if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true });

// Pega próximo número
const arquivos = fs.readdirSync(pasta).filter(f => f.endsWith('.json'));
let ultimoNum = 0;
arquivos.forEach(f => {
  const num = parseInt(f.match(/\d+/)?.[0] || 0);
  if(num > ultimoNum) ultimoNum = num;
});
const novoNum = ultimoNum + 1;

const slugNome = slug(nome);
const nomeArquivo = `${slugNome}${novoNum}.json`;
const caminho = path.join(pasta, nomeArquivo);

const conteudo = {
  id: `${slugNome}${novoNum}`,
  n: novoNum,
  nome: nome,
  data_inscricao: dados.data_inscricao,
  status: "ATIVO"
}

fs.writeFileSync(caminho, JSON.stringify(conteudo, null, 2));
console.log(`Arquivo criado: ${caminho}`);
