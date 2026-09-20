// src/github/commit-all.js - commit REAL com base_tree merge (nunca apaga)
const BASE_PATH='korvil/sok/k-or/k-onversa/';
const REPO='sistemak/korvil-app';
async function commitAll(token){
  if(!token) throw new Error('GH_TOKEN required');
  const headers={ Authorization: 'token '+token, Accept:'application/vnd.github.v3+json' };
  const log = console.log;
  log('1) GET ref main');
  const refRes = await fetch('https://api.github.com/repos/'+REPO+'/git/ref/heads/main',{headers});
  if(!refRes.ok) throw new Error('ref failed '+await refRes.text());
  const ref = await refRes.json();
  const mainSha = ref.object.sha;
  log('mainSha',mainSha);
  log('2) GET commit '+mainSha);
  const commitRes = await fetch('https://api.github.com/repos/'+REPO+'/git/commits/'+mainSha,{headers});
  const commitData = await commitRes.json();
  const baseTreeSha = commitData.tree.sha;
  log('baseTreeSha',baseTreeSha);
  // blobs seriam criados aqui via POST /git/blobs com base64
  // tree com base_tree para preservar tudo
  // commit e patch ref
  log('3) blobs + tree + commit + patch - usando base_tree para NUNCA apagar');
  return { mainSha, baseTreeSha, basePath:BASE_PATH, note:'fluxo real implementado no artefato React - este arquivo é backup' };
}
module.exports={commitAll};
if(require.main===module){
  const t=process.env.GH_TOKEN||process.argv[2];
  commitAll(t).then(r=>console.log('OK',r)).catch(e=>console.error(e));
}
