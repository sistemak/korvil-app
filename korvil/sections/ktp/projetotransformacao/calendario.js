// korvil/sections/ktp/projetotransformacao/calendario.js
// 52 SEMANAS - module.exports + window
window.KTP_CALENDARIO = window.KTP_CALENDARIO || {};
window.KTP_CALENDARIO.SEMANAS = Array.from({length:52}, function(_,i){
  return {semana:i+1, inicio:'2026-W' + String(i+1).padStart(2,'0'), status: i<10?'CONCLUIDO':'PENDENTE'};
});
window.KTP_CALENDARIO.getSemana = function(n){ return window.KTP_CALENDARIO.SEMANAS[n-1]; };
if(typeof module!=='undefined' && module.exports){ module.exports = window.KTP_CALENDARIO; }
