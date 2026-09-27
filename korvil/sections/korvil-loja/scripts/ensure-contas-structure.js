const fs=require('fs');
const path=require('path');
const base=path.join(__dirname,'..','login','contas');
fs.mkdirSync(base,{recursive:true});
const keep=path.join(base,'.gitkeep');
if(!fs.existsSync(keep)) fs.writeFileSync(keep,'# contas
','utf8');
console.log('Estrutura contas OK:',base);
