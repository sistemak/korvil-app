
// kai-core/commands/openApp.js

/**
 * Módulo de Navegação e Abertura de Aplicativos/Rotas do K-AI
 */

// Mapeamento de rotas e aplicações internas/externas
const APP_MAP = {
    // Rotas internas do projeto K-AI
    'admin': './kai-admin.html',
    'usuario': './kai-user.html',
    'user': './kai-user.html',
    'oficial': './kai-oficial.html',
    'principal': './index.html',
    'forge': './kai-forge.html',
    
    // Links externos ou ferramentas
    'google': 'https://www.google.com',
    'github': 'https://github.com'
};

/**
 * Abre um app ou rota com base no nome informado
 * @param {string} appName - Nome do app ou rota solicitada
 * @param {boolean} newTab - Se deve abrir em nova aba
 */
export const openApp = (appName, newTab = false) => {
    if (!appName) {
        return "Nenhum aplicativo ou rota foi especificado.";
    }

    const cleanName = appName.toLowerCase().trim();
    const targetUrl = APP_MAP[cleanName] || (cleanName.startsWith('http') ? cleanName : null);

    if (targetUrl) {
        if (newTab || targetUrl.startsWith('http')) {
            window.open(targetUrl, '_blank');
        } else {
            window.location.href = targetUrl;
        }
        return `Abrindo ${cleanName}...`;
    }

    return `Aplicativo ou rota '${appName}' não encontrada no mapeamento.`;
};
