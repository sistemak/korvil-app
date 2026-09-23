// helper - gera estrutura completa KORVIL sem erros
const fs=require('fs');
const path=require('path');

const files={
  'korvil/sections/korvil-loja/login/contas/.gitkeep':'',
  'korvil/sections/korvil-loja/login/contas/sistema-k/sistema-k.json': JSON.stringify({
    nome:"Sistema K", email:"sistemak.srv@gmail.com", cpf:"453.814.988-88", tel:"(13)99769-0898",
    cep:"11250-524", numero:"2407", rua:"Rua Oswaldo Cruz", bairro:"Jardim Vicente de Carvalho",
    cidade:"Bertioga", uf:"SP", pastaMae:"sistema-k", arquivo:"sistema-k.json",
    id:"sistema-k_demo", sistema:"KORVIL", createdAt:new Date().toISOString(), foto:""
  },null,2)
};

function ensure(p){
  const dir=path.dirname(p);
  if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});
}
console.log('[KORVIL gerar.js] criando estrutura exemplo...');
Object.entries(files).forEach(([rel,content])=>{
  const full=path.join(__dirname,rel);
  ensure(full);
  if(!fs.existsSync(full)) { fs.writeFileSync(full,content,'utf-8'); console.log(' +',rel); }
  else { console.log(' = existe',rel); }
});
// remove joao_s_s
['korvil/sections/korvil-loja/login/contas/joao_s_s','korvil/sections/korvil-loja/login/contas/joao_s_s.json'].forEach(rel=>{
  const full=path.join(__dirname,rel);
  try{ if(fs.existsSync(full)){ const st=fs.statSync(full); if(st.isDirectory()) fs.rmSync(full,{recursive:true,force:true}); else fs.unlinkSync(full); console.log(' - removido',rel); } }catch{}
});
console.log('[KORVIL] gerar.js OK - rode npm start');
