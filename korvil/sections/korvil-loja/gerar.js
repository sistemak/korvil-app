// gerar estrutura inicial se necessario
const fs=require('fs'); const path=require('path');
const base=path.join(__dirname,'login','contas');
fs.mkdirSync(base,{recursive:true});
fs.writeFileSync(path.join(base,'.gitkeep'),'# keep
');
console.log('gerar.js ok',base);
