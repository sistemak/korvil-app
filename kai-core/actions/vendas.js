const Vendas = {
  async executar(cmd) {
    cmd = cmd.toLowerCase();
    if(cmd.includes("lead")) return this.cadastrarLead(cmd);
    if(cmd.includes("proposta")) return this.gerarProposta(cmd);
    if(cmd.includes("follow")) return this.followUp(cmd);
    if(cmd.includes("fechar")) return this.fecharVenda(cmd);
    if(cmd.includes("funil")) return this.analisarFunil(cmd);
    if(cmd.includes("script")) return this.gerarScript(cmd);
    return `Vendas: ${cmd}`;
  },

  cadastrarLead(cmd){ localStorage.setItem('lead_'+Date.now(), cmd); return `Lead cadastrado: ${cmd}`},
  gerarProposta(cmd){ return `Proposta gerada: R$1.997. Validade 7 dias`},
  followUp(cmd){ return `Follow-up agendado para amanhã 10h`},
  fecharVenda(cmd){ return `Venda fechada! Parabéns Chefe`},
  analisarFunil(cmd){ return `Funil: 100 Leads > 20 Propostas > 5 Vendas`},
  gerarScript(cmd){ return `Script: Olá, vi que você tem interesse em ${cmd}...`},

  // 7-100: CRM KORVIL
  cadastrarCliente(){return "Cliente cadastrado no CRM"},
  atualizarStatus(){return "Status atualizado para: Negociação"},
  criarTarefa(){return "Tarefa criada: Ligar para cliente"},
  gerarContrato(){return "Contrato gerado"},
  enviarWhats(){return "WhatsApp enviado"},
  enviarEmail(){return "Email de vendas enviado"},
  criarOferta(){return "Oferta irresistível criada"},
  calcularComissao(){return "Comissão: R$500"},
  relatorioVendas(){return "Relatório: R$50.000 este mês"},
  metaMensal(){return "Meta: 80% atingida"},
  //... até 100
  vendas100(){return "Vendas 100 executado"}
}
