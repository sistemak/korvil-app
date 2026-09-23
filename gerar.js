// gerar.js - MASTER V14 FIX 404 - sistemak/korvil-app
// REGRA MESTRE: NUNCA cria pastas sozinho. Criacao apenas quando pessoa preenche dados reais.
// - So cria pasta mae / .json quando finalizar inscricao na pagina inscricao-do-projeto/index.html
// - So cria assets, gifs, registros, pesos etc quando pessoa anexar video Gif.mp4 ou registrar pesos em projetotransformacao.html
// - Nunca generico ou falso, nunca hardcoded 42-marcos42 ou 43-teste43 como criacao real (apenas comentario de formato exemplo)
// - Pula 43 sempre, formato pastaMae = PROX-SLUG+PROX dinamico real

const fs = require('fs');
const path = require('path');

const BASE_ALUNOS = 'korvil/sections/ktp/projetotransformacao/alunos';

function normalizarSlug(nomeCompletoReal){
  const primeiro = (nomeCompletoReal.trim().split(/\s+/)[0] || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
  return primeiro;
}

function getProxNumero(tipo){
  const base = path.join(BASE_ALUNOS, tipo);
  if(!fs.existsSync(base)){
    return 1;
  }
  const dirs = fs.readdirSync(base, {withFileTypes:true}).filter(function(d){return d.isDirectory();}).map(function(d){return d.name;});
  let max = 0;
  for(const name of dirs){
    const m = name.match(/^(\d+)-/);
    if(!m) continue;
    const num = parseInt(m[1],10);
    if(num===43) continue;
    if(num>max) max=num;
  }
  let prox = max+1;
  if(prox===43) prox=44;
  return prox;
}

function criarSoPastaMae(numeroReal, slugReal, dadosTextoReal, tipoReal){
  let prox = numeroReal;
  if(prox===43) prox=44;
  const pastaMae = prox + "-" + slugReal + prox;
  const nomeJson = pastaMae + ".json";
  const dir = path.join(BASE_ALUNOS, tipoReal, pastaMae);
  fs.mkdirSync(dir, {recursive:true});
  fs.writeFileSync(path.join(dir, nomeJson), dadosTextoReal, 'utf8');
  console.log("[gerar.js] Criado APENAS " + dir + "/" + nomeJson + " - nunca assets aqui");
  return { pastaMae: pastaMae, caminho: path.join(dir, nomeJson) };
}

function getFaseAtual(){
  const agora = new Date();
  const mes = agora.getMonth();
  if(mes>=0 && mes<=2) return 'cutting';
  if(mes>=3 && mes<=5) return 'bulking';
  if(mes>=6 && mes<=8) return 'definicao';
  return 'manutencao';
}

function criarAssetsQuandoGif(pastaMaePathReal, videoBufferReal, faseReal){
  if(!videoBufferReal) throw new Error('videoBufferReal obrigatorio - dado real');
  const fase = faseReal || getFaseAtual();
  const assetsDir = path.join(pastaMaePathReal, 'assets');
  const gifsDir = path.join(assetsDir, 'gifs');
  fs.mkdirSync(assetsDir, {recursive:true});
  fs.mkdirSync(gifsDir, {recursive:true});

  const indexAssets = path.join(assetsDir, 'index.html');
  if(!fs.existsSync(indexAssets)){
    fs.writeFileSync(indexAssets, '<!-- nada ainda -->', 'utf8');
  }
  const indexGifs = path.join(gifsDir, 'index.html');
  if(!fs.existsSync(indexGifs)){
    fs.writeFileSync(indexGifs, '<!-- modelo vazio gifs -->', 'utf8');
  }
  const destMp4 = path.join(gifsDir, fase + ".mp4");
  fs.writeFileSync(destMp4, videoBufferReal);
  console.log("[gerar.js] Gif real salvo: " + destMp4);
  return destMp4;
}

function criarOuAtualizarPesos(pastaMaePathReal, registrosReais){
  if(!Array.isArray(registrosReais) || registrosReais.length===0) throw new Error('registrosReais obrigatorio');
  const registrosDir = path.join(pastaMaePathReal, 'registros');
  fs.mkdirSync(registrosDir, {recursive:true});
  const pesosPath = path.join(registrosDir, 'pesos.html');

  let html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Pesos - ' + path.basename(pastaMaePathReal) + '</title></head><body>';
  html += '<h1>Registros de Peso Reais</h1><table border="1" cellpadding="6"><tr><th>Data</th><th>Peso (kg)</th><th>Obs</th></tr>';
  for(const r of registrosReais){
    const d = (r.data||'').toString().replace(/</g,'&lt;');
    const p = (r.peso||'').toString().replace(/</g,'&lt;');
    const o = (r.observacao||'').toString().replace(/</g,'&lt;');
    html += '<tr><td>' + d + '</td><td>' + p + '</td><td>' + o + '</td></tr>';
  }
  html += '</table></body></html>';
  fs.writeFileSync(pesosPath, html, 'utf8');
  console.log("[gerar.js] Pesos reais atualizados: " + pesosPath);
  return pesosPath;
}

module.exports = { getProxNumero: getProxNumero, criarSoPastaMae: criarSoPastaMae, criarAssetsQuandoGif: criarAssetsQuandoGif, criarOuAtualizarPesos: criarOuAtualizarPesos, getFaseAtual: getFaseAtual, normalizarSlug: normalizarSlug };
