// korvil/sections/ktp/projetotransformacao/config/node-config.js
// Octokit para 9 arquivos - commitFile nunca duplica usando SHA
const OWNER='sistemak';
const REPO='korvil-app';
const BRANCH='main';

async function getOctokit(token){
  var mod = null;
  try{ mod = await import('@octokit/rest'); }catch(e){ mod = null; }
  if(!mod || !mod.Octokit) throw new Error('Octokit não disponível - instale @octokit/rest');
  return new mod.Octokit({auth: token || process.env.GH_TOKEN_REAL});
}

async function getSha(octokit, filePath){
  try{
    var res = await octokit.repos.getContent({owner:OWNER, repo:REPO, path:filePath, ref:BRANCH});
    return res.data.sha;
  }catch{ return null; }
}

async function commitFile(octokit, filePath, content){
  var sha = await getSha(octokit, filePath);
  var b64 = Buffer.from(content).toString('base64');
  await octokit.repos.createOrUpdateFileContents({
    owner:OWNER, repo:REPO, path:filePath,
    message:'KTP MASTER 9 ARQUIVOS - ' + filePath + ' - ' + new Date().toISOString(),
    content:b64,
    sha: sha || undefined,
    branch:BRANCH
  });
}

async function commit9Files(token, files){
  var octokit = await getOctokit(token);
  for(var i=0;i<files.length;i++){
    var f = files[i];
    await commitFile(octokit, f.path, f.content);
    console.log('COMMIT OK', f.path);
  }
}

if(typeof module!=='undefined'){ module.exports = {getOctokit:getOctokit, commitFile:commitFile, commit9Files:commit9Files, OWNER:OWNER, REPO:REPO, BRANCH:BRANCH}; }
