const Navega = {
  // ARMADURA ATUAL - MUDA AQUI TODO ANO: v-2027, v-2028
  armaduraAtual: "v-2026",

  // PALAVRAS DE ATIVAÇÃO - TOLERÂNCIA
  palavrasWake: ['k-ai', 'kai', 'cai', 'key', 'kay', 'olá k-ai', 'oi k-ai', 'ei k-ai', 'ola k-ai'],

  // PALAVRAS DE ENFEITE PRA REMOVER
  palavrasLixo: ['pra mim', 'por favor', 'agora', 'já', 'então', 'me', 'pode', 'consegue', 'queria', 'gostaria'],

  // ROTAS QUE JÁ EXISTEM NO SEU APP.HTML
  rotasInternas: {
    "central": "central",
    "sistema k": "sistema",
    "sistema": "sistema",
    "k-tp": "ktp-iframe",
    "ktp": "ktp-iframe",
    "treinamento": "ktp-iframe",
    "k-afortunado": "kafortunado",
    "kafortunado": "kafortunado",
    "afortunado": "kafortunado",
    "finanças": "kafortunado",
    "k-alma": "kalma",
    "kalma": "kalma",
    "alma": "kalma",
    "saude": "kalma",
    "humano": "humano",
    "desenvolvimento humano": "humano",
    "negocios": "negocios",
    "negócio": "negocios",
    "servicos": "servicos",
    "serviços": "servicos",
    "inicio": "central",
    "home": "central",
    "menu": "central",
    "voltar": "central"
  },

  // VERBOS DE NAVEGAÇÃO
  verbosNavegar: ['abrir', 'ir para', 'acessar', 'navegar', 'vai para', 'entra em', 'mostra'],

  // VERBOS DE ARMADURA
  verbosArmadura: ['armadura', 'transformar', 'mostrar armadura', 'ativar armadura', 'mostrar armor'],

  ir(comando) {
    comando = comando.toLowerCase().trim();

    // 1. LIMPA WAKE WORD SE TIVER: "K-AI abre o K-TP"
    comando = this.limparWakeWord(comando);

    // 2. LIMPA PALAVRAS DE ENFEITE
    comando = this.limparLixo(comando);

    // ===== COMANDO 1: K-AI TRANSFORMAR / ARMADURA =====
    // Só ativa animação se NÃO tiver "mostrar"
    if(this.temPalavra(comando, this.verbosArmadura) &&!comando.includes("mostrar") &&!comando.includes("exibir")){
      this.iniciarTransformacao(this.armaduraAtual);
      if(window.parent && window.parent.falar) window.parent.falar(`Protocolo SAY KORVIL ativado. Montando Armadura ${this.armaduraAtual}... 21 segundos.`);
      return `Protocolo SAY KORVIL ativado. Montando Armadura ${this.armaduraAtual}... 21 segundos.`;
    }

    // ===== COMANDO 2: K-AI MOSTRAR ARMADURA =====
    if(comando.includes("mostrar armadura") || comando.includes("exibir armadura")){
      this.mostrarArmadura(this.armaduraAtual); // Pula animação
      if(window.parent && window.parent.falar) window.parent.falar(`Exibindo Armadura ${this.armaduraAtual}. Protocolo ativo.`);
      return `Exibindo Armadura ${this.armaduraAtual}. Protocolo ativo.`;
    }

    // ATALHOS POR NUMERO
    if(comando.includes("1") || comando.includes("sistema")) comando = "sistema k";
    if(comando.includes("2") || comando.includes("tp")) comando = "k-tp";
    if(comando.includes("3") || comando.includes("afortunado")) comando = "k-afortunado";
    if(comando.includes("4") || comando.includes("alma")) comando = "k-alma";
    if(comando.includes("5") || comando.includes("central")) comando = "central";
    if(comando.includes("6") || comando.includes("humano")) comando = "humano";
    if(comando.includes("7") || comando.includes("negocio")) comando = "negocios";
    if(comando.includes("8") || comando.includes("servico")) comando = "servicos";

    // PROCURA NAS ROTAS INTERNAS
    for(let chave in this.rotasInternas){
      if(comando.includes(chave)){
        const idTela = this.rotasInternas[chave];

        // CASO ESPECIAL K-TP QUE USA IFRAME
        if(idTela === "ktp-iframe"){
          window.parent.irParaKTP(); // chama a função que já existe no app
        } else {
          window.parent.abrirTela(idTela); // chama a função que já existe no app
        }

        if(window.parent && window.parent.falar) window.parent.falar(`Abrindo ${chave.toUpperCase()}.`);
        return `Abrindo ${chave.toUpperCase()}.`;
      }
    }

    return `Página "${comando}" não encontrada. Diga: central, sistema k, k-tp, k-afortunado, k-alma, humano, negocios ou servicos. Ou diga: K-AI transformar`;
  },

  // LIMPA WAKE WORD DO COMEÇO
  limparWakeWord(texto){
    for(let palavra of this.palavrasWake){
      if(texto.startsWith(palavra)){
        return texto.replace(palavra, '').trim();
      }
    }
    return texto;
  },

  // REMOVE PALAVRAS DE ENFEITE
  limparLixo(texto){
    this.palavrasLixo.forEach(p => {
      texto = texto.replace(new RegExp(p, 'g'), '').trim();
    });
    return texto.replace(/\s+/g, '); // remove espaços duplos
  },

  // VERIFICA SE TEM PALAVRA NO ARRAY
  temPalavra(texto, array){
    return array.some(p => texto.includes(p));
  },

  // ===== FUNÇÃO 1: TRANSIÇÃO 21S =====
  iniciarTransformacao(versao){
    const antigo = document.getElementById("transicaoFrame");
    if(antigo) document.body.removeChild(antigo);

    const transicaoFrame = document.createElement('iframe');
    transicaoFrame.id = "transicaoFrame";
    transicaoFrame.src = `kai-transformar/transiction-transform.html?armadura=${versao}`;
    transicaoFrame.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:999;background:#000;border:0;";
    document.body.appendChild(transicaoFrame);

    // DEPOIS DE 21S FECHA TRANSIÇÃO E MOSTRA ARMADURA
    setTimeout(()=>{
      const frame = document.getElementById("transicaoFrame");
      if(frame) document.body.removeChild(frame);
      this.mostrarArmadura(versao);
    }, 21000); // 21s
  },

  // ===== FUNÇÃO 2: MOSTRAR ARMADURA MONTADA =====
  mostrarArmadura(versao){
    const antigo = document.getElementById("armaduraFrame");
    if(antigo) document.body.removeChild(antigo);
    const btnAntigo = document.getElementById("btnFecharArmadura");
    if(btnAntigo) document.body.removeChild(btnAntigo);

    const armaduraFrame = document.createElement('iframe');
    armaduraFrame.id = "armaduraFrame";
    armaduraFrame.src = `kai-transformar/armaduras/${versao}.html`;
    armaduraFrame.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;z-index:998;background:transparent;border:0;pointer-events:auto;";
    document.body.appendChild(armaduraFrame);

    const btnFechar = document.createElement('button');
    btnFechar.id = "btnFecharArmadura";
    btnFechar.innerText = "FECHAR ARMADURA";
    btnFechar.style.cssText = "position:fixed;top:80px;right:20px;z-index:1000;background:#000;border:2px solid #00FFFF;color:#00FFFF;padding:10px 20px;border-radius:20px;font-weight:900;cursor:pointer;box-shadow:0 0 15px #00FFFF;font-family:'Segoe UI',Arial;";
    btnFechar.onclick = () => {
      const frame = document.getElementById("armaduraFrame");
      const btn = document.getElementById("btnFecharArmadura");
      if(frame) document.body.removeChild(frame);
      if(btn) document.body.removeChild(btn);
      if(window.parent && window.parent.falar) window.parent.falar("Armadura desativada.");
    };
    document.body.appendChild(btnFechar);
  },

  // FUNÇÃO PRA MUDAR A ARMADURA DO ANO
  setArmadura(versao){
    this.armaduraAtual = versao;
    console.log(`Armadura atualizada para: ${versao}`);
    if(window.parent && window.parent.falar) window.parent.falar(`Armadura atualizada para ${versao}`);
  },

  // FUNÇÃO PRA PEGAR A ARMADURA ATUAL
  getArmadura(){
    return this.armaduraAtual;
  }
}
