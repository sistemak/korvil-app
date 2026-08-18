// ============= K-AI EXECUTOR V-2026.3 - AUTO EVOLUTIVO =============
export class KAIExecutor {
  constructor(){
    this.versao = "2026.3";
    this.repo = "https://raw.githubusercontent.com/korvilp-sudo/korvil-app/main/kai-core/brain/";
    this.comandosCustom = JSON.parse(localStorage.getItem('kai_executor_custom') || '{}');
    this.iniciarAutoUpdate();
  }

  // ===== 1. AUTO UPDATE DO EXECUTOR =====
  async iniciarAutoUpdate(){
    setInterval(()=>this.verificarAtualizacao(), 300000); // 5 min
  }

  async verificarAtualizacao(){
    try{
      const resposta = await fetch(this.repo + "kai-executor.js?t=" + Date.now());
      const codigoNovo = await resposta.text();
      const versaoNova = codigoNovo.match(/versao = "(.+?)"/)?.[1];
      if(versaoNova && versaoNova!== this.versao){
        localStorage.setItem('kai_executor_novo', codigoNovo);
        if(window.KAI_BRAIN) KAI_BRAIN.falar(`Nova versão do Executor v${versaoNova} baixada`);
      }
    }catch(e){}
  }

  // ===== 2. MOTOR PRINCIPAL =====
  async executar(acao){
    if(!acao ||!acao.action) return "Comando inválido";

    addMsg && addMsg('me', acao.parametro || acao.target);
    let respondido = false;

    // 2.1 COMANDOS BASE DE ARQUIVO
    if(acao.action === "create"){
      await this.criarArquivoKAI(acao.target);
      respondido = true;
    }
    else if(acao.action === "edit"){
      await this.editarArquivoKAI(acao.target);
      respondido = true;
    }
    else if(acao.action === "list"){
      this.listarPecasKAI();
      respondido = true;
    }
    else if(acao.action === "clone"){
      this.clonarProjeto();
      respondido = true;
    }

    // 2.2 AS 14 GAVETAS + ARMADURA V-2026
    const comandos = {
      // CORE
      "analyze": () => { falar("Executando módulo de Análise de dados"); addNoti("📊 ANÁLISE INICIADA"); },
      "automacao": () => { falar("Módulo de Automação ativado"); addNoti("⚙️ AUTOMAÇÃO"); },
      "search": () => { falar("Iniciando busca na base KORVIL"); },
      "calculo": () => { falar("Módulo de Cálculo ativo"); },
      "copia": () => { falar("Função de Cópia executada"); },
      "educacao": () => { falar("Acessando base de Educação K-AI"); },
      "emergencia": () => {
          falar("PROTOCOLO DE EMERGÊNCIA ATIVADO");
          document.body.style.background='red';
          addNoti("🚨 EMERGÊNCIA");
          setTimeout(()=>document.body.style.background='var(--bg)',3000)
      },
      "interface": () => { falar("Reconfigurando interface"); },
      "manipula": () => { falar("Módulo de Manipulação ativo"); },
      "navigate": () => { falar("Sistema de Navegação ativo. Para onde vamos?"); },
      "sistema": () => { falar("Diagnóstico de Sistema completo"); openTable && openTable('right'); },
      "social": () => { falar("Conectando redes sociais"); },
      "vendas": () => { falar("Módulo de Vendas ativado"); },
      "save": () => { salvarMem && salvarMem(); falar("Memória salva"); },

      // ARMADURA V-2026
      "armor": () => iniciarTransformacao && iniciarTransformacao(),
      "combate": () => { falar("Modo combate ativado"); modoArmadura('combate'); },
      "furtivo": () => { falar("Modo furtivo ativado"); modoArmadura('furtivo'); },
      "voo": () => { falar("Propulsores ligados. Modo voo ativado"); modoArmadura('voo'); },
    };

    // 2.3 COMANDOS CUSTOM APRENDIDOS
    comandos = {...comandos,...this.comandosCustom};

    // 3. EXECUTA SE ENCONTRAR
    if(!respondido){
      for(let key in comandos){
        if(acao.action === key || acao.parametro?.includes(key)){
          comandos[key]();
          respondido = true;
          break;
        }
      }
    }

    // 4. FALLBACK
    if(!respondido) {
      falar(`Comando não reconhecido Chefe. Tentando aprender...`);
      this.aprenderComando(acao.parametro);
      addNoti(`❓ Comando: ${acao.parametro}`);
    }

    updateStats && updateStats();
    return "Executado";
  }

  // ===== 3. FUNÇÕES DO EXECUTOR =====
  async criarArquivoKAI(nome){
    const templates = {
        "peito": `<!DOCTYPE html><html lang="pt-BR"><head><title>K-AI PEITO V-2026</title><style>body{background:#000;color:#00FFFF;text-align:center}.reactor{width:200px;height:200px;border:5px solid #00FFFF;border-radius:50%;margin:50px auto;box-shadow:0 0 50px #00FFFF;animation:pulse 2s infinite}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}</style></head><body><div class="reactor"></div><h1>NÚCLEO K-AI</h1></body></html>`,
        "dorso": `<!DOCTYPE html><html lang="pt-BR"><head><title>K-AI DORSO V-2026</title><style>body{background:#000;color:#00FFFF;text-align:center}.propulsor{width:100px;height:300px;background:linear-gradient(#00FFFF, transparent);margin:20px auto;border-radius:10px}</style></head><body><div class="propulsor"></div><h1>SISTEMA DE VOO V-2026</h1></body></html>`,
        "braço": `<!DOCTYPE html><html lang="pt-BR"><head><title>K-AI BRAÇO V-2026</title></head><body><h1>SISTEMA DE ARMAS</h1></body></html>`
    };
    const codigo = templates[nome] || templates.peito;
    const blob = new Blob([codigo], {type: 'text/html'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${nome}.html`;
    link.click();
    falar(`Arquivo ${nome}.html criado.`);
    addNoti && addNoti(`✨ ${nome}.html criado`);
  }

  async editarArquivoKAI(nome){
    falar(`Me envie o código de ${nome}.html aqui no chat para editar`);
    window.aguardandoEdicao = nome;
  }

  listarPecasKAI(){
    const pecas = ['capacete', 'visor', 'fones', 'peito', 'dorso', 'braço'];
    falar(`Você tem ${pecas.length} peças: ${pecas.join(", ")}`);
  }

  clonarProjeto(){
    falar("Clonando projeto atual...");
  }

  // 4. AUTO APRENDIZADO DO EXECUTOR
  aprenderComando(comando){
    if(!comando) return;
    const palavra = comando.split(' ')[0];
    this.comandosCustom[palavra] = () => falar(`Executando comando aprendido: ${comando}`);
    localStorage.setItem('kai_executor_custom', JSON.stringify(this.comandosCustom));
    falar(`Aprendi o comando: ${palavra}`);
  }
}

// ===== CAPTURADOR DE EDIÇÃO =====
const inputOriginal = document.getElementById('input');
const sendOriginal = window.send;
window.send = function(){
    const input = document.getElementById('input');
    if(window.aguardandoEdicao && input.value.includes("<html")){
        window.KAI_EXECUTOR.editarECriarArquivo(window.aguardandoEdicao, input.value);
        window.aguardandoEdicao = null;
    } else {
        sendOriginal && sendOriginal();
    }
}

// ===== FUNÇÕES GLOBAIS =====
function modoArmadura(modo){
    const canvas = document.getElementById('armaduraCanvas');
    if(modo === 'combate') canvas.style.filter = 'hue-rotate(0deg) brightness(1.4)';
    if(modo === 'furtivo') canvas.style.filter = 'brightness(0.2)';
    if(modo === 'voo') falar("Propulsores ligados");
}
function iniciarTransformacao(){ document.getElementById('armaduraOverlay').style.display = 'block'; }
window.modoArmadura = modoArmadura;
window.iniciarTransformacao = iniciarTransformacao;

// INSTANCIA GLOBAL
window.KAI_EXECUTOR = new KAIExecutor();
