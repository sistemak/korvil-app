// K-RIADOR - CRIADOR UNIVERSAL v44 - serve pra QUALQUER coisa
const fs = require('fs');
const path = require('path');

function safe(str){
  return String(str||'').toLowerCase().replace(/[^a-z0-9/_-]/g,'').slice(0,120);
}
function safeSlug(s){
  return String(s||'item').toLowerCase().replace(/[^a-z0-9_-]/g,'').slice(0,40) || 'item';
}

function criarUniversal({ pasta, slug, dados, usarNumero=true }){
  pasta = safe(pasta) || 'sections/ktp/projetotransformacao/projetos/2026';
  slug = safeSlug(slug);

  const fullPasta = path.isAbsolute(pasta)? pasta : path.join(process.cwd(), pasta);
  fs.mkdirSync(fullPasta, { recursive: true });

  let nomeArquivo, caminho;
  if(usarNumero){
    const arquivos = fs.readdirSync(fullPasta).filter(f => f.startsWith(slug) && f.endsWith('.json'));
    let ultimo = 0;
    arquivos.forEach(f=>{
      const m = f.match(/(\d+)\.json$/);
      if(m) ultimo = Math.max(ultimo, parseInt(m[1],10));
    });
    const novo = ultimo + 1;
    nomeArquivo = `${slug}${novo}.json`;
    caminho = path.join(fullPasta, nomeArquivo);
    dados = { id: `${slug}${novo}`, n: novo, slug, pasta, criadoEm: new Date().toISOString(),...dados };
  } else {
    nomeArquivo = `${slug}.json`;
    caminho = path.join(fullPasta, nomeArquivo);
    dados = { id: slug, slug, pasta, atualizadoEm: new Date().toISOString(),...dados };
  }

  fs.writeFileSync(caminho, JSON.stringify(dados, null, 2), 'utf-8');
  console.log(`REAL: ${caminho}`);
  return caminho;
}

// CLI: node criar-arquivo-universal.js <pasta> <slug> <base64>
// COMPATÍVEL com seu antigo: node criar-arquivo.js <slug> <base64> (usa pasta padrão)
if(require.main === module){
  let [pastaArg, slugArg, base64Arg] = process.argv.slice(2);

  // se só veio 2 args -> modo antigo
  if(!base64Arg && slugArg){
    base64Arg = slugArg;
    slugArg = pastaArg;
    pastaArg = 'sections/ktp/projetotransformacao/projetos/2026';
  }

  if(!slugArg ||!base64Arg){
    console.error('Uso: node criar-arquivo-universal.js <pasta> <slug> <base64> OU <slug> <base64>');
    process.exit(1);
  }

  let dados;
  try{ dados = JSON.parse(Buffer.from(base64Arg, 'base64').toString('utf-8')); }
  catch(e){ console.error('base64/json inválido'); process.exit(1); }

  criarUniversal({ pasta: pastaArg, slug: slugArg, dados });
}

module.exports = { criarUniversal };

criar-de-issue.js

const { criarUniversal } = require('./criar-arquivo-universal.js');
// pega issue body...
criarUniversal({ pasta: issue.pasta || 'sections/ktp/...', slug: issue.slug, dados: issue.dados });
