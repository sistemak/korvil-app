const fs=require('fs'),p=require('path');
async function main(){
  const q=process.argv.slice(2).join(' ')||'k-ai teste';
  let f='api/cadastro.js';
  if(/login/i.test(q)) f='api/login.js';
  if(/cadastro/i.test(q)) f='api/cadastro.js';
  const m=q.match(/api\/[a-z0-9_\-\/]+\.js/i); if(m) f=m[0];
  console.log('PEDIDO:',q,'->',f);
  let c='';
  if(process.env.GROQ_API_KEY){
    try{
      const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${process.env.GROQ_API_KEY}`},
        body:JSON.stringify({model:'llama-3.3-70b-versatile',messages:[{role:'system',content:`Crie código JS funcional para Vercel API Route em ${f}. Apenas código limpo, sem markdown. Se for login/cadastro, faça HTML bonito responsivo com gradiente roxo/azul.`},{role:'user',content:q}],temperature:0.7})
      });
      const j=await r.json();
      if(j.error) throw new Error(j.error.message);
      c=j.choices?.[0]?.message?.content||'';
      c=c.replace(/```[a-z]*\n?/gi,'').replace(/```/g,'').trim();
      console.log('GROQ OK',c.length);
    }catch(e){console.error('GROQ falhou',e.message)}
  }
  if(!c) c=`export default function handler(req,res){return res.json({ok:true,file:'${f}',pedido:'${q}'})}`.replace('${f}',f).replace('${q}',q.replace(/'/g,''));
  fs.mkdirSync(p.dirname(f),{recursive:true});
  fs.writeFileSync(f,c);
  console.log('✅ CRIADO',f);
}
main();
