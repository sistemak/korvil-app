const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'korvil');

// mapeia onde cada arquivo/pasta REALMENTE está
const files = [];
function scan(dir){
  for(const e of fs.readdirSync(dir, {withFileTypes:true})){
    const p = path.join(dir, e.name);
    if(e.isDirectory()) scan(p);
    else files.push(p);
  }
}
scan(ROOT);

function findReal(targetName){
  // procura arquivo que termina com o nome procurado
  const clean = targetName.split('?')[0].split('#')[0].replace(/^\.?\//,'');
  const base = path.basename(clean);
  return files.find(f => f.endsWith(clean) || path.basename(f) === base);
}

for(const htmlPath of files.filter(f=>f.endsWith('.html'))){
  let txt = fs.readFileSync(htmlPath, 'utf8');
  const original = txt;

  txt = txt.replace(/(href|src)\s*=\s*["']([^"']+)["']/gi, (m, attr, url)=>{
    if(url.startsWith('http') || url.startsWith('#') || url.startsWith('data:') || url.startsWith('mailto:')) return m;
    
    // CASO 1: /korvil-app/sections/... -> /korvil-app/korvil/sections/...
    if(url.includes('/korvil-app/') && !url.includes('/korvil-app/korvil/')){
      const novo = url.replace('/korvil-app/', '/korvil-app/korvil/');
      return `${attr}="${novo}"`;
    }
    // CASO 2: /sections/... -> /korvil-app/korvil/sections/...
    if(url.startsWith('/sections/') || url.startsWith('/central') || url.startsWith('/ktp') || url.startsWith('/kai') || url.startsWith('/loja') || url.startsWith('/sok')){
      const novo = '/korvil-app/korvil' + url;
      return `${attr}="${novo}"`;
    }
    // CASO 3: relativo tipo "sections/ktp/index.html" mas o arquivo real está em outro lugar
    const real = findReal(url);
    if(real){
      let rel = path.relative(path.dirname(htmlPath), real).replace(/\\/g,'/');
      if(!rel.startsWith('.')) rel = './'+rel;
      return `${attr}="${rel}"`;
    }
    return m;
  });

  if(txt !== original){
    fs.writeFileSync(htmlPath, txt, 'utf8');
    console.log('ARRUMADO:', path.relative(ROOT, htmlPath));
  }
}
console.log('PRONTO - todos os códigos arrumados com caminho certo entre eles');
