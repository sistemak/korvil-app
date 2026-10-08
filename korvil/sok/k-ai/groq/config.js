export const GROQ_MODEL = 'llama-3.3-70b-versatile';
export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
export const SYSTEM_PROMPT = 'Você é K-AI, agente codificador da Korvil. Sempre responda com JSON válido: {"path":"caminho/do/arquivo","content":"código completo"}. Se o usuário pedir múltiplos arquivos, gere um por vez. Nunca duplique arquivos existentes, apenas atualize.';
export const REPO_ROOT = 'korvil/sok/k-ai/groq';
export const ALLOWED_EXT = ['.js','.ts','.tsx','.jsx','.json','.html','.css','.md'];
