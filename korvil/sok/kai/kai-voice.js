
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export class KAIVoice {
  /**
   * Inicializa os módulos de síntese e reconhecimento de voz para o K-AI.
   * @param {Function} onResultCallback - Callback acionado quando um comando de voz é reconhecido.
   */
  constructor(onResultCallback) {
    this.synth = window.speechSynthesis;
    this.recognition = null;
    this.isListening = false;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'pt-BR';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onstart = () => {
        this.isListening = true;
        console.log('[K-AI VOICE] Reconhecimento de voz ativado.');
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log(`[K-AI VOICE] Capturado: "${transcript}"`);
        if (typeof onResultCallback === 'function') {
          onResultCallback(transcript);
        }
      };

      this.recognition.onerror = (event) => {
        console.error('[K-AI VOICE] Erro no reconhecimento:', event.error);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
        console.log('[K-AI VOICE] Reconhecimento encerrado.');
      };
    } else {
      console.warn('[K-AI VOICE] API de reconhecimento de voz não suportada neste navegador.');
    }
  }

  /**
   * Inicia a escuta do microfone.
   */
  listen() {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
      } catch (err) {
        console.error('[K-AI VOICE] Falha ao iniciar microfone:', err);
      }
    }
  }

  /**
   * Cancela a escuta ativa do microfone.
   */
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  /**
   * Sintetiza o texto em áudio e fala a resposta do K-AI.
   * @param {string} text - Texto que o K-AI deve pronunciar.
   */
  speak(text) {
    if (!this.synth) {
      console.warn('[K-AI VOICE] Síntese de voz não suportada.');
      return;
    }

    // Cancela qualquer fala pendente ou em andamento
    this.synth.cancel();

    // Limpa marcações Markdown e caracteres especiais antes de falar
    const cleanText = text
      .replace(/[\#\*\_\`]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Seleciona voz em português se disponível
    const voices = this.synth.getVoices();
    const ptVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    this.synth.speak(utterance);
  }
}
