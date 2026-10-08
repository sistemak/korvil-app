import fs from 'fs';
import path from 'path';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const PROMPT = process.env.PROMPT || process.argv.slice(2).join(' ') || 'Atualize todos os arquivos mantendo GitHub clone UI';
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

if(!GROQ_API_KEY){
  console.error('GROQ_API_KEY ausente');
  process.exit(1);
}

const SYSTEM_PROMPT = `Você é K-AI, agente senior do repositório sistemak/korvil-app.
Tarefa: atualizar os 6 arquivos do sistema K-AI.
Responda SOMENTE JSON válido: {"files":[{"path":"...","content":"conteudo completo"}]}
Regras index.html:
- Primeira linha da fileList deve ser ../ (raiz) com borda verde #00ff41 e label (raiz)
- div#leftDropZone width 14px fixed left:0 top:0 bottom:0 z-index 999, border 2px dashed transparent, fica verde quando dragging
- #root-bar com outline 2px dashed #00ff41 quando dragging over
- fileList com onPointerDown onPointerMove onPointerUp para drag, folderOpenTimers 700ms auto-open pasta fechada quando arrastando em cima
- mini menu com: abrir, baixar, renomear, excluir REAL, copiar caminho, copiar conteúdo, duplicar, mover/recortar, colar aqui (move sem duplicar), anexar, criar arquivo, criar pasta, ver publicado, raw, histórico, mover para
- editor com textarea, terminal log embaixo, kaiBar fixed bottom com input#kaiInput placeholder "Digite igual Meta IA" e button Enviar que cria GitHub Issue usando GH_TOKEN do localStorage para disparar workflow
- auto ativa com localStorage token se existir senão public read
- mostra repo na root page inicial
Sem markdown, só JSON.`;

async function callGroq(){
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: PROMPT }
      ],
      temperature: 0.3,
      max_tokens: 8000
    })
  });
  if(!res.ok){
    const txt = await res.text();
    throw new Error('Groq API '+res.status+' '+txt);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '';
  console.log('RAW GROQ:', content.slice(0,500));
  let jsonStr = content.trim();
  // remove fences
  if(jsonStr.startsWith('```')) jsonStr = jsonStr.replace(/^\`\`\`json?\n?/, '').replace(/\n\`\`\`$/, '');
  try{
    return JSON.parse(jsonStr);
  }catch(e){
    // tentar extrair json
    const m = content.match(/\{[\s\S]*\}/);
    if(m) return JSON.parse(m[0]);
    throw e;
  }
}

async function main(){
  console.log('[K-AI] PROMPT:', PROMPT);
  console.log('[K-AI] MODEL:', MODEL);
  let out;
  try{
    out = await callGroq();
  }catch(e){
    console.error('Falha Groq, mantendo arquivos atuais:', e.message);
    // fallback: não apaga, só log
    return;
  }
  if(!out.files || !Array.isArray(out.files)){
    console.error('Formato inválido, esperado {files:[]}');
    return;
  }
  for(const f of out.files){
    if(!f.path || !f.content) continue;
    const full = path.join(process.cwd(), f.path);
    fs.mkdirSync(path.dirname(full), {recursive:true});
    fs.writeFileSync(full, f.content, 'utf8');
    console.log('[K-AI] escrito:', f.path, f.content.length+' bytes');
  }
  console.log('[K-AI] concluído', out.files.length, 'arquivos');
}

main();
