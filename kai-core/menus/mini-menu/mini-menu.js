// K-AI MINI-MENU v-2026.26 - BANCO DE DADOS DAS PEÇAS
const K_MINI_MENU = {
  PECAS: {
    'visor': {nome: "VISOR K-1", sentido: "VISÃO", icone:"👁️",
      funcoes: [
        {nome:"Modo Raio-X",id:"raiox"},
        {nome:"Zoom 8x",id:"zoom"},
        {nome:"Câmera Térmica",id:"termico"},
        {nome:"Visão Noturna",id:"noturno"},
        {nome:"HUD Combate",id:"combate"},
        {nome:"Reset Visor",id:"reset"}
      ]
    },
    'fones': {nome: "FONES K-AUDIO", sentido: "AUDIÇÃO", icone:"🎧", funcoes: [{nome:"Cancelamento Ruído",id:"noise"},{nome:"Amplificar Som",id:"amp"},{nome:"Radar Sonoro",id:"radar"}]},
    'nariz': {nome: "NARIZ SENSORIAL", sentido: "OLFATO", icone:"👃", funcoes: [{nome:"Analisar Odor",id:"olfato"},{nome:"Detectar Gás",id:"gas"}]},
    'boca': {nome: "BOCA KORVIL", sentido: "FALA", icone:"👄", funcoes: [{nome:"Sintetizador Voz",id:"fala"},{nome:"Imitar Voz",id:"imitar"}]},
    'bico': {nome: "BICO DE CORVO", sentido: "TATO/ATAQUE", icone:"🔺", funcoes: [{nome:"Sensor Tátil",id:"tato"},{nome:"Disparo Laser",id:"laser"}]},
    'peitoral': {nome: "PEITORAL K-CORE", sentido: "DEFESA", icone:"🛡️", funcoes: [{nome:"Escudo Energia",id:"escudo"},{nome:"Sobrecarga",id:"overload"}]},
    'asas': {nome: "AS CORAX", sentido: "VOO", icone:"🪽", funcoes: [{nome:"Voo Tático",id:"voo"},{nome:"Turbo Propulsor",id:"turbo"}]},
    'bracos': {nome: "BRAÇOS K-1", sentido: "FORÇA", icone:"💪", funcoes: [{nome:"Força +500kg",id:"forca"},{nome:"Modo Martelo",id:"martelo"}]},
    'luvas': {nome: "LUVAS K-1", sentido: "ATAQUE", icone:"🧤", funcoes: [{nome:"Disparo K-1",id:"disparo"},{nome:"Campo Força",id:"campo"}]},
    'pernas': {nome: "PERNAS K-3", sentido: "LOCOMOÇÃO", icone:"🦵", funcoes: [{nome:"Salto 15m",id:"salto"},{nome:"Corrida 120km/h",id:"corrida"}]},
    'pes': {nome: "PÉS PROPULSORES", sentido: "PROPULSÃO", icone:"👟", funcoes: [{nome:"Propulsor",id:"propulsor"},{nome:"Aderência",id:"aderencia"}]}
  },

  montarHTML: function(pecaKey){
    const dados = this.PECAS[pecaKey];
    if(!dados) return "<div style='color:red'>ERRO: PEÇA NÃO ENCONTRADA</div>";
    let html = `<div class="mini-title">${dados.icone} ${dados.nome}</div>`;
    html += `<div class="mini-caminho">${dados.sentido}</div>`;
    dados.funcoes.forEach((f,i)=>{
      html += `<div class="mini-btn" id="btn-${f.id}" onclick="K_VISOR.executar('${f.id}')">${i+1}. ${f.nome}</div>`;
    });
    html += `<div class="mini-status">Aguardando comando...</div>`;
    return html;
  },

  montarBarraIcones: function(){
    let html = '';
    for(const key in this.PECAS){
      const p = this.PECAS[key];
      html += `<div class="icone-peca" title="${p.nome}" onclick="K_VISOR.abrirPeca('${key}')">${p.icone}</div>`;
    }
    return html;
  }
};
