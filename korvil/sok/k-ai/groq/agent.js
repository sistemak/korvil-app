// korvil/sok/k-ai/groq/agent.js - Real working agent Groq + GitHub auto writer
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GROQ_API_KEY = process.env.GROQ_API_KEY || process.env.GROQ_KEY || '';
const MODEL = process.env.MODEL || 'llama-3.3-70b-versatile';
const API = 'https://api.groq.com/openai/v1/chat/completions';

function log(...a){ console.log('[k-ai:agent]',...a); }

async function callGroq(prompt){
  if(!GROQ_API_KEY){ throw new Error('GROQ_API_KEY ausente no env'); }
  const body = {
    model: MODEL,
    messages: [
      { role:'system', content: 'Você é K-AI. Responda sempre em JSON válido {"path":"caminho/arquivo.ext","content":"codigo aqui"} sem markdown. Se precisar criar multiplos arquivos, retorne um por chamada. Use REPO_PATH korvil/sok/k-ai/groq/ como base. Sempre injete <script src="/korvil/sok/k-ai/groq/chat.js"></script> se for HTML.' },
      { role:'user', content: prompt }
    ],
    temperature: 0.2,
    max_tokens: 4096
  };
  const r = await fetch(API,{ method:'POST', headers:{ 'Authorization':'Bearer '+GROQ_API_KEY, 'Content-Type':'application/json' }, body: JSON.stringify(body) });
  const j = await r.json();
  if(!r.ok){ throw new Error('Groq erro: '+JSON.stringify(j)); }
  const content = j.choices?.[0]?.message?.content || '';
  return content;
}

function ensureInjectChat(filePath, content){
  if(/\.html?$/.test(filePath) && !content.includes('korvil/sok/k-ai/groq/chat.js')){
    if(content.includes('</body>')) return content.replace('</body>', '<script src="/korvil/sok/k-ai/groq/chat.js"></script></body>');
    return content + '\n<script src="/korvil/sok/k-ai/groq/chat.js"></script>\n';
  }
  if(/\.js$/.test(filePath) && !content.includes('chat.js')){
    // não injeta em JS, mas comenta
  }
  return content;
}

async function main(){
  const prompt = process.argv[2] || process.env.K_AI_PROMPT || 'k-ai cria api/hello.js com hello world';
  log('Prompt recebido:', prompt);
  let raw = '';
  try{ raw = await callGroq(prompt); }catch(e){ console.error(e); process.exit(1); }
  log('Resposta bruta:', raw.slice(0,400));
  let parsed;
  try{
    // tenta extrair JSON
    const m = raw.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(m?m[0]:raw);
  }catch{
    console.error('Falha parse JSON, salvando como txt');
    parsed = { path: 'korvil/sok/k-ai/groq/output.txt', content: raw };
  }
  if(!parsed.path || !parsed.content){ console.error('JSON inválido precisa {path,content}'); process.exit(1); }
  const fullPath = path.isAbsolute(parsed.path) ? parsed.path : path.join(process.cwd(), parsed.path);
  const dir = path.dirname(fullPath);
  fs.mkdirSync(dir,{recursive:true});
  const finalContent = ensureInjectChat(parsed.path, parsed.content);
  fs.writeFileSync(fullPath, finalContent,'utf8');
  log('Arquivo gravado:', fullPath, 'bytes', Buffer.byteLength(finalContent));
  // tenta git commit se dentro de repo? O workflow faz commit via API
}

main();
