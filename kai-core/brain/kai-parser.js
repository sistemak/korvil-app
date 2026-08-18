// ============= K-AI PARSER v9.1 - AUTO EVOLUTIVO =============
export class KAIParser {
  constructor(){
    this.regras = {
      "cria": "create",
      "criar": "create", 
      "edita": "edit",
      "editar": "edit",
      "lista": "list",
      "mostra": "list",
      "clonar": "clone",
      "salvar": "save",
      "analisar": "analyze",
      "buscar": "search",
      "ir para": "navigate",
      "abrir": "navigate"
    };
    this.regrasExtras = JSON.parse(localStorage.getItem('kai_parser_regras') || '{}');
    this.regras = {...this.regras,...this.regrasExtras};
  }

  parse(comando) {
    comando = comando.toLowerCase();
    this.ultimoComando = comando;
    
    // 1. CHECA REGRAS BASE + APRENDIDAS
    for(let palavra in this.regras){
      if(comando.includes(palavra)){
        return { 
          action: this.regras[palavra], 
          target: this.extractTarget(comando),
          parametro: comando
        }
      }
    }
    
    // 2. REGRAS ESPECÍFICAS
    if(comando.includes("peça")) return { action: "create", target: comando.split("peça ")[1] };
    if(comando.includes("visor")) return { action: "edit", target: "visor" };
    if(comando.includes("peito")) return { action: "edit", target: "peito" };
    if(comando.includes("armadura") || comando.includes("transformar")) return { action: "armor", target: "full" };
    
    return { action: "unknown", target: "geral", parametro: comando }
  }
  
  extractTarget(texto){
    if(texto.includes("peça ")) return texto.split("peça ")[1];
    if(texto.includes("visor")) return "visor";
    if(texto.includes("peito")) return "peito";
    if(texto.includes("sistema k")) return "sistema k";
    return "geral";
  }

  // 3. AUTO APRENDIZADO - ELE CRIA NOVA REGRA SOZINHO
  adicionarRegra(comandoNovo){
    const palavras = comandoNovo.split(' ');
    const palavraChave = palavras[0]; // pega primeira palavra
    
    this.regrasExtras[palavraChave] = "custom_" + palavraChave;
    localStorage.setItem('kai_parser_regras', JSON.stringify(this.regrasExtras));
    this.regras = {...this.regras,...this.regrasExtras};
    
    if(window.KAI_BRAIN) KAI_BRAIN.falar(`Aprendi novo comando: ${palavraChave}`);
  }

  getEstatisticas(){
    return {
      regrasBase: Object.keys(this.regras).length,
      regrasAprendidas: Object.keys(this.regrasExtras).length
    }
  }
}
