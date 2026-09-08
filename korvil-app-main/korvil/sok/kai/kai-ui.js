/**
 * K-AI CORE v2.0 - CÉREBRO 9 GAVETAS & INTERFACE 3D
 */

// ===== 1. CÉREBRO SEPARADO - 9 GAVETAS =====
export const KAI_BRAIN = {
  async processarComando(cmdOriginal) {
    if (!cmdOriginal || !cmdOriginal.trim()) return;

    const cmd = cmdOriginal.toLowerCase().trim();
    let resposta = "";

    // ATALHOS SISTEMA E MEMÓRIA
    if (cmd.includes("parar de ouvir")) {
      if (window.KAI_CONFIG) window.KAI_CONFIG.autoOuvir = false;
      if (KAI_UI.recognition) KAI_UI.recognition.stop();
      resposta = "Modo manual ativado Chefe.";
    }
    else if (cmd.includes("voltar a ouvir")) {
      if (window.KAI_CONFIG) window.KAI_CONFIG.autoOuvir = true;
      if (KAI_UI.recognition) KAI_UI.recognition.start();
      resposta = "Voltando a ouvir.";
    }
    else if (cmd.includes("lembre") || cmd.includes("salvar na memória")) {
      const texto = cmdOriginal.replace(/lembre|salvar na memória/gi, '').trim();
      resposta = window.KAI_MEMORY ? window.KAI_MEMORY.salvarMemoriaImportante(texto) : "Memória salva com sucesso.";
    }
    else if (cmd.includes("o que você lembra") || cmd.includes("buscar na memória")) {
      const termo = cmdOriginal.replace(/o que você lembra|buscar na memória/gi, '').trim();
      resposta = window.KAI_MEMORY ? window.KAI_MEMORY.buscarNaMemoria(termo) : "Nenhum dado encontrado na memória.";
    }

    // ROTEADOR DAS 9 GAVETAS (PRIORIDADE LOCAL)
    else if ((cmd.includes("vai") || cmd.includes("abrir")) && window.Navega) {
      resposta = window.Navega.ir(cmd);
    }
    else if (cmd.includes("cria") && window.Cria) {
      resposta = await window.Cria.executar(cmd);
    }
    else if ((cmd.includes("copia") || cmd.includes("resuma") || cmd.includes("analisa") || cmd.includes("traduz")) && window.Copia) {
      resposta = await window.Copia.executar(cmd);
    }
    else if ((cmd.includes("hora") || cmd.includes("data") || cmd.includes("status") || cmd.includes("estatísticas")) && window.Sistema) {
      resposta = await window.Sistema.executar(cmd);
    }
    else if ((cmd.includes("buscar") || cmd.includes("pesquisar")) && window.Busca) {
      resposta = await window.Busca.executar(cmd);
    }
    else if ((cmd.includes("calcular") || cmd.includes("somar") || cmd.includes("dividir") || cmd.includes("multiplicar") || cmd.includes("%")) && window.Calculo) {
      resposta = await window.Calculo.executar(cmd);
    }
    else if ((cmd.includes("postar") || cmd.includes("instagram") || cmd.includes("social") || cmd.includes("story") || cmd.includes("reels")) && window.Social) {
      resposta = await window.Social.executar(cmd);
    }
    else if ((cmd.includes("lead") || cmd.includes("venda") || cmd.includes("proposta") || cmd.includes("crm") || cmd.includes("cliente")) && window.Vendas) {
      resposta = await window.Vendas.executar(cmd);
    }
    else if ((cmd.includes("aula") || cmd.includes("curso") || cmd.includes("aprender") || cmd.includes("exercício") || cmd.includes("estudar")) && window.Educacao) {
      resposta = await window.Educacao.executar(cmd);
    }

    // FALLBACK: ENVIA PARA O GEMINI 2.5 NO SERVER.JS SE NÃO FOR ATENDIDO LOCALMENTE
    else {
      try {
        const response = await fetch('/api/kai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: cmdOriginal })
        });
        const data = await response.json();
        resposta = data.reply || `Comando recebido: "${cmdOriginal}".`;
      } catch (e) {
        console.error("[K-AI BRAIN ERROR]", e);
        resposta = "Ocorreu um erro ao conectar ao K-AI Core.";
      }
    }

    if (window.KAI_MEMORY && typeof window.KAI_MEMORY.adicionarConversa === 'function') {
      window.KAI_MEMORY.adicionarConversa(cmdOriginal, resposta);
    }

    KAI_UI.falar(resposta);
  }
};

// ===== 2. INTERFACE + CENA 3D CORVO + VOZ =====
export const KAI_UI = {
  scene: null,
  camera: null,
  renderer: null,
  nucleo: null,
  ring1: null,
  ring2: null,
  recognition: null,
  chat: null,

  init() {
    this.chat = document.getElementById('chat') || document.getElementById('chatBox') || document.getElementById('chat-container');
    this.iniciarCena3D();
    this.iniciarReconhecimento();
    this.eventos();
    this.falar(`K-AI online. Modo Chefe ativo. Pronto para comandos.`);
  },

  // ===== CENA 3D THREE.JS =====
  iniciarCena3D() {
    const canvas = document.getElementById('canvas3d');
    if (!canvas || typeof THREE === 'undefined') {
      console.warn("[K-AI UI] Canvas 3D ou Three.js não encontrado.");
      return;
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.nucleo = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.5, 2),
      new THREE.MeshPhongMaterial({ color: 0x00f5ff, emissive: 0x00f5ff, emissiveIntensity: 0.7, transparent: true, opacity: 0.9 })
    );
    this.scene.add(this.nucleo);

    this.ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.08, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x00f5ff, wireframe: true })
    );
    this.ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.08, 16, 100),
      new THREE.MeshBasicMaterial({ color: 0x00f5ff, wireframe: true })
    );
    this.ring2.rotation.x = Math.PI / 2;

    this.scene.add(this.ring1, this.ring2);

    const light = new THREE.PointLight(0x00f5ff, 2, 50);
    light.position.set(5, 5, 5);
    this.scene.add(light);

    this.camera.position.z = 5;
    this.animate();
  },

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.nucleo) {
      this.nucleo.rotation.x += 0.01;
      this.nucleo.rotation.y += 0.018;
      this.ring1.rotation.y += 0.025;
      this.ring2.rotation.z += 0.018;
      this.renderer.render(this.scene, this.camera);
    }
  },

  pulsarCore() {
    if (this.nucleo) {
      this.nucleo.material.emissiveIntensity = 1.5;
      setTimeout(() => { 
        if (this.nucleo) this.nucleo.material.emissiveIntensity = 0.7; 
      }, 250);
    }
  },

  // ===== CHAT UI =====
  addMsg(tipo, texto) {
    if (!this.chat) {
      this.chat = document.getElementById('chat') || document.getElementById('chatBox') || document.getElementById('chat-container');
    }
    if (!this.chat) return;

    const div = document.createElement('div');
    div.className = 'msg ' + (tipo === 'kai' ? 'kai-msg' : 'user-msg');
    div.innerHTML = tipo === 'user' ? `<b>Você:</b> ${texto}` : `<b>K-AI:</b> ${texto.replace(/\n/g, '<br>')}`;
    this.chat.appendChild(div);
    this.chat.scrollTop = this.chat.scrollHeight;
  },

  // ===== RECONHECIMENTO DE VOZ =====
  iniciarReconhecimento() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("[K-AI VOICE] Reconhecimento de voz não suportado neste navegador.");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'pt-BR';
    this.recognition.continuous = true;
    this.recognition.interimResults = false;

    this.recognition.onresult = (e) => {
      const cmd = e.results[e.results.length - 1][0].transcript;
      if (cmd.length > 2) {
        const input = document.getElementById('userInput') || document.getElementById('user-input');
        if (input) input.value = cmd;
        this.enviarTexto();
      }
    };

    this.recognition.onerror = (e) => console.error("[K-AI VOICE ERROR]", e.error);

    this.recognition.onend = () => {
      if (window.KAI_CONFIG && window.KAI_CONFIG.autoOuvir) {
        try { this.recognition.start(); } catch (err) {}
      }
    };

    if (window.KAI_CONFIG && window.KAI_CONFIG.autoOuvir) {
      try { this.recognition.start(); } catch (e) {}
    }
  },

  toggleMic() {
    if (!window.KAI_CONFIG) window.KAI_CONFIG = { autoOuvir: false };
    window.KAI_CONFIG.autoOuvir = !window.KAI_CONFIG.autoOuvir;

    const autoListenEl = document.getElementById('autoListen');
    const micBtnEl = document.getElementById('micBtn') || document.getElementById('mic-btn');

    if (autoListenEl) autoListenEl.style.display = window.KAI_CONFIG.autoOuvir ? 'block' : 'none';
    if (micBtnEl) micBtnEl.classList.toggle('listening', window.KAI_CONFIG.autoOuvir);

    if (!window.KAI_CONFIG.autoOuvir && this.recognition) this.recognition.stop();
    else if (window.KAI_CONFIG.autoOuvir && this.recognition) this.recognition.start();
  },

  // ===== SÍNTESE DE VOZ =====
  falar(texto) {
    this.addMsg('kai', texto);
    if (!('speechSynthesis' in window)) return;

    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(texto.replace(/[\#\*\_\`]/g, ''));
    utter.lang = 'pt-BR';
    utter.pitch = 0.6; // Voz grave estilo K-AI
    utter.rate = 0.95;
    utter.volume = 1;

    utter.onstart = () => this.pulsarCore();
    speechSynthesis.speak(utter);
  },

  // ===== INPUTS E MENUS =====
  enviarTexto() {
    const input = document.getElementById('userInput') || document.getElementById('user-input');
    if (!input || !input.value.trim()) return;

    const valor = input.value;
    this.addMsg('user', valor);
    input.value = "";
    KAI_BRAIN.processarComando(valor);
  },

  executar(cmd) {
    this.toggleMenu();
    this.addMsg('user', cmd);
    KAI_BRAIN.processarComando(cmd);
  },

  toggleMenu() {
    const menu = document.getElementById('menu');
    if (menu) {
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
  },

  anexarArquivo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = "image/*,.pdf,.txt,.doc,.docx";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      this.addMsg('user', `📎 Arquivo: ${file.name}`);
      if (window.Copia && typeof window.Copia.lerArquivo === 'function') {
        const res = await window.Copia.lerArquivo(file);
        this.falar(res);
      }
    };
    input.click();
  },

  eventos() {
    window.addEventListener('resize', () => {
      if (this.camera && this.renderer) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });

    const input = document.getElementById('userInput') || document.getElementById('user-input');
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.enviarTexto();
      });
    }
  }
};

// EXPOSIÇÃO GLOBAL
window.KAI_BRAIN = KAI_BRAIN;
window.KAI_UI = KAI_UI;
window.pulsarCore = () => KAI_UI.pulsarCore();

document.addEventListener('DOMContentLoaded', () => {
  KAI_UI.init();
});
