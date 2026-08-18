// ============= K-AI BRAIN V-2026.6 - REAL FUNCIONAL SEM DEPENDENCIA =============
class KAIBrain {
  constructor() {
    this.versao = "2026.6";
    this.repo = "https://raw.githubusercontent.com/korvilp-sudo/korvil-app/main/kai-core/brain/";
    this.memorias = JSON.parse(localStorage.getItem('kai_memorias') || '[]');
    this.TOKEN = localStorage.getItem('kai_gh_token');
    this.REPO = "korvilp-sudo/korvil-app";

    this.iniciarVoz();
    this.iniciarAutoUpdate();
    this.visor("SISTEMA K-AI V-2026.6 INICIADO", "sucesso");
    this.visor("Aguardando comando...");
    this.falar("K-AI online");
  }

  // ===== VISOR FLUTUANTE REAL =====
  visor(msg, tipo="info"){
    const el = document.getElementById('kaiVisorCorpo');
    if(!el) return;
    const cor = tipo==="erro"? "#ff0033" : tipo==="sucesso"? "#00ff66" : "#00f0ff";
    const hora = new Date().toLocaleTimeString();
    el.innerHTML += `<pre style="color:${cor}">[${hora}] ${msg}</pre>`;
    el.scrollTop = el.scrollHeight;
  }

  falar(texto){
    this.visor(`FALANDO: ${texto}`, "info");
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = 'pt-BR'; utter.rate = 1.1;
    speechSynthesis.speak(utter);
    document.getElementById('respostaKai') && (document.getElementById('respostaKai').innerHTML = "K-AI: " + texto);
  }

  // ===== PONTE GITHUB REAL =====
  async autoUpdate(){
    if(!this.TOKEN) this.TOKEN = prompt("K-AI PONTE: Cole seu token GitHub 1x só:");
    if(this.TOKEN) localStorage.setItem('kai_gh_token', this.TOKEN);

    this.visor("COMANDO MANUAL: Sobe você pro GitHub");
    this.visor(`[PONTE] Iniciando upload: kai-core/brain/kai-brain.js`);

    const url = `https://api.github.com/repos/${this.REPO}/contents/kai-core/brain/kai-brain.js`;
    let sha = null;
    try{
      const res = await fetch(url, {headers: {Authorization: `token ${this.TOKEN}`}});
      if(res.ok) sha = (await res.json()).sha;
    }catch(e){ this.visor("Erro ao verificar", "erro"); }

    const r = await fetch(url, {
      method: 'PUT',
      headers: {Authorization: `token ${this.TOKEN}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({
        message: `Auto-update by K-AI V-2026.6`,
        content: btoa(unescape(encodeURIComponent(document.querySelector('script[src*="kai-brain"]').textContent || this.toString()))),
        sha: sha
      })
    });

    if(r.ok) {
      this.visor(`[PONTE] SUCESSO: Arquivo enviado`, "sucesso");
      this.falar(`Enviado com sucesso`);
      setTimeout(()=>location.reload(), 3000);
    } else {
      this.visor(`[PONTE] ERRO ${r.status}: Falha`, "erro");
    }
  }

  // ===== ANALISE REAL =====
  async analisarSistema(){
    if(!this.TOKEN) this.TOKEN = prompt("K-AI PONTE: Cole seu token GitHub:");
    this.visor("INICIANDO ESCANEAMENTO...", "info");
    const url = `https://api.github.com/repos/${this.REPO}/contents/kai-core`;
    try{
      const res = await fetch(url, {headers: {Authorization: `token ${this.TOKEN}`}});
      const dados = await res.json();
      this.visor(`Encontrei ${dados.length} itens na pasta kai-core`, "sucesso");
      dados.forEach(i=> this.visor(i.type==="dir"? ` 📁 ${i.name}` : ` 📄 ${i.name}`));
      this.falar("Análise completa");
    }catch(e){ this.visor(`ERRO: ${e.message}`, "erro"); }
  }

  // ===== AUTO UPDATE =====
  iniciarAutoUpdate(){
    this.visor("Auto-update: verificação a cada 5min");
    setInterval(()=>this.verificarAtualizacao(), 300000);
  }

  async verificarAtualizacao(){
    this.visor("Verificando atualização...");
    try{
      const resposta = await fetch(this.repo + "kai-brain.js?t=" + Date.now());
      const codigoNovo = await resposta.text();
      const versaoNova = codigoNovo.match(/versao = "(.+?)"/)?.[1];
      if(versaoNova && versaoNova!== this.versao){
        this.visor(`NOVA VERSÃO: v${versaoNova}`, "sucesso");
        localStorage.setItem('kai_brain_novo', codigoNovo);
        location.reload();
      }
    }catch(e){ this.visor("OFFLINE", "erro"); }
  }

  // ===== VOZ =====
  iniciarVoz(){
    try{
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'pt-BR'; recognition.continuous = true;
      recognition.onresult = (e) => {
        const comando = e.results[e.results.length-1][0].transcript;
        this.visor(`VOZ: ${comando}`);
        this.processarComando(comando);
      }
      window.KAI_RECOGNITION = recognition;
      recognition.start();
    }catch(e){ this.visor("Voz não suportada", "erro"); }
  }

  // ===== PROCESSADOR REAL =====
  async processar(cmd){ return await this.processarComando(cmd); }

  async processarComando(cmdOriginal){
    const cmd = cmdOriginal.toLowerCase();
    this.visor(`COMANDO: ${cmdOriginal}`);

    if(cmd.includes("sobe você pro github")) { await this.autoUpdate(); return; }
    else if(cmd.includes("se analisa")) { await this.analisarSistema(); return; }
    else if(cmd.includes("cria")) {
      this.visor(`Criando: ${cmdOriginal}`, "sucesso");
      this.falar("Comando de criação recebido");
      return;
    }
    else if(cmd.includes("hora")) {
      this.visor(`Hora: ${new Date().toLocaleTimeString()}`, "sucesso");
      this.falar(`São ${new Date().toLocaleTimeString()}`);
      return;
    }
    else { this.visor("Comando não reconhecido", "erro"); }
  }
}
window.KAI = new KAIBrain();
