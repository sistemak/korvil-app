export default {
  nome: "Automação",
  comandos: {
    "executar plano": () => kai.falar("Executando plano Delta").e(executarPlano()),
    "continuar": () => kai.falar("Continuando processo").e(continuar()),
    "cancelar": () => kai.falar("Operação cancelada").e(cancelar()),
    "confirmar": () => kai.falar("Confirmado").e(confirmar()),
    "prioridade máxima": () => kai.falar("Prioridade máxima definida").e(prioridade())
  }
}
function executarPlano(){ console.log("Plano") }
function continuar(){ console.log("Continuar") }
function cancelar(){ console.log("Cancelar") }
function confirmar(){ console.log("Confirmar") }
function prioridade(){ console.log("Prioridade") }
