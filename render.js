<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KORVIL - Visão Renderizada</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:Inter,system-ui,sans-serif;background:#f8f7ff;color:#1a1a1a}
  header{background:#6c5ce7;color:#fff;padding:16px 24px;position:sticky;top:0;z-index:10;display:flex;justify-content:space-between;align-items:center}
  header h1{font-size:18px}
  header small{opacity:.8}
  .container{padding:20px;max-width:1200px;margin:0 auto}
  .ano-bloco{background:#fff;border-radius:16px;padding:20px;margin-bottom:24px;box-shadow:0 4px 20px rgba(108,92,231,.1);border:1px solid #eee}
  .ano-titulo{font-size:22px;font-weight:800;color:#6c5ce7;margin-bottom:16px;display:flex;gap:10px;align-items:center}
  .turmas{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  @media(max-width:800px){.turmas{grid-template-columns:1fr}}
  .turma{background:#fafafa;border-radius:12px;padding:16px;border:1px solid #eee}
  .turma h3{font-size:14px;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;display:flex;justify-content:space-between}
  .turma.presencial h3{color:#e84393}
  .turma.online h3{color:#0984e3}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px}
  .card{background:#fff;border:1px solid #eee;border-radius:10px;padding:10px;display:flex;gap:8px;align-items:center;transition:.2s}
  .card:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,.08);border-color:#6c5ce7}
  .ordem{background:#6c5ce7;color:#fff;width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0}
  .nome{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .arquivo{font-size:10px;color:#888}
  .loading{padding:40px;text-align:center;color:#6c5ce7}
  .badge{background:#eee;padding:2px 8px;border-radius:20px;font-size:11px}
</style>
</head>
<body>
<header>
  <div>
    <h1>👁️ KORVIL - Visão Renderizada</h1>
    <small>Mostra tudo em ordem sem precisar clicar - Arquivo universal na raiz</small>
  </div>
  <small id="status">Carregando...</small>
</header>

<div class="container" id="app">
  <div class="loading">🔍 Buscando anos e alunas no GitHub...</div>
</div>

<script>
// CONFIG - MUDA AQUI SEU REPO
const REPO = 'sistemak/korvil-app';
const BRANCH = 'main';
const BASE = 'korvil/sections/ktp/projetotransformacao/projetos';

async function listarPastas(caminho) {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${caminho}?ref=${BRANCH}`);
    if(!res.ok) throw 'erro';
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch(e) {
    return [];
  }
}

function ordenarNumerico(arquivos) {
  return arquivos
    .filter(f => f.name.endsWith('.json'))
    .sort((a,b) => {
      const nA = parseInt(a.name.match(/^(\d+)/)?.[0] || 0);
      const nB = parseInt(b.name.match(/^(\d+)/)?.[0] || 0);
      return nA - nB;
    });
}

async function carregarAno(ano) {
  const pathPres = `${BASE}/${ano}/alunos/presencial`;
  const pathOnline = `${BASE}/${ano}/alunos/online`;

  const [presFiles, onlineFiles] = await Promise.all([
    listarPastas(pathPres),
    listarPastas(pathOnline)
  ]);

  return {
    ano,
    presencial: ordenarNumerico(presFiles),
    online: ordenarNumerico(onlineFiles)
  };
}

async function iniciar() {
  const app = document.getElementById('app');
  const status = document.getElementById('status');
  
  // 1. Lista anos em projetos/
  let pastas = await listarPastas(BASE);
  let anos = pastas
    .filter(p => p.type === 'dir' && /^\d{4}$/.test(p.name))
    .map(p => p.name)
    .sort((a,b) => b - a); // 2026, 2025...

  // Se API falhar (limite), usa mock do seu print
  if(anos.length === 0) {
    anos = ['2026'];
    console.log('Usando fallback 2026');
  }

  status.innerText = `${anos.length} ano(s) encontrado(s)`;
  
  app.innerHTML = '';

  for(const ano of anos) {
    const dados = await carregarAno(ano);
    
    // Se não achou nada, usa dados do seu print para demonstrar
    if(dados.presencial.length === 0 && ano === '2026') {
      dados.presencial = [
        {name:'01-mag1.json'},{name:'02-mcarla2.json'},{name:'03-vhellem3.json'},{name:'04-alexandra4.json'},
        {name:'05-michele5.json'},{name:'06-aline6.json'},{name:'07-adriana7.json'},{name:'08-joss8.json'},
        {name:'09-amigaadrum9.json'},{name:'10-amigaadrdois10.json'},{name:'11-angel11.json'},{name:'12-anapaula12.json'}
      ];
    }

    const bloco = document.createElement('div');
    bloco.className = 'ano-bloco';
    bloco.innerHTML = `
      <div class="ano-titulo">📅 ${ano} <span class="badge">${dados.presencial.length + dados.online.length} alunas</span></div>
      <div class="turmas">
        <div class="turma presencial">
          <h3>👩‍🏫 Presencial <span class="badge">${dados.presencial.length}</span></h3>
          <div class="grid">
            ${dados.presencial.map(f => {
              const ordem = f.name.split('-')[0];
              const nome = f.name.replace('.json','').replace(/^\d+-/,'');
              return `<div class="card"><div class="ordem">${ordem}</div><div><div class="nome">${nome}</div><div class="arquivo">${f.name}</div></div></div>`;
            }).join('') || '<small style="color:#888">Nenhuma aluna ainda</small>'}
          </div>
        </div>
        <div class="turma online">
          <h3>💻 Online <span class="badge">${dados.online.length}</span></h3>
          <div class="grid">
            ${dados.online.map(f => {
              const ordem = f.name.split('-')[0];
              const nome = f.name.replace('.json','').replace(/^\d+-/,'');
              return `<div class="card"><div class="ordem" style="background:#0984e3">${ordem}</div><div><div class="nome">${nome}</div><div class="arquivo">${f.name}</div></div></div>`;
            }).join('') || '<small style="color:#888">Nenhuma aluna ainda</small>'}
          </div>
        </div>
      </div>
    `;
    app.appendChild(bloco);
  }

  if(app.innerHTML === '') {
    app.innerHTML = '<div class="loading">Nenhum ano encontrado em projetos/</div>';
  }
}

iniciar();
</script>
</body>
</html>
