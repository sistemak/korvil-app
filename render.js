<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>KORVIL-APP - Raiz Renderizada</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:system-ui;background:#0d1117;color:#e6edf3}
header{background:#010409;border-bottom:1px solid #30363d;padding:16px 24px;position:sticky;top:0;z-index:10}
header h1{font-size:18px;color:#fff}
header span{color:#7d8590;font-size:12px}
.container{max-width:1400px;margin:0 auto;padding:20px;display:grid;grid-template-columns:280px 1fr;gap:20px}
@media(max-width:900px){.container{grid-template-columns:1fr}}
.sidebar{background:#010409;border:1px solid #30363d;border-radius:12px;padding:16px;height:fit-content;position:sticky;top:80px}
.sidebar h3{font-size:12px;text-transform:uppercase;color:#7d8590;margin-bottom:12px;letter-spacing:1px}
.folder{padding:8px 10px;border-radius:8px;cursor:pointer;display:flex;gap:8px;align-items:center;font-size:13px;margin-bottom:2px}
.folder:hover{background:#161b22}
.folder.active{background:#1f6feb;color:#fff}
.main{background:#010409;border:1px solid #30363d;border-radius:12px;padding:20px;min-height:600px}
.path{font-size:12px;color:#7d8590;margin-bottom:16px;font-family:monospace}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
.card{background:#0d1117;border:1px solid #30363d;border-radius:10px;padding:14px;transition:.2s}
.card:hover{border-color:#1f6feb;transform:translateY(-1px)}
.card.dir{border-left:3px solid #1f6feb}
.card.file{border-left:3px solid #30363d}
.card .name{font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.card .type{font-size:11px;color:#7d8590;margin-top:4px}
.card .size{font-size:10px;color:#484f58}
.preview{margin-top:20px;background:#0d1117;border:1px solid #30363d;border-radius:10px;padding:16px}
.preview pre{background:#161b22;padding:12px;border-radius:8px;overflow:auto;font-size:12px;max-height:400px}
.loading{text-align:center;padding:40px;color:#7d8590}
</style>
</head>
<body>
<header>
<h1>📦 korvil-app / <span id="current-path">raiz</span></h1>
<span>Visão renderizada universal desde a página inicial - sem precisar clicar pra abrir</span>
</header>

<div class="container">
<div class="sidebar" id="sidebar"><div class="loading">Carregando raiz...</div></div>
<div class="main" id="main"><div class="loading">Selecione uma pasta na esquerda ou veja tudo abaixo já renderizado...</div></div>
</div>

<script>
const REPO = 'sistemak/korvil-app';
const BRANCH = 'main';

async function fetchContents(path='') {
  const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`);
  if(!res.ok) throw new Error('API falhou');
  return await res.json();
}

async function renderRoot() {
  const sidebar = document.getElementById('sidebar');
  const main = document.getElementById('main');
  const currentPath = document.getElementById('current-path');

  try {
    const root = await fetchContents('');
    root.sort((a,b)=>{ if(a.type!==b.type) return a.type==='dir'?-1:1; return a.name.localeCompare(b.name) });

    // Sidebar - raiz
    sidebar.innerHTML = `<h3>📁 Raiz do repositório</h3>` + root.map(item=>{
      const icon = item.type==='dir'?'📁':'📄';
      return `<div class="folder" data-path="${item.path}" data-type="${item.type}">${icon} ${item.name}</div>`;
    }).join('');

    // Main - já mostra tudo renderizado desde a inicial, sem clique
    let html = `<div class="path">sistemak/korvil-app / (raiz)</div>`;
    html += `<h3 style="margin-bottom:12px">📦 ${root.length} itens na raiz - renderizados automaticamente</h3>`;
    html += `<div class="grid">`;
    
    for(const item of root) {
      const isDir = item.type==='dir';
      const icon = isDir ? '📁' : (item.name.endsWith('.html')?'🌐': item.name.endsWith('.json')?'📋' : item.name.endsWith('.md')?'📝' : '📄');
      html += `<div class="card ${isDir?'dir':'file'}" data-path="${item.path}">
        <div class="name">${icon} ${item.name}</div>
        <div class="type">${isDir?'Pasta':'Arquivo'} • ${item.path}</div>
        <div class="size">${isDir?'Clique para expandir':'Ver conteúdo'}</div>
      </div>`;
    }
    html += `</div>`;

    // Já expande as 3 primeiras pastas principais automaticamente pra mostrar que cada uma tem conteúdo diferente
    html += `<div style="margin-top:24px"><h3 style="margin-bottom:12px">🔍 Prévia automática das pastas principais (sem clicar)</h3></div>`;
    main.innerHTML = html;

    // Preview automático das pastas principais
    const principais = root.filter(r=>r.type==='dir').slice(0,5);
    for(const pasta of principais) {
      try {
        const conteudo = await fetchContents(pasta.path);
        const preview = document.createElement('div');
        preview.className = 'preview';
        preview.innerHTML = `<h4>📁 ${pasta.path} — ${conteudo.length} itens dentro (sistema diferente)</h4>
          <div class="grid" style="margin-top:12px">
            ${conteudo.slice(0,12).map(f=>{
              const ic = f.type==='dir'?'📁':'📄';
              return `<div class="card ${f.type==='dir'?'dir':'file'}"><div class="name">${ic} ${f.name}</div><div class="type">${f.type}</div></div>`;
            }).join('')}
            ${conteudo.length>12?`<div style="grid-column:1/-1;font-size:12px;color:#7d8590">+ mais ${conteudo.length-12} itens...</div>`:''}
          </div>`;
        main.appendChild(preview);
      } catch(e) {}
    }

    // Clique pra navegar
    document.querySelectorAll('.folder, .card').forEach(el=>{
      el.addEventListener('click', async ()=>{
        const path = el.dataset.path;
        const type = el.dataset.type || (el.classList.contains('dir')?'dir':'file');
        currentPath.textContent = path;
        if(type==='dir'){
          const items = await fetchContents(path);
          main.innerHTML = `<div class="path">${path}</div><div class="grid">${items.map(f=>{
            const ic = f.type==='dir'?'📁':'📄';
            return `<div class="card ${f.type==='dir'?'dir':'file'}" data-path="${f.path}" data-type="${f.type}"><div class="name">${ic} ${f.name}</div><div class="type">${f.type}</div></div>`;
          }).join('')}</div>`;
          // re-bind clicks
          main.querySelectorAll('.card').forEach(c=>c.addEventListener('click',()=>document.querySelector(`[data-path="${c.dataset.path}"]`)?.click()));
        } else {
          // arquivo
          const fileRes = await fetch(`https://raw.githubusercontent.com/${REPO}/${BRANCH}/${path}`);
          const text = await fileRes.text();
          main.innerHTML = `<div class="path">${path}</div><div class="preview"><h4>📄 ${path}</h4><pre>${text.substring(0,5000).replace(/</g,'&lt;')}</pre></div>`;
        }
      });
    });

  } catch(err) {
    document.getElementById('sidebar').innerHTML = `<div class="loading">Erro: ${err.message}<br><br>Mock da raiz:<br>📁 korvil<br>📁 ktp<br>📁 korvil-loja<br>📄 README.md<br>📄 index.html</div>`;
  }
}

renderRoot();
</script>
</body>
</html>
