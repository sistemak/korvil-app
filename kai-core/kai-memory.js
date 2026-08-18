const KAI_MEMORY = {
  dados: {
    usuario: "Chefe",
    modo: "ilimitado",
    criado_em: new Date().toISOString().split('T')[0],
    historico: [],
    memorias_importantes: [],
    preferencias: {
      voz_grave: true,
      auto_ouvir: true,
      nome: "Chefe"
    }
  },
  caminho: '/memory/conversa.json',

  // ===== CARREGAR MEMÓRIA =====
  async carregar() {
    try {
      // Tenta localStorage primeiro pra ficar rápido
      const local = localStorage.getItem('kai_memoria');
      if(local){
        this.dados = JSON.parse(local);
        console.log("Memória carregada do localStorage");
      } else {
        // Se não tiver, tenta buscar do arquivo
        const res = await fetch(this.caminho);
        if(res.ok){
          this.dados = await res.json();
          this.salvarLocal();
          console.log("Memória carregada do arquivo");
        }
      }
    } catch(e) {
      console.log("Criando nova memória");
      this.dados.criado_em = new Date().toISOString().split('T')[0];
    }
    // Aplica preferências no KAI_CONFIG
    if(window.KAI_CONFIG){
      KAI_CONFIG.nomeUsuario = this.dados.preferencias.nome;
      KAI_CONFIG.autoOuvir = this.dados.preferencias.auto_ouvir;
    }
  },

  // ===== SALVAR MEMÓRIA =====
  async salvar() {
    this.dados.ultimo_acesso = new Date().toISOString();
    this.salvarLocal();
    // Tenta salvar no arquivo também
    try {
      await fetch(this.caminho, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(this.dados)
      });
    } catch(e) {
      console.log("Salvo só no localStorage. Servidor não disponível");
    }
  },

  salvarLocal() {
    localStorage.setItem('kai_memoria', JSON.stringify(this.dados));
  },

  // ===== ADICIONAR CONVERSA =====
  adicionarConversa(pergunta, resposta) {
    const item = {
      id: Date.now(),
      data: new Date().toISOString(),
      pergunta: pergunta,
      resposta: resposta
    };
    this.dados.historico.push(item);
    // Mantém só os últimos 200
    if(this.dados.historico.length > 200){
      this.dados.historico = this.dados.historico.slice(-200);
    }
    this.salvar();
  },

  // ===== SALVAR MEMÓRIA IMPORTANTE =====
  salvarMemoriaImportante(texto) {
    this.dados.memorias_importantes.push({
      id: Date.now(),
      data: new Date().toISOString(),
      texto: texto
    });
    this.salvar();
    return `Salvei na memória: ${texto}`;
  },

  // ===== BUSCAR NA MEMÓRIA =====
  buscarNaMemoria(termo) {
    termo = termo.toLowerCase();
    // Busca no histórico
    const resultados = this.dados.historico.filter(h =>
      h.pergunta.toLowerCase().includes(termo) ||
      h.resposta.toLowerCase().includes(termo)
    ).slice(-5);

    // Busca nas memórias importantes
    const importantes = this.dados.memorias_importantes.filter(m =>
      m.texto.toLowerCase().includes(termo)
    );

    if(resultados.length === 0 && importantes.length === 0){
      return "Não lembro de nada sobre isso";
    }

    let texto = "";
    if(importantes.length > 0){
      texto += `Memória importante: ${importantes[0].texto}\n`;
    }
    if(resultados.length > 0){
      texto += `Última vez falamos: "${resultados[resultados.length-1].pergunta}"`;
    }
    return texto;
  },

  // ===== ESTATÍSTICAS =====
  getEstatisticas() {
    return {
      total_conversas: this.dados.historico.length,
      memorias_salvas: this.dados.memorias_importantes.length,
      dias_ativo: this.calcularDias(),
      nome: this.dados.preferencias.nome
    };
  },

  calcularDias() {
    const inicio = new Date(this.dados.criado_em);
    const hoje = new Date();
    return Math.floor((hoje - inicio) / (1000 * 60 * 60 * 24));
  },

  // ===== LIMPAR MEMÓRIA =====
  limpar() {
    this.dados.historico = [];
    this.dados.memorias_importantes = [];
    localStorage.removeItem('kai_memoria');
    this.salvar();
    return "Memória limpa Chefe";
  }
};
