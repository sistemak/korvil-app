// ============= K-B.D FORJA v8.2 - HISTÓRICO =============
const HISTORICO = {
  lista: [],
  
  adicionar(acao, arquivo){
    this.lista.push({data: new Date().toLocaleString(), acao, arquivo});
    this.renderizar();
    salvarMemoriaKai(`Histórico: ${acao} em ${arquivo}`);
  },
  
  renderizar(){
    const div = document.getElementById('listaHistorico');
    if(!div) return;
    div.innerHTML = this.lista.map(h => 
      `<div class="item-historico" style="padding:8px;border-bottom:1px solid #00f0ff">
        [${h.data}] <b>${h.acao}</b> em ${h.arquivo}
      </div>`
    ).join('');
  },

  desfazer(){
    if(this.lista.length > 0){
      let ultimo = this.lista.pop();
      falarKai(`Desfeito: ${ultimo.acao}`);
      this.renderizar();
    }
  }
};

document.getElementById('desfazerBtn').onclick = () => HISTORICO.desfazer();
