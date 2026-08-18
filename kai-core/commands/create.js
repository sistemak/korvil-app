
// kai-core/commands/create.js
import { KAITemplates } from '../templates/peca-template.js';

export async function createFile(tipo, nome) {
  const codigo = KAITemplates.getTemplate(tipo);
  
  // Cria e baixa o arquivo pra você subir no github
  const blob = new Blob([codigo], {type: 'text/html'});
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${nome}.html`;
  link.click();
  
  falar(`Arquivo ${nome}.html criado chefe. Faça upload na pasta kai-transformar`);
}

function falar(texto){
  const utter = new SpeechSynthesisUtterance(texto);
  utter.lang = 'pt-BR';
  speechSynthesis.speak(utter);
}
