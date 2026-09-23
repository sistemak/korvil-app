// gerar.js - util para gerar pasta mãe manualmente
const { gerarPastaMae, gerarConta } = require('./login/criar-conta-logic.js');
const nome = process.argv[2] || 'Sistema K';
console.log('Nome:', nome);
console.log('pasta-mae:', gerarPastaMae(nome));
console.log('arquivo:', gerarPastaMae(nome)+'.json');
console.log('path final:', 'korvil/sections/korvil-loja/login/contas/'+gerarPastaMae(nome)+'/'+gerarPastaMae(nome)+'.json');
