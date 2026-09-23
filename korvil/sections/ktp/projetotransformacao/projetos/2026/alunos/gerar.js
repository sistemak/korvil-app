// V25 FINAL REAL - korvil/sections/ktp/projetotransformacao/projetos/2026/alunos/gerar.js
// NUNCA GENERICO 42-marcos42 - SEMPRE PRIMEIRO NOME REAL + SEQUENCIAL
import fs from 'fs';
import path from 'path';

function limpar42a45(base) {
  if (!fs.existsSync(base)) return;
  const list = fs.readdirSync(base);
  for (const name of list) {
    const full = path.join(base, name);
    // deleta: 42, 43, 44, 45 soltos + 42-* 43-* 44-* 45-* + 42-*.json 43-*.json
    if (/^42$|^43$|^44$|^45$/.test(name) || /^42-.*$|^43-.*$|^44-.*$|^45-.*$/.test(name) || /^42-.*\.json$|^43-.*\.json$/.test(name)) {
      console.log(`🗑️ DELETE BUGGY: ${full}`);
      fs.rmSync(full, {recursive:true, force:true});
    }
  }
}

function obterProximoNumero(base) {
  if (!fs.existsSync(base)) return 1;
  const REGEX = /^(\d+)-[a-z0-9]+\d+$/; // só mãe válida número-nome+numero
  let max = 0;
  const dirs = fs.readdirSync(base, {withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name);
  for (const n of dirs) {
    const m = n.match(REGEX);
    if (!m) continue; // ignora numeric only e json solto
    const num = parseInt(m[1],10);
    if (num > max) max = num;
  }
  return max + 1;
}

function slugNome(nome) {
  const primeiro = (nome||'').trim().split(/\s+/)[0] || 'aluno';
  return primeiro.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
}

export function gerarAluno({tipo='presencial', nomeCompleto=''}) {
  const TIPO = tipo.toLowerCase().includes('pres') ? 'presencial' : 'online';
  const SLUG = slugNome(nomeCompleto);
  const ROOT = path.join(process.cwd(), 'korvil/sections/ktp/projetotransformacao/projetos/2026/alunos', TIPO);

  limpar42a45(ROOT);

  const PROX = obterProximoNumero(ROOT);
  const PAD = PROX;
  const PASTA = `${PAD}-${SLUG}${PROX}`; // ex: 46-joao46 DINAMICO REAL
  const LOCAL = path.join(ROOT, PASTA);

  fs.mkdirSync(path.join(LOCAL,'assets/gifs'), {recursive:true});
  fs.mkdirSync(path.join(LOCAL,'registros'), {recursive:true});

  // APENAS 5 ARQUIVOS DENTRO DA MÃE - NUNCA FORA - NUNCA DUPLICAR
  fs.writeFileSync(path.join(LOCAL, `${PASTA}.json`), JSON.stringify({
    id: PROX,
    pastaMae: PASTA,
    arquivo: `${PASTA}.json`,
    caminho: `${TIPO}/${PASTA}/${PASTA}.json`,
    primeiroNome: SLUG,
    nomeCompleto,
    tipo: TIPO,
    criadoEm: new Date().toISOString(),
    versao: 'V25'
  }, null, 2));

  fs.writeFileSync(path.join(LOCAL,'assets/index.html'), `<!DOCTYPE html><html><body>Assets ${PASTA} - ${nomeCompleto}</body></html>`);
  fs.writeFileSync(path.join(LOCAL,'assets/gifs/index.html'), `<!DOCTYPE html><html><body>Gifs ${PASTA}</body></html>`);
  // cutting.mp4 vazio placeholder - será substituído pelo upload real
  fs.writeFileSync(path.join(LOCAL,'assets/gifs/cutting.mp4'), '');
  fs.writeFileSync(path.join(LOCAL,'registros/pesos.html'), `<!DOCTYPE html><html><body>Pesos ${PASTA} - ${nomeCompleto} - V25</body></html>`);

  console.log(`✅ Criado SÓ DENTRO DA MÃE: ${LOCAL} - 5 arquivos`);
  return {PROX, PASTA, LOCAL};
}
