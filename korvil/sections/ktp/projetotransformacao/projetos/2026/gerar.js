const fs = require('fs');
const path = require('path');

function criarEstruturaCompleta(numero, nomeSlug, nomeCompleto, dadosTexto, tipo) {
  const tipoNorm = (tipo || 'masculino').toLowerCase().trim();
  const basePath = path.join(__dirname, 'alunos', tipoNorm);
  const pad = String(numero).padStart(2, '0');
  const slugClean = (nomeSlug || 'aluno').toLowerCase().replace(/[^a-z0-9]/g, '');
  const pastaNome = `${pad}-${slugClean || 'aluno'}`;
  const local = path.join(basePath, pastaNome);

  if (fs.existsSync(local)) {
    throw new Error(`Pasta já existe: ${local} - anti-duplicata ativada`);
  }

  fs.mkdirSync(path.join(local, 'assets', 'gifs'), { recursive: true });
  fs.mkdirSync(path.join(local, 'registros'), { recursive: true });

  // 1 - JSON
  fs.writeFileSync(path.join(local, `${pastaNome}.json`), dadosTexto, 'utf8');

  // 2 - assets/index.html
  fs.writeFileSync(path.join(local, 'assets', 'index.html'), 'nada ainda', 'utf8');

  // 3 - assets/gifs/index.html
  fs.writeFileSync(path.join(local, 'assets', 'gifs', 'index.html'), 'nada ainda', 'utf8');

  // 4 - cutting.mp4
  const templateCut = path.join(__dirname, 'alunos', 'template', 'cutting.mp4');
  const destCut = path.join(local, 'assets', 'gifs', 'cutting.mp4');
  if (fs.existsSync(templateCut)) {
    fs.copyFileSync(templateCut, destCut);
  } else {
    // procura qualquer cutting existente no tipo
    try {
      const existentes = fs.readdirSync(basePath)
        .map(d => path.join(basePath, d, 'assets', 'gifs', 'cutting.mp4'))
        .find(f => fs.existsSync(f));
      if (existentes) fs.copyFileSync(existentes, destCut);
      else fs.writeFileSync(destCut, '', 'utf8');
    } catch {
      fs.writeFileSync(destCut, '', 'utf8');
    }
  }

  // 5 - registros/pesos.html
  const pesosHtml = `<!DOCTYPE html>
<html lang="pt-br">
<head><meta charset="UTF-8"><title>Pesos - ${nomeCompleto}</title></head>
<body>
<h1>Registros de Peso - ${nomeCompleto}</h1>
<p>Tipo: ${tipoNorm}</p>
<p>Pasta: ${pastaNome}</p>
<table border="1"><tr><th>Data</th><th>Peso</th></tr></table>
</body>
</html>`;
  fs.writeFileSync(path.join(local, 'registros', 'pesos.html'), pesosHtml, 'utf8');

  console.log(`[OK] Criado ${local} com 5 arquivos | PROX_PAD=${pad}`);
  return local;
}

function proximoNumero(tipo) {
  const base = path.join(__dirname, 'alunos', tipo.toLowerCase());
  let ultimo = 0;
  if (!fs.existsSync(base)) return 1;
  const pastas = fs.readdirSync(base);
  for (const p of pastas) {
    const m = p.match(/^([0-9]+)/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (n > ultimo) ultimo = n;
    }
  }
  return ultimo + 1;
}

module.exports = { criarEstruturaCompleta, proximoNumero };
