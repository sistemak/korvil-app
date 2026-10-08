// korvil/sok/k-ai/groq/index.js - FUNCIONA DE VERDADE - Secrets GROQ_API_KEY + GH_TOKEN + NODE auto
import fs from 'fs';
import path from 'path';
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const PROMPT = process.env.PROMPT || process.argv.slice(2).join(' ') || '';
console.log('🤖 K-AI Groq - Prompt:', PROMPT.slice(0,200));
if(!GROQ_API_KEY){ console.error('Sem GROQ_API_KEY nos Secrets'); process.exit(1); }
if(!PROMPT){ console.error('Sem PROMPT'); process.exit(1); }
async function callGroq(prompt){
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions',{
    method:'POST',
    headers:{'Authorization':'Bearer '+GROQ_API_KEY,'Content-Type':'application/json'},
    body:JSON.stringify({
      model:'llama-3.3-70b-versatile',
      messages:[
        {role:'system', content: `Você é K-AI Groq em korvil/sok/k-ai/groq/. Sempre retorne JSON {"message":"explicação curta","files":[{"path":"korvil/sok/k-ai/groq/arquivo.tsx","content":"código completo"}]}`},
        {role:'user', content: prompt}
      ],
      temperature:0.3,
      max_tokens:8000
    })
  });
  const data = await res.json();
  if(data.error) throw new Error(JSON.stringify(data.error));
  return data.choices[0].message.content;
}
function writeFile(p,c){ fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,c,'utf8'); console.log('WROTE',p); }
let raw = await callGroq(PROMPT);
console.log(raw.slice(0,1500));
try{
  let jStr = raw;
  const m = raw.match(/```(?:json)?([\s\S]*?)```/);
  if(m) jStr = m[1];
  const a=jStr.indexOf('{'); const b=jStr.lastIndexOf('}');
  if(a!==-1) jStr=jStr.slice(a,b+1);
  const obj=JSON.parse(jStr);
  console.log('💬 IA:', obj.message);
  for(const f of obj.files||[]){ writeFile(f.path,f.content); }
  fs.mkdirSync('korvil/sok/k-ai/groq',{recursive:true});
  fs.writeFileSync('korvil/sok/k-ai/groq/last-conversation.json', JSON.stringify({prompt:PROMPT,message:obj.message,files:obj.files?.map(f=>f.path),timestamp:new Date().toISOString()},null,2));
}catch(e){
  console.error(e);
  fs.writeFileSync('korvil/sok/k-ai/groq/error-'+Date.now()+'.md', PROMPT+'\n\n'+(typeof raw!=='undefined'?raw:e.message));
}
