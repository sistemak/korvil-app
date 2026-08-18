// kai-core/commands/createFile.js

/**
 * Módulo para criação de arquivos dinâmicos (Downloads)
 * Usado pelo motor "Cria" do K-AI
 */

export const createFile = (filename, content, type = 'text/plain') => {
    try {
        // Cria o blob com o conteúdo
        const blob = new Blob([content], { type: type });
        const url = URL.createObjectURL(blob);
        
        // Cria um link temporário para forçar o download
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        
        // Dispara o download
        document.body.appendChild(a);
        a.click();
        
        // Limpeza
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return `O arquivo '${filename}' foi gerado com sucesso.`;
    } catch (error) {
        console.error("[K-AI COMMAND] Erro ao criar arquivo:", error);
        return "Erro ao gerar o arquivo. Tente novamente.";
    }
};

/**
 * Exemplo de uso para o processador:
 * createFile('nota.txt', 'Olá, este é um arquivo gerado pelo K-AI');
 */

