// K-TP 2026 - gerar.js V5 FINAL - DELETE 42-45 + CRIA PASTA MAE MODELO 01-mag01
const fs = require('fs');
const path = require('path');

const BASE_PRESENCIAL = "korvil/sections/ktp/projetotransformacao/projetos/2026/alunos/presencial";
const BASE_ONLINE = "korvil/sections/ktp/projetotransformacao/projetos/2026/alunos/online";

function limpar42a45() {
  console.log(">> Iniciando limpeza 42-45 presencial e online...");
  [BASE_PRESENCIAL, BASE_ONLINE].forEach(base => {
    if (!fs.existsSync(base)) return;
    fs.readdirSync(base).forEach(dir => {
      const match = dir.match(/^(4[2-5])-/);
      if (match) {
        const full = path.join(base, dir);
        console.log("  DELETANDO PASTA INTEIRA:", full);
        fs.rmSync(full, { recursive: true, force: true });
      }
    });
  });
}

function sanitizarSlug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
}

function obterProximoNumero(tipo) {
  const base = tipo === 'online' ? BASE_ONLINE : BASE_PRESENCIAL;
  if (!fs.existsSync(base)) return 42;
  const numeros = fs.readdirSync(base)
    .map(d => parseInt(d.split('-')[0], 10))
    .filter(n => !isNaN(n) && n < 42)
    .sort((a,b) => a-b);
  const ultimo = numeros.length ? numeros[numeros.length-1] : 0;
  let prox = ultimo + 1;
  if (prox < 42) prox = 42;
  return prox;
}

function criarPastaMae({ slug, tipo, nome_completo, texto_formatado }) {
  limpar42a45();

  const SLUG = sanitizarSlug(slug);
  if (!SLUG) throw new Error("SLUG invalido");
  const TIPO = tipo === 'online' ? 'online' : 'presencial';
  const BASE = TIPO === 'online' ? BASE_ONLINE : BASE_PRESENCIAL;
  const PROX = obterProximoNumero(TIPO);
  const PAD = String(PROX).padStart(2,'0');
  const PASTA = PAD + "-" + SLUG;
  const LOCAL = path.join(BASE, PASTA);

  if (fs.existsSync(LOCAL)) throw new Error("PASTA ja existe: " + PASTA);

  console.log(">> Criando pasta mae:", LOCAL);
  fs.mkdirSync(path.join(LOCAL, "assets/gifs"), { recursive: true });
  fs.mkdirSync(path.join(LOCAL, "registros"), { recursive: true });

  // 1) PASTA.json dentro da mae
  fs.writeFileSync(path.join(LOCAL, PASTA + ".json"), texto_formatado, "utf8");

  // 2) assets/index.html
  fs.writeFileSync(path.join(LOCAL, "assets/index.html"), "nada ainda", "utf8");

  // 3) assets/gifs/index.html
  fs.writeFileSync(path.join(LOCAL, "assets/gifs/index.html"), "nada ainda", "utf8");

  // 4) cutting.mp4 placeholder
  const templateMp4 = path.join(BASE_PRESENCIAL, "01-mag01/assets/gifs/cutting.mp4");
  const destMp4 = path.join(LOCAL, "assets/gifs/cutting.mp4");
  if (fs.existsSync(templateMp4)) {
    fs.copyFileSync(templateMp4, destMp4);
  } else {
    fs.writeFileSync(destMp4, "", "utf8");
  }

  // 5) registros/pesos.html modelo vazio
  const pesosHtml = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>K-TP 2026 - ${PASTA}</title><style>body{font-family:Arial;background:#0a0a0a;color:#fff;padding:20px}.card{display:inline-block;background:#111;border:1px solid #222;padding:15px;margin:5px;border-radius:8px;min-width:160px}</style></head><body><h1>K-TP PROJETO TRANSFORMAÇÃO 11º ANO - 2026</h1><h2>${PASTA} - ${nome_completo} | ${TIPO}</h2><div><div class="card">Semanas: 0</div><div class="card">Peso: -- kg</div></div><p>Nenhum peso registrado ainda</p><p>Aguardando primeiro registro</p><script>const pesos=[];const totalRegistros=0;</script></body></html>`;
  fs.writeFileSync(path.join(LOCAL, "registros/pesos.html"), pesosHtml, "utf8");

  console.log(">> Estrutura criada 5 arquivos dentro da mae:");
  console.log(" - " + PASTA + ".json");
  console.log(" - assets/index.html");
  console.log(" - assets/gifs/index.html");
  console.log(" - assets/gifs/cutting.mp4");
  console.log(" - registros/pesos.html");

  return { pasta: PASTA, local: LOCAL, proximo: PROX };
}

module.exports = { limpar42a45, criarPastaMae, obterProximoNumero };

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args[0] === 'limpar') limpar42a45();
}
