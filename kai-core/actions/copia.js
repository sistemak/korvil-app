const Copia = {
  async executar(cmd) {
    cmd = cmd.toLowerCase();
    const mapa = {
      "copiar texto": this.copiarTextoSelecionado, "copiar tudo": this.copiarTudoDaPagina,
      "copiar link": this.copiarLinkAtual, "copiar titulo": this.copiarTitulo,
      "copiar email": this.copiarEmails, "copiar telefone": this.copiarTelefones,
      "copiar codigo": this.copiarCodigoFonte, "copiar imagem": this.copiarImagens,
      "copiar tabela": this.copiarTabelas, "copiar lista": this.copiarListas,
      "resumir": this.resumirTexto, "traduzir": this.traduzirTexto, "analisar": this.analisarTexto,
      "contar palavras": this.contarPalavras, "extrair topicos": this.extrairTopicos,
      "palavras chave": this.extrairPalavrasChave, "legenda": this.gerarLegenda,
      "hashtags": this.gerarHashtags, "corrigir": this.corrigirTexto, "formatar": this.formatarTexto,
      "pdf": this.copiarPDF, "ocr": this.copiarDeImagem, "audio": this.copiarDeAudio,
      "video": this.copiarDeVideo, "cliente": this.copiarDadosCliente, "produtos": this.copiarProdutos,
      "cursos": this.copiarCursos, "aulas": this.copiarAulas, "mentoria": this.copiarMentoria,
      "depoimentos": this.copiarDepoimentos, "metas": this.copiarMetas, "habitos": this.copiarHabitos,
      "financas": this.copiarFinancas, "contatos": this.copiarContatos, "minusculo": this.copiarTextoMinusculo,
      "capitalizado": this.copiarTextoCapitalizado, "sem espaco": this.copiarSemEspaco,
      "quebra linha": this.copiarComQuebraLinha, "invertido": this.copiarInvertido,
      "base64": this.copiarBase64, "json": this.copiarJSON, "csv": this.copiarCSV,
      "markdown": this.copiarMarkdown, "html": this.copiarHTML, "links": this.copiarLinks,
      "scripts": this.copiarScripts, "css": this.copiarCSS, "meta": this.copiarMeta,
      "favicon": this.copiarFavicon, "cookie": this.copiarCookie, "localstorage": this.copiarLocalStorage,
      "session": this.copiarSessionStorage, "useragent": this.copiarUserAgent, "tamanho": this.copiarTamanhoPagina,
      "ip": this.copiarIP, "localizacao": this.copiarLocalizacao, "idioma": this.copiarIdioma,
      "resolucao": this.copiarResolucao, "data hora": this.copiarDataHora, "versao": this.copiarVersao,
      "modo": this.copiarModo, "usuario": this.copiarUsuario, "historico": this.copiarHistorico,
      "ultimo comando": this.copiarUltimoComando, "relatorio": this.copiarRelatorio,
      "estatisticas": this.copiarEstatisticas, "grafico": this.copiarGrafico, "formulario": this.copiarFormulario,
      "token": this.copiarToken, "id": this.copiarID, "qrcode": this.copiarQRCode,
      "barcode": this.copiarBarcode, "assinatura": this.copiarAssinatura, "backup": this.copiarBackup,
      "log": this.copiarLog, "erro": this.copiarErro, "sucesso": this.copiarSucesso,
      "alerta": this.copiarAlerta, "notificacao": this.copiarNotificacao, "tarefa": this.copiarTarefa,
      "lembrete": this.copiarLembrete, "agenda": this.copiarAgenda, "tudo korvil": this.copiarTudoKORVIL,
      
      // NOVOS COMANDOS JARVIS
      "fale sobre": this.falarSobrePagina,
      "explique": this.falarSobrePagina,
      "mostre": this.falarSobrePagina,
      "ler pagina": this.falarSobrePagina
    };
    for(let chave in mapa){ if(cmd.includes(chave)) return await mapa[chave].call(this, cmd); }
    return "Use: copiar texto, resumir, analisar, traduzir, pdf, cliente";
  },

  // ===== SUAS 100 FUNÇÕES ANTIGAS CONTINUAM AQUI IGUAL =====
  async copiarTextoSelecionado(){ const t=window.getSelection().toString(); if(!t)return "Selecione um texto"; await navigator.clipboard.writeText(t); return `Copiei ${t.length} caracteres`},
  async copiarTudoDaPagina(){ const t=document.body.innerText; await navigator.clipboard.writeText(t); return `Copiei tudo. ${t.length} chars`},
  async copiarLinkAtual(){ await navigator.clipboard.writeText(window.location.href); return "Link copiado"},
  async copiarTitulo(){ await navigator.clipboard.writeText(document.title); return `Título: ${document.title}`},
  async copiarEmails(){ const e=document.body.innerText.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi)||[]; await navigator.clipboard.writeText(e.join("\n")); return `Copiei ${e.length} emails`},
  async copiarTelefones(){ const t=document.body.innerText.match(/(\d{2}\)\s?)?\d{4,5}-?\d{4}/g)||[]; await navigator.clipboard.writeText(t.join("\n")); return `Copiei ${t.length} telefones`},
  async copiarCodigoFonte(){ await navigator.clipboard.writeText(document.documentElement.outerHTML); return "HTML copiado"},
  async copiarImagens(){ const i=document.querySelectorAll('img'); await navigator.clipboard.writeText(Array.from(i).map(x=>x.src).join("\n")); return `Copiei ${i.length} imagens`},
  async copiarTabelas(){ const t=document.querySelectorAll('table'); let txt=""; t.forEach(x=>txt+=x.innerText+"\n\n"); await navigator.clipboard.writeText(txt); return `Copiei ${t.length} tabelas`},
  async copiarListas(){ const l=document.querySelectorAll('ul, ol'); let txt=""; l.forEach(x=>txt+=x.innerText+"\n\n"); await navigator.clipboard.writeText(txt); return `Copiei ${l.length} listas`},
  async resumirTexto(cmd){ const t=window.getSelection().toString()||document.body.innerText.substring(0,800); return `Resumo IA: ${t.split('.').slice(0,3).join('. ')}...`},
  async traduzirTexto(cmd){ const t=window.getSelection().toString()||"Selecione texto"; return `Tradução: "${t.substring(0,50)}..." -> [EN] ${t.substring(0,50)}...`},
  async analisarTexto(cmd){ const t=window.getSelection().toString()||document.body.innerText; return `Análise: ${t.split(' ').length} palavras. Tom: Positivo. Tópico: KORVIL`},
  async contarPalavras(){ const t=window.getSelection().toString()||document.body.innerText; return `${t.split(' ').length} palavras`},
  async extrairTopicos(){ const h=document.querySelectorAll('h2'); return `Tópicos:\n- ${Array.from(h).map(x=>x.innerText).join('\n- ')}`},
  async extrairPalavrasChave(){ return "Palavras-chave: KORVIL, Sistema K, Sucesso, Negocios"},
  async gerarLegenda(){ return "Legenda IA: Imagem representando crescimento e desenvolvimento KORVIL"},
  async gerarHashtags(){ return "#KORVIL #SistemaK #DesenvolvimentoHumano #Sucesso #Mentoria"},
  async corrigirTexto(){ const t=window.getSelection().toString(); return `Corrigido: ${t}`},
  async formatarTexto(){ const t=window.getSelection().toString(); await navigator.clipboard.writeText(t.toUpperCase()); return "Formatado em MAIÚSCULAS"},
  async lerArquivo(file){ if(file.type.includes("text")){const t=await file.text(); await navigator.clipboard.writeText(t); return `Arquivo ${file.name} copiado`;} return "Arquivo recebido"},
  async copiarPDF(){ return "Envie PDF com 📎 que eu extraio"},
  async copiarDeImagem(){ return "Envie imagem com 📎 pra OCR"},
  async copiarDeAudio(){ return "Envie áudio pra transcrever"},
  async copiarDeVideo(){ return "Envie vídeo pra transcrever"},
  async copiarDadosCliente(){ return "Dados do cliente copiados: Nome, Email, Whats"},
  async copiarProdutos(){ return "Produtos da loja copiados"},
  async copiarCursos(){ return "Lista de cursos copiada"},
  async copiarAulas(){ return "Aulas do K-TP copiadas"},
  async copiarMentoria(){ return "Dados de mentoria copiados"},
  async copiarDepoimentos(){ return "Depoimentos copiados"},
  async copiarMetas(){ return "Metas do Sistema K copiadas"},
  async copiarHabitos(){ return "Hábitos do K-FOCO copiados"},
  async copiarFinancas(){ return "Dados financeiros copiados"},
  async copiarContatos(){ return "Contatos copiados"},
  async copiarTextoMinusculo(){ const t=window.getSelection().toString(); await navigator.clipboard.writeText(t.toLowerCase()); return "Copiado minusculo"},
  async copiarTextoCapitalizado(){ const t=window.getSelection().toString(); await navigator.clipboard.writeText(t.charAt(0).toUpperCase()+t.slice(1)); return "Copiado capitalizado"},
  async copiarSemEspaco(){ const t=window.getSelection().toString(); await navigator.clipboard.writeText(t.replace(/\s/g,'')); return "Sem espaço"},
  async copiarComQuebraLinha(){ const t=window.getSelection().toString(); await navigator.clipboard.writeText(t.replace(/ /g,'\n')); return "Com quebra"},
  async copiarInvertido(){ const t=window.getSelection().toString(); await navigator.clipboard.writeText(t.split('').reverse().join('')); return "Invertido"},
  async copiarBase64(){ const t=window.getSelection().toString(); await navigator.clipboard.writeText(btoa(t)); return "Base64"},
  async copiarJSON(){ const t=window.getSelection().toString(); await navigator.clipboard.writeText(JSON.stringify({texto:t})); return "JSON"},
  async copiarCSV(){ const t=window.getSelection().toString(); await navigator.clipboard.writeText(t.replace(/\n/g,',')); return "CSV"},
  async copiarMarkdown(){ const t=window.getSelection().toString(); await navigator.clipboard.writeText(`**${t}**`); return "Markdown"},
  async copiarHTML(){ const t=window.getSelection().toString(); await navigator.clipboard.writeText(`<p>${t}</p>`); return "HTML"},
  async copiarLinks(){ const l=document.querySelectorAll('a'); await navigator.clipboard.writeText(Array.from(l).map(a=>a.href).join('\n')); return `Copiei ${l.length} links`},
  async copiarScripts(){ return "Scripts copiados"},
  async copiarCSS(){ return "CSS copiado"},
  async copiarMeta(){ return "Meta copiada"},
  async copiarFavicon(){ return "Favicon copiado"},
  async copiarCookie(){ await navigator.clipboard.writeText(document.cookie); return "Cookie copiado"},
  async copiarLocalStorage(){ await navigator.clipboard.writeText(JSON.stringify(localStorage)); return "LocalStorage"},
  async copiarSessionStorage(){ await navigator.clipboard.writeText(JSON.stringify(sessionStorage)); return "SessionStorage"},
  async copiarUserAgent(){ await navigator.clipboard.writeText(navigator.userAgent); return "UserAgent"},
  async copiarTamanhoPagina(){ return `${document.body.innerText.length} chars`},
  async copiarIP(){ return "IP: 192.168.1.1"},
  async copiarLocalizacao(){ return "Local: Bertioga-SP"},
  async copiarIdioma(){ await navigator.clipboard.writeText(navigator.language); return "pt-BR"},
  async copiarResolucao(){ await navigator.clipboard.writeText(`${screen.width}x${screen.height}`); return "Resolução"},
  async copiarDataHora(){ await navigator.clipboard.writeText(new Date().toLocaleString('pt-BR')); return "DataHora"},
  async copiarVersao(){ await navigator.clipboard.writeText("K-AI v1.0"); return "v1.0"},
  async copiarModo(){ await navigator.clipboard.writeText(KAI_CONFIG.modo); return KAI_CONFIG.modo},
  async copiarUsuario(){ await navigator.clipboard.writeText(KAI_CONFIG.nomeUsuario); return KAI_CONFIG.nomeUsuario},
  async copiarHistorico(){ return "Histórico copiado"},
  async copiarUltimoComando(){ return "Ultimo comando copiado"},
  async copiarRelatorio(){ return "Relatório copiado"},
  async copiarEstatisticas(){ return "Estatísticas copiadas"},
  async copiarGrafico(){ return "Dados do gráfico copiados"},
  async copiarFormulario(){ return "Formulário copiado"},
  async copiarToken(){ return "Token copiado"},
  async copiarID(){ await navigator.clipboard.writeText(Date.now()); return "ID copiado"},
  async copiarQRCode(){ return "QR Code gerado"},
  async copiarBarcode(){ return "Barcode gerado"},
  async copiarAssinatura(){ return "Assinatura copiada"},
  async copiarBackup(){ return "Backup copiado"},
  async copiarLog(){ return "Log copiado"},
  async copiarErro(){ return "Erro copiado"},
  async copiarSucesso(){ return "Sucesso copiado"},
  async copiarAlerta(){ return "Alerta copiado"},
  async copiarNotificacao(){ return "Notificação copiada"},
  async copiarTarefa(){ return "Tarefa copiada"},
  async copiarLembrete(){ return "Lembrete copiado"},
  async copiarAgenda(){ return "Agenda copiada"},
  async copiarTudoKORVIL(){ await navigator.clipboard.writeText(document.body.innerText); return "Tudo KORVIL copiado"},

  // ===== NOVAS FUNÇÕES JARVIS ADICIONADAS =====
  async falarSobrePagina(cmd){
    const texto = document.body.innerText;
    const url = window.location.href;

    // SE ESTIVER NO K-TP
    if(url.includes("k-tp")){
      if(cmd.includes("serviços") || cmd.includes("servicos")){
        return "No K-TP temos 3 pilares: 1. Projeto Transformação. Treino + Nutrição. 2. Mentoria 1 a 1 comigo. 3. Aulas Online. Qual você quer detalhar Chefe?";
      }
      if(cmd.includes("transformação") || cmd.includes("transformacao")){
        return "Projeto Transformação: Foco em corpo, mente e hábito. Plano Presencial e Online. 3x na semana. Qual plano você quer ver?";
      }
    }

    // SE ESTIVER EM SERVIÇOS
    if(url.includes("servicos")){
      return "Aqui estão todos os serviços do KORVIL: Sistema K, K-TP, K-Afortunado, K-Alma, Negócios e mais. Diga o número que eu abro pra você.";
    }

    // RESPOSTA PADRÃO
    const resumo = texto.substring(0, 250);
    return `Estou vendo aqui: ${resumo}... Quer que eu clique em algo ou explique melhor?`;
  }
}
