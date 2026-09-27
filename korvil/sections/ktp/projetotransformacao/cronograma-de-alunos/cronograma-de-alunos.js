// korvil/sections/ktp/projetotransformacao/cronograma-de-alunos/cronograma-de-alunos.js
// Node fs + fetch - wrapper simples para JSON raiz
const fs = typeof require!=='undefined' ? require('fs') : null;
const pathLib = typeof require!=='undefined' ? require('path') : null;
async function loadCronograma(){
  try{
    if(fs && pathLib){
      var p = pathLib.join(__dirname,'cronograma-de-alunos.json');
      if(fs.existsSync(p)) return JSON.parse(fs.readFileSync(p,'utf8'));
    }
  }catch(e){}
  try{
    var r = await fetch('./cronograma-de-alunos.json');
    return await r.json();
  }catch(e){ return {PRESENCIAL:[], ONLINE:[]}; }
}
if(typeof module!=='undefined'){ module.exports = {loadCronograma: loadCronograma}; }
window.KTP_LOAD = loadCronograma;
