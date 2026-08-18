// K-BRAIN v1 - Memória do K-AI
export type Memoria = {
  nomeUsuario: string
  ultimaConversa: string
  dados: Record<string, string>
}

const CHAVE = 'k-brain-memoria'

export function salvarMemoria(novaMemoria: Partial<Memoria>) {
  const memoriaAtual = carregarMemoria()
  const memoriaNova = {...memoriaAtual,...novaMemoria }
  localStorage.setItem(CHAVE, JSON.stringify(memoriaNova))
}

export function carregarMemoria(): Memoria {
  const dados = localStorage.getItem(CHAVE)
  if (!dados) {
    return { nomeUsuario: 'K-RIADOR', ultimaConversa: '', dados: {} }
  }
  return JSON.parse(dados)
}

export function esquecerTudo() {
  localStorage.removeItem(CHAVE)
}
