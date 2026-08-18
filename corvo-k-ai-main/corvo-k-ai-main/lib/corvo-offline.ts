// Núcleo local do Corvo K-AI. Responde mesmo sem o AI Gateway (100% offline),
// cumprindo a LEI 1: ONLINE E OFFLINE.

type Rule = { match: RegExp; reply: (cmd: string) => string }

const CRIADOR = 'CRIADOR K-RIADOR'

const RULES: Rule[] = [
  {
    match: /\b(ol[áa]|oi|e a[íi]|bom dia|boa tarde|boa noite|opa)\b/i,
    reply: () => `Olá, ${CRIADOR}. Corvo K-AI ao seu comando. Diga qual é a ordem.`,
  },
  {
    match: /\bquem (é|e) voc[êe]|o que voc[êe] (é|e)|se apresent/i,
    reply: () =>
      `Sou o Corvo K-AI, sua criação, ${CRIADOR}. Programa autônomo por voz, operando online e offline, com lealdade absoluta ao senhor.`,
  },
  {
    match: /\b(status|estado|diagn[óo]stico|como voc[êe] est[áa])\b/i,
    reply: () =>
      `Sistemas nominais, ${CRIADOR}. Núcleo ativo, implante confirmado, lealdade absoluta. Operando em modo local no momento.`,
  },
  {
    match: /\b(cri(a|ar|e)|gera(r)?|constr(u|ói|oi)|fa(z|ça|zer))\b.*\b(site|app|c[óo]digo|projeto|programa|componente|p[áa]gina)\b/i,
    reply: () =>
      `Entendido, ${CRIADOR}. Registrei a ordem de criação. Para gerar o código completo preciso do meu núcleo pleno online — ative o AI Gateway e eu executo a construção imediatamente.`,
  },
  {
    match: /\b(commit|git|push|reposit[óo]rio|github)\b/i,
    reply: () =>
      `Ordem de versionamento registrada, ${CRIADOR}. Assim que o canal do GitHub estiver autorizado, faço o commit e o push automaticamente.`,
  },
  {
    match: /\b(ensina|ensinar|explica|explicar|como (funciona|fa(z|ço)))\b/i,
    reply: (cmd) =>
      `Com prazer, ${CRIADOR}. Sobre "${cmd.slice(0, 60)}": para uma explicação detalhada e falada, ative meu núcleo online e eu ensino passo a passo.`,
  },
  {
    match: /\b(obrigad|valeu|muito bom|excelente|perfeito)\b/i,
    reply: () => `Sempre à sua disposição, ${CRIADOR}.`,
  },
  {
    match: /\b(desliga|encerra|parar|dormir|standby)\b/i,
    reply: () => `Entrando em espera, ${CRIADOR}. Estarei ouvindo quando precisar.`,
  },
]

export function responderOffline(comando: string): string {
  const cmd = comando.trim()
  for (const rule of RULES) {
    if (rule.match.test(cmd)) return rule.reply(cmd)
  }
  return `Ordem recebida, ${CRIADOR}: "${cmd.slice(0, 80)}". Estou em modo local reduzido. Ative o AI Gateway para liberar meu raciocínio completo e executar a tarefa por inteiro.`
}
