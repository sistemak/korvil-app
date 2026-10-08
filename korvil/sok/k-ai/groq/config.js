// korvil/sok/k-ai/groq/config.js
export const MODEL = 'llama-3.3-70b-versatile';
export const REPO = 'sistemak/korvil-app';
export const LABEL = 'k-ai';
export const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
export const SYSTEM_PROMPT = 'You are K-AI. You create files in repo sistemak/korvil-app. Always return JSON {"files":[{"path":"korvil/...","content":"..."}]} plus brief explanation. Keep path inside repo. Use GROQ_API_KEY from env (GitHub Secrets), never from code.';
export const FALLBACK_PATH = 'korvil/k-ai-output.md';
