// ============= K-B.D FORJA v8.2 - VISUALIZADOR =============
const PREVIEW = {
  
  renderizar(codigo, tipo){
    const container = document.getElementById('preview-container');
    
    if(tipo === 'html'){
      container.innerHTML = `<iframe srcdoc='${codigo}' style='width:100%;height:100%;border:none;background:#fff;'></iframe>`;
    }
    else if(tipo === 'css'){
      container.innerHTML = `<style>${codigo}</style><div style="padding:20px;color:#000">Preview CSS Ativo - Veja as mudanças</div>`;
    }
    else if(tipo === 'js'){
      container.innerHTML = `<pre style="padding:20px;color:#00ff66;background:#000">${codigo}</pre>`;
      try{ eval(codigo); HISTORICO.adicionar("Executou JS", ARQUIVO_SELECIONADO); } 
      catch(e){ console.error(e); falarKai("Erro no JS: " + e.message); }
    }
    else {
      container.innerHTML = `<pre style="padding:20px;color:#00ff66;background:#000">${codigo}</pre>`;
    }
  },

  atualizar(){
    const codigo = SANDBOX[ARQUIVO_SELECIONADO];
    let tipo = ARQUIVO_SELECIONADO.split('.').pop();
    this.renderizar(codigo, tipo);
    document.getElementById('status-arquivo').textContent = `ARQUIVO ATUAL: ${ARQUIVO_SELECIONADO} ${PENDENTE_COMMIT ? '[PENDENTE]' : '[SALVO]'}`;
  },

  baixarZip(){
    falarKai("Gerando ZIP do projeto...");
    alert("Função BAIXAR ZIP: Conecte com JSZip para exportar SANDBOX completo");
  }
};

// Substituir a função antiga
function atualizarPreview(){
  PREVIEW.atualizar();
}

document.getElementById('btnDownloadZip').onclick = () => PREVIEW.baixarZip();

console.log("PREVIEW ENGINE CARREGADO");
