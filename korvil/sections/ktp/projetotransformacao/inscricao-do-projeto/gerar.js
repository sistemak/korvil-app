const fs = require('fs');

const tipo = process.env.TIPO;
const pNome = process.env.PNOME;
const dados = process.env.DADOS;

if (!tipo ||!pNome ||!dados) {
  console.error('Faltando env TIPO, PNOME ou DADOS');
  process.exit(1);
}

const base = `korvil/sections/ktp/projetotransformacao/projetos/2026/alunos/${tipo}`;

let ultimo = 0;
const regex = /^(\d+)-/;

if (fs.existsSync(base)) {
  fs.readdirSync(base).forEach(f => {
    let m = f.match(regex);
    if (m) ultimo = Math.max(ultimo, parseInt(m[1]));
    let full = base + '/' + f;
    if (fs.existsSync(full) && fs.statSync(full).isDirectory() && /^\d+$/.test(f)) {
      ultimo = Math.max(ultimo, parseInt(f));
      fs.readdirSync(full).forEach(ff => {
        let mm = ff.match(regex);
        if (mm) ultimo = Math.max(ultimo, parseInt(mm[1]));
      });
    }
  });
}

let prox = ultimo + 1;
let arq = `${prox}-${pNome}${prox}.json`;
let pasta = `${base}/${prox}`;

fs.mkdirSync(pasta, { recursive: true });
fs.mkdirSync(base, { recursive: true });

fs.writeFileSync(`${pasta}/${arq}`, dados);
fs.writeFileSync(`${base}/${arq}`, dados);

console.log(`✅ CRIADO: ${base}/${arq} e ${pasta}/${arq}`);
