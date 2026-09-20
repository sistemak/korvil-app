// src/github/commit-all.js - CODIGO MESTRE LEVE
// Usa GH_TOKEN de process.env e nunca apaga nada (base_tree)
import fs from 'fs';

const REPO='sistemak/korvil-app';
const BASE_PATH='korvil/sok/k-or/k-onversa';
const MSG='feat: atualiza k-onversa completo k-or - código mestre';

async function commitAll(files){
  const token=process.env.GH_TOKEN;
  if(!token) throw new Error('GH_TOKEN ausente');
  const gh=(u,o={})=>fetch(`https://api.github.com${u}`,{...o, headers:{ Authorization:`Bearer ${token}`, Accept:'application/vnd.github+json', 'Content-Type':'application/json', ...(o.headers||{})}});
  const ref=await gh(`/repos/${REPO}/git/ref/heads/main`).then(r=>r.json());
  const latest=ref.object.sha;
  const baseTree=await gh(`/repos/${REPO}/git/commits/${latest}`).then(r=>r.json()).then(j=>j.tree.sha);
  const entries=[];
  for(const f of files){
    const b64=Buffer.from(f.content,'utf8').toString('base64');
    const blob=await gh(`/repos/${REPO}/git/blobs`,{method:'POST', body:JSON.stringify({content:b64, encoding:'base64'})}).then(r=>r.json());
    entries.push({ path:`${BASE_PATH}/${f.path}`, mode:'100644', type:'blob', sha:blob.sha });
    console.log('blob ok', f.path, blob.sha.slice(0,7));
  }
  const newTree=await gh(`/repos/${REPO}/git/trees`,{method:'POST', body:JSON.stringify({base_tree:baseTree, tree:entries})}).then(r=>r.json());
  const newCommit=await gh(`/repos/${REPO}/git/commits`,{method:'POST', body:JSON.stringify({message:MSG, tree:newTree.sha, parents:[latest]})}).then(r=>r.json());
  await gh(`/repos/${REPO}/git/refs/heads/main`,{method:'PATCH', body:JSON.stringify({sha:newCommit.sha})});
  console.log('COMMIT REAL OK', newCommit.sha, `https://github.com/${REPO}/commit/${newCommit.sha}`);
  return newCommit;
}
export { commitAll };
