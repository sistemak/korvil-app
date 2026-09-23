// garante login/contas + .gitkeep + remove joao_s_s
const fs=require('fs');
const path=require('path');

function ensure(){
  const base=path.join(__dirname,'..','login','contas');
  if(!fs.existsSync(base)) fs.mkdirSync(base,{recursive:true});
  // .gitkeep
  const gitkeep=path.join(base,'.gitkeep');
  if(!fs.existsSync(gitkeep)) fs.writeFileSync(gitkeep,'');
  // remove joao_s_s se existir
  const bad1=path.join(base,'joao_s_s');
  const bad2=path.join(base,'joao_s_s.json');
  [bad1,bad2].forEach(p=>{
    try{
      if(fs.existsSync(p)){
        const stat=fs.statSync(p);
        if(stat.isDirectory()) fs.rmSync(p,{recursive:true,force:true});
        else fs.unlinkSync(p);
        console.log('[KORVIL] removido legacy:',p);
      }
    }catch(e){ console.warn('falha remover',p,e.message); }
  });
  // lista
  const items=fs.readdirSync(base).filter(f=>!f.startsWith('.'));
  console.log('[KORVIL] contas estrutura OK:',base,'pastas:',items.length);
}
ensure();
module.exports={ensure};
