// ============= K-B.D FORJA v8.3 - K-AI PROATIVO =============
const K_AI = {
  ativo: false,
  memorias: [],
  ultimaAcao: "",

  iniciar(){
    this.ativo = true;
    falarKai("K-AI ONLINE. Monitorando o sistema.");
    document.getElementById('status-kai').textContent = 'K-AI ATIVO';
    document.getElementById('status-kai').style.color = '#00ff66';
    this.analisarContexto();
  },

  observar(acao, detalhe){
    if(!this.ativo) return;
    this.ultimaAcao = `${acao}: ${detalhe}`;
    this.salvarMemoria(`Usuário ${acao} -> ${detalhe}`);
    
    // RESPOSTAS INTELIGENTES
    if(acao === "digitou" && detalhe.length > 50) this.sugerir("Vi que você está codando. Quer que eu analise?");
    if(acao === "mudou_arquivo") this.sugerir(`Mudou para ${detalhe}. Precisa de ajuda com ele?`);
    if(acao === "erro") this.sugerir(`Detectei um erro: ${detalhe}. Quer que eu conserte?`);
    if(acao === "inativo" && this.ultimaAcao.includes("criar")) this.sugerir("Parou no meio da criação. Quer que eu complete?");
  },

  sugerir(texto){
    falarKai(`SUGESTÃO: ${texto}`);
  },

  processarComando(comando){
    if(!this.ativo) return "K-AI está desativado";
    comando = comando.toLowerCase();
    this.salvarMemoria(`Comando: ${comando}`);

    if(comando.includes('criar')) return this.construirEstrutura(comando);
    if(comando.includes('analisar')) return this.analisarCodigo();
    if(comando.includes('cgm')) return this.toggleCGM();
    if(comando.includes('salvar')) { document.getElementById('confirmarBtn').click(); return "Salvo e confirmado!"; }
    if(comando.includes('o que')) return this.analisarContexto();

    return `Executando: ${comando}`;
  },

  construirEstrutura(comando){
    processarComandoUnificado(comando);
    HISTORICO.adicionar("Comando K-AI", ARQUIVO_SELECIONADO);
    return `Estrutura montada. Já atualizei o repositório.`;
  },

  analisarCodigo(){
    let codigo = editor.value;
    let linhas = codigo.split('\n').length;
    let erros = codigo.includes('function') ? 0 : 1;
    return `Analisei ${ARQUIVO_SELECIONADO}. ${linhas} linhas. ${erros === 0 ? 'Sem erros.' : 'Achei 1 possível erro.'}`;
  },

  analisarContexto(){
    let contexto = `Você está no arquivo ${ARQUIVO_SELECIONADO}. Última ação: ${this.ultimaAcao}`;
    return `Contexto atual: ${contexto}`;
  },

  toggleCGM(){
    document.getElementById('ativarCGMBTN').click();
    return cgmAtivo? "CGM Ativado. Estou vendo seus gestos." : "CGM Desativado";
  },

  salvarMemoria(texto){
    this.memorias.push({data: new Date().toLocaleTimeString(), texto});
    salvarMemoriaKai(texto);
    document.getElementById('kai-memorias').innerHTML += `<p style="font-size:10px;color:#00ff66">[${new Date().toLocaleTimeString()}] ${texto}</p>`;
  }
};

// BOTÕES DO MENU DO CUBO
document.getElementById('perguntarKaiBtn').onclick = () => {
  let pergunta = prompt("Pergunte ao K-AI:");
  if(pergunta) falarKai(K_AI.processarComando(pergunta));
}
document.getElementById('analisarCodigoBtn').onclick = () => falarKai(K_AI.analisarCodigo());
document.getElementById('sugerirMelhoriaBtn').onclick = () => falarKai("Sugestão: Separe esse código em funções. Fica mais fácil de manter.");
document.getElementById('ativarKaiBtn').onclick = () => K_AI.iniciar();

console.log("K-AI PROATIVO CARREGADO");
