// render.js - cole na raiz do repo korvil-app/render.js
(async function() {
  const REPO = 'sistemak/korvil-app';
  const BASE = 'korvil/sections/ktp/projetotransformacao/projetos';

  async function list(path) {
    const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`);
    return r.ok? await r.json() : [];
  }

  function sortNum(arr) {
    return arr.filter(f=>f.name.endsWith('.json')).sort((a,b)=>{
      return parseInt(a.name.match(/^\d+/)[0]) - parseInt(b.name.match(/^\d+/)[0])
    });
  }

  const container = document.querySelector('[data-testid="repos-file-tree-container"],.Box, main');
  if(!container) return alert('Abra dentro do GitHub primeiro');

  const anos = (await list(BASE)).filter(p=>/^\d{4}$/.test(p.name)).map(p=>p.name).sort((a,b)=>b-a);
  if(!anos.length) anos.push('2026');

  let html = `<div style="font-family:system-ui;background:#fff;border:2px solid #6c5ce7;border-radius:16px;padding:20px;margin:20px 0">
  <h2 style="color:#6c5ce7">👁️ KORVIL - Visão Renderizada (Auto)</h2>
  <p style="font-size:12px;color:#666">Mostrando desde a raiz original em ordem 01,02,03...</p>`;

  for(const ano of anos) {
    const pres = sortNum(await list(`${BASE}/${ano}/alunos/presencial`));
    const online = sortNum(await list(`${BASE}/${ano}/alunos/online`));

    html += `<div style="margin-top:20px"><h3>📅 ${ano} - ${pres.length+online.length} alunas</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px">
      <div><b style="color:#e84393">PRESENCIAL (${pres.length})</b><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:6px;margin-top:6px">
      ${pres.map(f=>`<div style="border:1px solid #eee;border-radius:8px;padding:8px"><b style="background:#6c5ce7;color:#fff;border-radius:6px;padding:2px 6px;font-size:11px">${f.name.split('-')[0]}</b><div style="font-size:12px">${f.name}</div></div>`).join('')}</div></div>
      <div><b style="color:#0984e3">ONLINE (${online.length})</b><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:6px;margin-top:6px">
      ${online.map(f=>`<div style="border:1px solid #eee;border-radius:8px;padding:8px"><b style="background:#0984e3;color:#fff;border-radius:6px;padding:2px 6px;font-size:11px">${f.name.split('-')[0]}</b><div style="font-size:12px">${f.name}</div></div>`).join('')}</div></div>
    </div></div>`;
  }
  html += `</div>`;

  document.querySelector('.react-directory-filename-column, [role="grid"],.Box').insertAdjacentHTML('beforebegin', html);
  window.scrollTo(0,0);
})();
