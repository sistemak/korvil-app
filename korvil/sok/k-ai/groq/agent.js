export * from './index.js';
export { MODEL, API_URL, REPO, FILES } from './config.js';
export { mountKaiBar } from './chat.js';

console.log('[K-AI Agent] bridge ativo - llama-3.3-70b-versatile');
export const AGENT_VERSION = 'final-master-v1';
export function getAgentInfo(){
  return {
    model: 'llama-3.3-70b-versatile',
    repo: 'sistemak/korvil-app',
    files: 6,
    features: ['../ raiz verde','leftDropZone 14px','drag pointer events','folderOpenTimers 700ms','mini menu completo','kaiBar Issue trigger']
  }
}
