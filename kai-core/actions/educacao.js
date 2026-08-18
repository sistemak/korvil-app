const Educacao = {
  async executar(cmd) {
    cmd = cmd.toLowerCase();
    if(cmd.includes("aula")) return this.criarAula(cmd);
    if(cmd.includes("curso")) return this.criarCurso(cmd);
    if(cmd.includes("exercicio")) return this.criarExercicio(cmd);
    if(cmd.includes("prova")) return this.criarProva(cmd);
    if(cmd.includes("resumo")) return this.resumirAula(cmd);
    if(cmd.includes("mapa mental")) return this.criarMapaMental(cmd);
    return `Educação: ${cmd}`;
  },

  criarAula(cmd){ return `Aula criada: Título, Conteúdo, Exercício sobre ${cmd}`},
  criarCurso(cmd){ return `Curso criado: 10 módulos sobre ${cmd}`},
  criarExercicio(cmd){ return `Exercício: 5 questões sobre ${cmd}`},
  criarProva(cmd){ return `Prova com 20 questões criada`},
  resumirAula(cmd){ return `Resumo da aula: 3 pontos principais`},
  criarMapaMental(cmd){ return `Mapa mental criado sobre ${cmd}`},

  // 7-100: ACADEMIA KORVIL
  corrigirExercicio(){return "Exercício corrigido. Nota: 9.0"},
  gerarCertificado(){return "Certificado gerado"},
  criarCronograma(){return "Cronograma de estudos criado"},
  recomendarLivro(){return "Livro recomendado: Pai Rico Pai Pobre"},
  criarDesafio(){return "Desafio 21 dias criado"},
  mentoria(){return "Sessão de mentoria agendada"},
  tirarDuvida(){return "Dúvida respondida com exemplo"},
  criarFlashcard(){return "Flashcards criados"},
  simularProva(){return "Simulado criado"},
  acompanharProgresso(){return "Progresso: 65% concluído"},
  //... até 100
  educacao100(){return "Educação 100 executado"}
}
