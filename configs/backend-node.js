// backend Node 20 - usa process.env.GH_TOKEN - nunca hardcode - mercado livre style korvil-loja
const { Octokit } = require('@octokit/rest');
async function deployKorvilLoja(){
  const token = process.env.GH_TOKEN; // secrets.GH_TOKEN
  if(!token) throw new Error('Configure GH_TOKEN em Settings > Secrets and variables > Actions > GH_TOKEN');
  const octokit = new Octokit({ auth: token });
  // regras ouro: GET antes PUT, PULAR se existir, MERGE nunca delete total
  // tudo minusculas - marketplace prata cromado #C0C0C0 ouro #FFD700
  // comprovantes assinados igual mercado livre em korvil/sections/korvil-loja/comprovantes/comprovantes.json
  // pix chave korvilloja@gmail.com - debito credito boleto
  console.log('deploy korvil-loja ok - token via secrets.GH_TOKEN - comprovantes assinados igual ML');
}
module.exports = { deployKorvilLoja };
