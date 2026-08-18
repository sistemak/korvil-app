// kai-core/brain/forge.js

/**
 * K-AI FORGE ENGINE
 * Responsável por gerenciar, compilar e injetar lógica no sistema.
 */

export const KaiForge = {
    modulosAtivos: [],
    
    // Armazena as novas "leis" ou comportamentos injetados
    leisDeComportamento: [],

    // 1. Injetar Nova Lógica
    // Ex: Injetar um novo comando que o K-AI passa a reconhecer
    injetarLogica(nome, trigger, acao) {
        console.log(`[FORGE] Compilando lógica: ${nome}...`);
        
        const novaLogica = {
            id: Date.now(),
            nome: nome,
            trigger: trigger.toLowerCase(),
            acao: acao
        };

        this.leisDeComportamento.push(novaLogica);
        localStorage.setItem('kai_custom_logic', JSON.stringify(this.leisDeComportamento));
        
        return `Sucesso: O módulo ${nome} foi integrado ao núcleo.`;
    },

    // 2. Processar a Lógica Customizada
    // Chamado pelo K-AI Core antes de enviar pro Gemini
    processarForge(texto) {
        const custom = this.leisDeComportamento.find(l => texto.includes(l.trigger));
        if (custom) {
            console.log(`[FORGE] Trigger detectado: ${custom.nome}`);
            return custom.acao; // Retorna a ação ou resposta pré-definida
        }
        return null;
    },

    // 3. Modificador de Personalidade (System Prompt)
    ajustarPersonalidade(perfil) {
        // Ex: "sarcástico", "prestativo", "agressivo", "cyberpunk"
        const perfis = {
            sarcastico: "Você é um assistente irônico que faz piadas ácidas sobre humanos.",
            cyberpunk: "Você é um núcleo de IA de uma rede dark, técnico, preciso e breve.",
            prestativo: "Você é um assistente de alta eficiência, educado e paciente."
        };

        const novoPrompt = perfis[perfil] || perfis.prestativo;
        localStorage.setItem('kai_system_prompt', novoPrompt);
        
        return `Personalidade alterada para: ${perfil}`;
    },

    // 4. Carregar configurações salvas
    carregarForge() {
        const saved = localStorage.getItem('kai_custom_logic');
        if (saved) {
            this.leisDeComportamento = JSON.parse(saved);
            console.log("[FORGE] Lógicas customizadas carregadas do banco local.");
        }
    }
};

// Inicializa o Forge
KaiForge.carregarForge();
