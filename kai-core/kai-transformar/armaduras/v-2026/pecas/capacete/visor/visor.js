const K_PECA = {
  nome: "VISOR K-1",
  desc: "Interface Neural + Scanner Térmico",
  status: "Energia: 98%",
  
  funcoes: [
    { nome: "Modo Raio-X", id: "raiox" },
    { nome: "Zoom 8x", id: "zoom" },
    { nome: "Scanner Térmico", id: "termico" },
    { nome: "HUD de Combate", id: "combate" },
    { nome: "Visão Noturna", id: "noturno" },
    { nome: "Reset Visor", id: "reset" }
  ],

  // TODAS AS FUNÇÕES REAIS FICAM AQUI DENTRO
  executar: function(id, video){
    switch(id){
      case 'raiox':
        video.className = 'raiox';
        this.status = "Modo: Raio-X Ativo";
        this.falar("Raio-X ativado");
        break;
      case 'zoom':
        video.classList.toggle('zoom');
        this.status = video.classList.contains('zoom') ? "Zoom: 8x" : "Zoom: 1x";
        this.falar("Zoom ativado");
        break;
      case 'termico':
        video.className = 'termico';
        this.status = "Modo: Térmico Ativo";
        this.falar("Scanner térmico ativado");
        break;
      case 'combate':
        video.className = 'combate';
        this.status = "Modo: Combate Ativo";
        this.falar("HUD de combate ativado");
        break;
      case 'noturno':
        video.style.filter = 'brightness(2) contrast(1.5) hue-rotate(120deg)';
        this.status = "Modo: Noturno Ativo";
        this.falar("Visão noturna ativada");
        break;
      case 'reset':
        video.className = '';
        video.style.filter = '';
        this.status = "Energia: 98%";
        this.falar("Visor resetado");
        break;
    }
  },

  falar: function(txt){
    if(window.parent.falar) window.parent.falar(txt);
    if('speechSynthesis' in window){ 
      speechSynthesis.speak(new SpeechSynthesisUtterance(txt)); 
    }
  }
}
