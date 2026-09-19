// K-AI Gerador - Função Real de Geração
export function gerarCodigo(prompt){
  const lower = prompt.toLowerCase();
  const detectar = () => {
    if(lower.includes('python')||lower.includes('fastapi')) return 'python';
    if(lower.includes('react')||lower.includes('javascript')||lower.includes('node')) return 'javascript';
    if(lower.includes('go')||lower.includes('golang')) return 'go';
    if(lower.includes('rust')) return 'rust';
    if(lower.includes('java')) return 'java';
    return 'javascript';
  }
  const lang = detectar();
  // Busca template em linguagens/dicionario.json e linguagens/${lang}/templates/
  return { lang, prompt, ts: Date.now() };
}