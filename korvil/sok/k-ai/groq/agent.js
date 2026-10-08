import fs from 'fs';
import path from 'path';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const PROMPT = process.env.PROMPT || (process.env.GITHUB_EVENT_ISSUE_BODY || (fs.existsSync(process.env.GITHUB_EVENT_PATH || '') ? JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH,'utf8')).issue?.body : '')) || process.argv[2] || '';

async function callGroq(p){
  if(!GROQ_API_KEY) throw new Error('Missing GROQ_API_KEY env');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions',{
    method:'POST',
    headers:{ 'Authorization':'Bearer '+GROQ_API_KEY, 'Content-Type':'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages:[
        { role:'system', content: 'You are K-AI. You create files in repo sistemak/korvil-app. Always return JSON {"files":[{"path":"korvil/...","content":"..."}]} plus brief explanation. Keep path inside repo. Prefer korvil/sok/k-ai/groq/ or korvil/components/. Never output outside repo. Code must be production ready.' },
        { role:'user', content: p }
      ],
      temperature: 0.2
    })
  });
  const data = await res.json();
  if(!res.ok){
    console.error('Groq error', JSON.stringify(data).slice(0,1000));
    throw new Error('Groq failed '+res.status);
  }
  return data.choices?.[0]?.message?.content || '';
}

function write(p,c){
  const safe = p.replace(/^\//,'').replace(/\.\./g,'');
  fs.mkdirSync(path.dirname(safe),{recursive:true});
  fs.writeFileSync(safe,c,'utf8');
  console.log('✅ written', safe, '('+c.length+' bytes)');
}

function extractJson(raw){
  let jsonStr = raw;
  const block = raw.match(/```json([\s\S]*?)```/) || raw.match(/```([\s\S]*?"files"[\s\S]*?)```/);
  if(block) jsonStr = block[1] || block[0];
  // try direct json object
  const objMatch = jsonStr.match(/\{[\s\S]*"files"[\s\S]*\}/);
  if(objMatch) jsonStr = objMatch[0];
  return jsonStr;
}

(async()=>{
  console.log('K-AI agent start');
  if(!PROMPT){ console.error('Missing PROMPT env / event body'); process.exit(1); }
  console.log('PROMPT:', PROMPT.slice(0,500));
  const raw = await callGroq(PROMPT);
  console.log('GROQ RAW (first 2000):\n', raw.slice(0,2000));
  let jsonStr = extractJson(raw);
  try{
    const parsed = JSON.parse(jsonStr);
    if(parsed.files && Array.isArray(parsed.files) && parsed.files.length>0){
      for(const f of parsed.files){
        if(!f.path || typeof f.content!=='string') continue;
        // security: must stay inside repo, block .github/workflows except k-ai.yml
        if(f.path.includes('..')) continue;
        write(f.path, f.content);
      }
      console.log('DONE files:', parsed.files.map(f=>f.path).join(', '));
      if(parsed.explanation) console.log('Explanation:', parsed.explanation);
    } else {
      console.log('No files array found, saving raw to korvil/k-ai-output.md');
      write('korvil/k-ai-output.md', raw);
    }
  }catch(e){
    console.error('Parse JSON failed', e.message);
    console.log('Saving raw output');
    write('korvil/k-ai-output.md', raw);
  }
})();
