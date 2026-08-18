const fs = require('fs');
const path = require('path');

const slug = process.argv[2];
const dados = JSON.parse(Buffer.from(process.argv[3], 'base64').toString());

const pasta = 'sections/ktp/projetotransformacao/projetos/2026';
if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true });

// Pega o próximo número baseado nos arquivos que já existem tipo gon19.json, mcarla2.json
const arquivos = fs.readdirSync(pasta).filter(f => f.endsWith('.json'));
let ultimoNum = 0;
arquivos.forEach(f => {
  const num = parseInt(f.match(/\d+/)?.[0] || 0);
  if(num > ultimoNum) ultimoNum = num;
});
const novoNum = ultimoNum + 1;

const nomeArquivo = `${slug}${novoNum}.json`;
const caminho = path.join(pasta, nomeArquivo);

const conteudo = {
  id: `${slug}${novoNum}`,
  n: novoNum,
 ...dados
}

fs.writeFileSync(caminho, JSON.stringify(conteudo, null, 2));
console.log(`Arquivo criado: ${caminho}`);
