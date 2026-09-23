// ensure-contas-structure.js - garante estrutura de contas
const fs = require("fs");
const path = require("path");
const dirs = [
  "korvil/sections/korvil-loja/login/contas",
  "korvil/sections/korvil-loja/login/contas/.gitkeep",
  "login/contas",
  "korvil/sections/korvil-loja/scripts"
];
dirs.forEach(d=>{
  const full = path.join(__dirname,"..","..","..",d);
  if(d.endsWith(".gitkeep")){
    const dir = path.dirname(full);
    if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});
    if(!fs.existsSync(full)) fs.writeFileSync(full,"# keep\n");
  } else {
    if(!fs.existsSync(full)) fs.mkdirSync(full,{recursive:true});
  }
});
console.log("✓ Estrutura contas garantida");
