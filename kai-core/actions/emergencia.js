export default {
  nome: "Emergência",
  comandos: {
    "protocolo ômega": () => kai.falar("ATENÇÃO: PROTOCOLO ÔMEGA ATIVADO").e(omega()),
    "evacuação": () => kai.falar("Iniciando protocolo de evacuação").e(evacuar()),
    "assistência médica": () => kai.falar("Acionando assistência médica").e(medico()),
    "acionar emergência": () => kai.falar("Emergência acionada. Contatando autoridades").e(emergencia())
  }
}
function omega(){ document.body.style.background='red' }
function evacuar(){ kai.falar("Evacuar") }
function medico(){ kai.falar("Médico") }
function emergencia(){ kai.falar("Emergência") }
