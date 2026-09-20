const BASE='korvil/sok/k-or/k-onversa/';
const TURQ='#00E6CC';
console.log('K-ONVERSA carregado',BASE);
async function commitReal(){
  const token = localStorage.getItem('gh_token');
  if(!token){ alert('Cole seu GH_TOKEN na caixa de token!'); return; }
  const log = (m)=>{ const el=document.getElementById('logs'); if(el){ el.textContent+=m+"\n"; } console.log(m); };
  log('Iniciando commit REAL em '+BASE+'...');
  // fluxo igual ao artefato React: GET ref, GET commit, blobs, tree com base_tree, commit, patch ref
}
window.commitReal = commitReal;
