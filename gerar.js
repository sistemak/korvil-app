// gerar.js - gera estrutura inicial
const fs = require("fs");
const path = require("path");
const base = path.join(__dirname,"korvil/sections/korvil-loja/login/contas");
if(!fs.existsSync(base)) fs.mkdirSync(base,{recursive:true});
if(!fs.existsSync(path.join(base,".gitkeep"))) fs.writeFileSync(path.join(base,".gitkeep"),"# keep\n");
console.log("✓ gerar.js ok - contas dir:", base);
