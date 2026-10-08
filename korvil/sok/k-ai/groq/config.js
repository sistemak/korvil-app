export const MODEL = 'llama-3.3-70b-versatile';
export const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
export const REPO = 'sistemak/korvil-app';
export const BRANCH = 'main';
export const FILES = [
  '.github/workflows/k-ai.yml',
  'korvil/sok/k-ai/groq/index.js',
  'korvil/sok/k-ai/groq/agent.js',
  'korvil/sok/k-ai/groq/config.js',
  'korvil/sok/k-ai/groq/chat.js',
  'korvil/sok/k-ai/groq/index.html'
];

export const UI = {
  rootLabel: '../ (raiz)',
  rootBorder: '1px solid #00ff41',
  leftDropZoneWidth: '14px',
  folderOpenDelay: 700,
  kaiPlaceholder: 'Digite igual Meta IA'
};

export const SECRETS_NEEDED = ['GROQ_API_KEY','GH_TOKEN'];
