// ensure-contas-structure.js - Garante estrutura contas/{pasta-mae}/{pasta-mae}.json
const fs = require('fs');
const path = require('path');
function ensure(){
  const base = path.join(__dirname, 'contas');
  if(!fs.existsSync(base)) fs.mkdirSync(base,{recursive:true});
  const keep = path.join(base,'.gitkeep');
  if(!fs.existsSync(keep)) fs.writeFileSync(keep,'');
  console.log('✓ Estrutura garantida:', base);
}
ensure();
module.exports = { ensure };
if(require.main===module) ensure();
