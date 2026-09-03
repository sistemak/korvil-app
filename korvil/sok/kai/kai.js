import { KAIVoice } from './kai-voice.js';
import { executeAction } from './actions/execute-actions.js';

// Global Object do K-AI Core
window.KAI = {
  memoria: { 
    nomeUsuario: "Chefe", 
    ultimaPagina: "central",
    contexto: []
  },
  configVoz: { 
    modo: "ilimitada", 
    genero: "masculino", 
    vozSelecionada: null,
    velocidade: 1.1
  },
  voiceHandler: null,

  // 1. INICIAR K-AI
  iniciar() {
    console.log("[K-AI CORE] K-AI JARVIS Engine v2.0 Iniciado");
    
    // Inicializa o manipulador de voz
    this.voiceHandler = new KAIVoice((spokenText) => {
      const input = document.getElementById('userInput') || document.getElementById('user-input');
      if (input) input.value = spokenText;
      this.processar(spokenText);
    });

    this.carregarVozes();
    if ('speechSynthesis' in window) {
      speechSynthesis.onvoiceschanged = () => this.carregarVozes();
    }

    if (window.Sistema && typeof window.Sistema.carregar === 'function') {
      window.Sistema.carregar();
    }
    
    const nomeSalvo = localStorage.getItem('kai_nomeUsuario');
    if (nomeSalvo) this.memoria.nomeUsuario = nomeSalvo;

    const msgInicial = `Sistemas online. Olá ${this.memoria.nomeUsuario}. K-AI pronto.`;
    this.adicionarNaTela("kai", msgInicial);
    this.falar(msgInicial);
    
    // Dispara notificação de inicialização dos sistemas
    executeAction('NOTIFICAR');
  },

  // 2. CARREGAR VOZES PT-BR
  carregarVozes() {
    if (!('speechSynthesis' in window)) return;
    const vozes = speechSynthesis.getVoices();
    this.configVoz.vozSelecionada = vozes.find(v => 
      v.lang === 'pt-BR' && 
      (this.configVoz.genero === "masculino" ? v.name.toLowerCase().includes('male') : v.name.toLowerCase().includes('female'))
    ) || vozes.find(v => v.lang === 'pt-BR');
  },

  // 3. MUDAR CONFIG DE VOZ
  mudarVoz(modo, genero) {
    this.configVoz.modo = modo;
    this.configVoz.genero = genero;
    this.carregarVozes();
    this.adicionarNaTela("kai", `Voz alterada para ${genero}. Modo ${modo}.`);
  },

  // 4. CÉREBRO PRINCIPAL - ROTEADOR DE COMANDOS
  async processar(textoOriginal) {
    if (!textoOriginal || textoOriginal.trim() === "") return;

    const texto = textoOriginal.toLowerCase().trim();
    this.adicionarNaTela("user", textoOriginal);
    this.memoria.contexto.push({ role: "user", content: textoOriginal });
    let resposta = "";

    // COMANDOS GLOBAIS DE VOZ
    if (texto.includes("mudar voz")) { 
      this.mudarVoz(this.configVoz.modo, texto.includes("feminino") ? "feminino" : "masculino"); 
      return; 
    }
    if (texto.includes("modo ilimitado")) { this.mudarVoz("ilimitada", this.configVoz.genero); return; }
    if (texto.includes("modo limitado")) { this.mudarVoz("limitada", this.configVoz.genero); return; }
    if (texto.includes("calar") || texto.includes("silencio")) { 
      if ('speechSynthesis' in window) speechSynthesis.cancel(); 
      return; 
    }

    // ROTEADOR LOCAL DE MÓDULOS
    try {
      if ((texto.includes("vai") || texto.includes("abre") || texto.includes("ir para") || texto.includes("voltar") || texto.includes("fechar")) && window.Navega) {
        resposta = window.Navega.ir(texto);
      }
      else if ((texto.includes("cria") || texto.includes("faça") || texto.includes("gere") || texto.includes("post") || texto.includes("roteiro") || texto.includes("imagem")) && window.Cria) {
        resposta = await window.Cria.executar(texto);
      }
      else if ((texto.includes("copia") || texto.includes("resuma") || texto.includes("analisa") || texto.includes("traduz") || texto.includes("explique")) && window.Copia) {
        resposta = await window.Copia.executar(texto);
      }
      else if ((texto.includes("lembrar") || texto.includes("salvar") || texto.includes("hora") || texto.includes("data") || texto.includes("config") || texto.includes("limpar")) && window.Sistema) {
        resposta = await window.Sistema.executar(texto);
      }
      else if (texto.includes("oi") || texto.includes("ola") || texto.includes("e aí")) {
        resposta = `Olá ${this.memoria.nomeUsuario}! K-AI na área. Em que posso ajudar?`;
      }
      else {
        // SE NÃO FOR COMANDO LOCAL, CHAMA O GEMINI NO BACKEND
        if (this.configVoz.modo === "ilimitada") {
          resposta = await this.conversarComIA(textoOriginal);
        } else {
          resposta = "Não entendi o comando. Tente: Criar, Navegar, Analisar ou Salvar.";
        }
      }
    } catch(e) {
      console.error("[K-AI PROCESS ERROR]", e);
      resposta = "Ocorreu um erro ao processar seu comando no K-AI Core.";
    }

    this.memoria.contexto.push({ role: "assistant", content: resposta });
    this.adicionarNaTela("kai", resposta);
    this.falar(resposta);
  },

  // 5. CONEXÃO DIRETA COM O BACKEND SERVER.JS (GEMINI API)
  async conversarComIA(prompt) {
    try {
      const response = await fetch('/api/kai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt })
      });

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      const data = await response.json();

      // Executa ação retornada pelo backend (se houver)
      if (data.action) {
        await executeAction(data.action.type, data.action.payload);
      }

      return data.reply || "Não recebi resposta do K-AI Core.";
    } catch (err) {
      console.error("[K-AI API ERROR]", err);
      return "Erro de comunicação com o servidor K-AI Core.";
    }
  },

  // 6. SÍNTESE DE VOZ
  falar(texto) {
    if ('speechSynthesis' in window && this.configVoz.modo !== "mudo") {
      speechSynthesis.cancel();
      const fala = new SpeechSynthesisUtterance(texto.replace(/[\#\*\_\`]/g, ''));
      fala.lang = 'pt-BR'; 
      if (this.configVoz.vozSelecionada) fala.voice = this.configVoz.vozSelecionada;
      fala.rate = this.configVoz.velocidade;
      fala.pitch = this.configVoz.genero === "masculino" ? 0.8 : 1.2; 
      fala.volume = 1;
      
      fala.onstart = () => { 
        if (typeof window.pulsarCore === 'function') window.pulsarCore(); 
      };
      
      speechSynthesis.speak(fala);
    }
  },

  // 7. RENDERIZAÇÃO NA TELA
  adicionarNaTela(quem, texto) {
    const chatBox = document.getElementById('chatBox') || document.getElementById('chat-container');
    if (!chatBox) return;

    const msg = document.createElement('div');
    msg.classList.add('msg', quem === 'kai' ? 'kai-msg' : 'user-msg');
    msg.innerHTML = `<b>${quem === 'kai' ? 'K-AI' : 'Você'}:</b> ${texto.replace(/\n/g, '<br>')}`;
    
    chatBox.appendChild(msg); 
    chatBox.scrollTop = chatBox.scrollHeight;
  }
};

// VINCULAÇÃO DE EVENTOS DA INTERFACE
window.enviarMensagem = function() {
  const input = document.getElementById('userInput') || document.getElementById('user-input');
  if (!input) return;
  const texto = input.value;
  if (!texto) return;
  input.value = "";
  window.KAI.processar(texto);
};

// INICIALIZA AO CARREGAR A PÁGINA
document.addEventListener('DOMContentLoaded', () => {
  window.KAI.iniciar();

  const sendBtn = document.getElementById('send-btn') || document.getElementById('sendBtn');
  const micBtn = document.getElementById('mic-btn') || document.getElementById('micBtn');
  const inputEl = document.getElementById('userInput') || document.getElementById('user-input');

  if (sendBtn) {
    sendBtn.addEventListener('click', window.enviarMensagem);
  }

  if (inputEl) {
    inputEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') window.enviarMensagem();
    });
  }

  if (micBtn) {
    micBtn.addEventListener('click', () => {
      if (window.KAI.voiceHandler) window.KAI.voiceHandler.listen();
    });
  }
});
