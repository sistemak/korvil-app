const fs = require('fs');
const path = require('path');

async function main(){
  const pedido = process.argv.slice(2).join(' ') || 'cria api/teste.js';
  console.log('PEDIDO:', pedido);

  let filePath = 'api/generated.js';
  const m = pedido.match(/(?:api\/|pasta\/)?([a-z0-9_\-\/]+\.(?:js|jsx|ts|tsx))/i);
  if(m) filePath = m[1].startsWith('api/')? m[1] : 'api/' + m[1].replace('api/','');
  if(pedido.includes('api/login')) filePath = 'api/login.js';
  if(pedido.includes('api/cadastro')) filePath = 'api/cadastro.js';

  let content = '';
  try{
    if(process.env.GROQ_API_KEY){
      const Groq = require('groq-sdk');
      const groq = new Groq({apiKey: process.env.GROQ_API_KEY});
      const res = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{role:'user', content: `Crie APENAS o código do arquivo ${filePath} para: ${pedido}. Retorne só código.`}],
      });
      content = res.choices[0].message.content.replace(/```[a-z]*\n?/gi,'').replace(/```/g,'').trim();
    }
  }catch(e){ console.log('Groq falhou, usando fallback:', e.message); }

  if(!content || content.length < 20){
    if(filePath.includes('login')){
      content = `export default function handler(req,res){res.send('login ok')}`;
    }else if(filePath.includes('cadastro')){
      content = `export default function handler(req,res){res.status(200).json({ok:true, msg:'Cadastro criado por K-AI'})}`;
    }else{
      content = `// Criado por K-AI para: ${pedido}\nexport default function handler(req,res){res.json({ok:true})}`;
    }
  }

  fs.mkdirSync(path.dirname(filePath), {recursive:true});
  fs.writeFileSync(filePath, content);
  console.log('ARQUIVO CRIADO:', filePath);
}
main();
