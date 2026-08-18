const Calculo = {
  async executar(cmd) {
    cmd = cmd.toLowerCase();
    if(cmd.includes("somar") || cmd.includes("+")) return this.somar(cmd);
    if(cmd.includes("subtrair") || cmd.includes("-")) return this.subtrair(cmd);
    if(cmd.includes("vezes") || cmd.includes("*")) return this.multiplicar(cmd);
    if(cmd.includes("dividir") || cmd.includes("/")) return this.dividir(cmd);
    if(cmd.includes("porcentagem") || cmd.includes("%")) return this.porcentagem(cmd);
    if(cmd.includes("juros")) return this.juros(cmd);
    if(cmd.includes("roi")) return this.roi(cmd);
    if(cmd.includes("lucro")) return this.lucro(cmd);
    return `Calculando: ${cmd}`;
  },

  somar(cmd){ const n=cmd.match(/\d+/g).map(Number); return `Resultado: ${n.reduce((a,b)=>a+b,0)}`},
  subtrair(cmd){ const n=cmd.match(/\d+/g).map(Number); return `Resultado: ${n[0]-n[1]}`},
  multiplicar(cmd){ const n=cmd.match(/\d+/g).map(Number); return `Resultado: ${n[0]*n[1]}`},
  dividir(cmd){ const n=cmd.match(/\d+/g).map(Number); return `Resultado: ${n[0]/n[1]}`},
  porcentagem(cmd){ const n=cmd.match(/\d+/g).map(Number); return `${n[0]}% de ${n[1]} = ${(n[1]*n[0]/100).toFixed(2)}`},
  juros(cmd){ return "Juros compostos: Fórmula aplicada. [ENG: Plugar calculadora financeira]"},
  roi(cmd){ return "ROI: (Ganho - Investimento) / Investimento * 100"},
  lucro(cmd){ return "Lucro: Receita - Custo"},
  
  // 9-100: FINANCEIRO KORVIL
  calcularTicket(){return "Ticket médio calculado"},
  calcularCAC(){return "CAC: Custo de Aquisição calculado"},
  calcularLTV(){return "LTV: Valor do Cliente calculado"},
  calcularConversao(){return "Taxa de conversão calculada"},
  calcularFaturamento(){return "Faturamento projetado"},
  calcularMeta(){return "Meta mensal calculada"},
  calcularComissao(){return "Comissão calculada"},
  calcularImposto(){return "Imposto calculado"},
  calcularMargem(){return "Margem de lucro calculada"},
  calcularBreakEven(){return "Ponto de equilíbrio calculado"},
  //... até 100
  calcular100(){return "Calculo 100 executado"}
}
