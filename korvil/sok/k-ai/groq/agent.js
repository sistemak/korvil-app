import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GROQ_MODEL, GROQ_API_URL, SYSTEM_PROMPT } from './config.js';
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
function log(m){ console.log('[k-ai] ' + m); }
function ensureDir(filePath){
  var dir = path.dirname(filePath);
  if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});
}
function extractJSON(text){
  try{ return JSON.parse(text); }catch(e){}
  var match = text.match(/\{[\s\S]*"path"[\s\S]*"content"[\s\S]*\}/);
  if(match){ try{ return JSON.parse(match[0]); }catch(e){} }
  var codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if(codeBlock){ try{ return JSON.parse(codeBlock[1]); }catch(e){
    return { path: 'korvil/sok/k-ai/groq/generated.txt', content: codeBlock[1] };
  }}
  return null;
}
async function callGroq(prompt){
  var apiKey = process.env.GROQ_API_KEY;
  if(!apiKey) throw new Error('GROQ_API_KEY nao definido');
  var res = await fetch(GROQ_API_URL,{
    method:'POST',
    headers:{
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages:[
        {role:'system',content:SYSTEM_PROMPT},
        {role:'user',content:prompt}
      ],
      temperature:0.2,
      max_tokens:4096
    })
  });
  if(!res.ok){ var t=await res.text(); throw new Error('Groq error ' + res.status + ': ' + t); }
  var data = await res.json();
  return (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
}
async function main(){
  var prompt = process.argv[2] || process.argv.slice(2).join(' ') || 'crie um arquivo de exemplo';
  log('Prompt: ' + prompt);
  var raw = await callGroq(prompt);
  log('Resposta recebida (' + raw.length + ' chars)');
  var parsed = extractJSON(raw);
  if(!parsed || !parsed.path || !parsed.content){
    log('Nao foi possivel extrair path/content, salvando raw em output.txt');
    ensureDir(path.join(process.cwd(),'korvil/sok/k-ai/groq/output.txt'));
    fs.writeFileSync(path.join(process.cwd(),'korvil/sok/k-ai/groq/output.txt'), raw, 'utf8');
    return;
  }
  var targetPath = parsed.path;
  if(!path.isAbsolute(targetPath)) targetPath = path.join(process.cwd(), targetPath);
  ensureDir(targetPath);
  fs.writeFileSync(targetPath, parsed.content, 'utf8');
  log('Arquivo escrito: ' + parsed.path + ' (' + parsed.content.length + ' bytes)');
  var chatPath = path.join(process.cwd(),'korvil/sok/k-ai/groq/chat.js');
  if(fs.existsSync(chatPath)){
    log('chat.js ja existe, mantendo injecao');
  }
}
main().catch(function(e){ console.error(e); process.exit(1); });
