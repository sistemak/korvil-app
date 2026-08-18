const Cria = {
  async executar(cmd) {
    cmd = cmd.toLowerCase();
    if(cmd.includes("post")) return this.criarPost(cmd);
    if(cmd.includes("roteiro")) return this.criarRoteiro(cmd);
    if(cmd.includes("imagem")) return this.criarImagem(cmd);
    if(cmd.includes("email")) return this.criarEmail(cmd);
    if(cmd.includes("copy")) return this.criarCopy(cmd);
    if(cmd.includes("anuncio")) return this.criarAnuncio(cmd);
    if(cmd.includes("site")) return this.criarSite(cmd);
    if(cmd.includes("landing")) return this.criarLanding(cmd);
    if(cmd.includes("logo")) return this.criarLogo(cmd);
    if(cmd.includes("video")) return this.criarVideo(cmd);
    if(cmd.includes("curso")) return this.criarCurso(cmd);
    if(cmd.includes("aula")) return this.criarAula(cmd);
    if(cmd.includes("ebook")) return this.criarEbook(cmd);
    if(cmd.includes("produto")) return this.criarProduto(cmd);
    if(cmd.includes("oferta")) return this.criarOferta(cmd);
    return `Criando... ${cmd}. Diga: criar post, criar roteiro, criar imagem, criar email`;
  },

  // ENGENHARIA: SISTEMA DE TEMPLATES
  templates: {
    post: ["Dica KORVIL: {tema}. Comente EU QUERO", "Transforme sua vida com {tema}. Link na bio", "{tema} é o segredo. Salve pra ver depois"],
    roteiro: ["Hook: {tema}\nProblema\nSolução\nCTA", "AIDA: Atenção {tema}\nInteresse\nDesejo\nAção"],
    email: ["Assunto: {tema}\nOlá {nome},\n{conteudo}\nAbraços, KORVIL"]
  },

  criarPost(cmd){ const tema=cmd.replace("criar post","").trim()||"Sucesso"; const t=this.templates.post[Math.floor(Math.random()*3)].replace("{tema}",tema); return `Post criado:\n${t}`},
  criarRoteiro(cmd){ const tema=cmd.replace("criar roteiro","").trim()||"Vendas"; const t=this.templates.roteiro[0].replace("{tema}",tema); return `Roteiro criado:\n${t}`},
  criarImagem(cmd){ return `Gerando imagem sobre: ${cmd}. [ENGENHARIA: Integrar com IA de imagem depois]`},
  criarEmail(cmd){ const t=this.templates.email[0].replace("{tema}",cmd).replace("{nome}","Cliente"); return `Email criado:\n${t}`},
  criarCopy(cmd){ return `Copy persuasiva criada para: ${cmd}`},
  criarAnuncio(cmd){ return `Anúncio FB/IG criado: Título, Texto, CTA para ${cmd}`},
  criarSite(cmd){ return `Estrutura de site criada para: ${cmd}. [ENGENHARIA: Gerar HTML depois]`},
  criarLanding(cmd){ return `Landing page criada para: ${cmd}`},
  criarLogo(cmd){ return `Logo conceito criada para: ${cmd}`},
  criarVideo(cmd){ return `Roteiro de vídeo criado para: ${cmd}`},
  criarCurso(cmd){ return `Estrutura de curso criada: Módulos, Aulas sobre ${cmd}`},
  criarAula(cmd){ return `Aula criada sobre: ${cmd}`},
  criarEbook(cmd){ return `Ebook criado: Capítulos sobre ${cmd}`},
  criarProduto(cmd){ return `Produto digital criado: ${cmd}`},
  criarOferta(cmd){ return `Oferta irresistível criada: ${cmd}`},

  // 16-100: LOGICA DE GERACAO EM MASSA
  criarStory(){return "Story criado"},
  criarReels(){return "Roteiro Reels criado"},
  criarCarrossel(){return "Carrossel 10 slides criado"},
  criarBio(){return "Bio Instagram criada"},
  criarNome(){return "Nome de marca criado"},
  criarSlogan(){return "Slogan criado"},
  criarMissao(){return "Missão da empresa criada"},
  criarVisao(){return "Visão criada"},
  criarValores(){return "Valores criados"},
  criarPersona(){return "Persona criada"},
  criarPlano(){return "Plano de ação criado"},
  criarCalendario(){return "Calendário de conteúdo criado"},
  criarFunil(){return "Funil de vendas criado"},
  criarIsca(){return "Isca digital criada"},
  criarLead(){return "Página de captura criada"},
  criarObrigado(){return "Página obrigado criada"},
  criarWhats(){return "Mensagem WhatsApp criada"},
  criarScript(){return "Script de vendas criado"},
  criarApresentacao(){return "Apresentação criada"},
  criarProposta(){return "Proposta comercial criada"},
  //... até 100. Todas retornam string. Depois a gente pluga IA real
  criarContrato(){return "Contrato criado"},
  criarRelatorio(){return "Relatório criado"},
  criarDashboard(){return "Dashboard criado"},
  criarApp(){return "App conceito criado"},
  criarBot(){return "Bot criado"},
  criarAgente(){return "Agente IA criado"},
  criarSistema(){return "Sistema criado"},
  criarAutomacao(){return "Automação criada"},
  criarWorkflow(){return "Workflow criado"},
  criarAPI(){return "API criada"},
  //... completa até 100
  criar100(){return "Função 100 executada"}
}
export async function executar(cmd){
    if(cmd.includes('peça') || cmd.includes('pagina') || cmd.includes('html')){
        const nome = cmd.split('cria ')[1] || 'arquivo-novo.html';
        const codigo = `<!DOCTYPE html><html><body><h1>${nome}</h1><p>Criado pelo K-AI</p></body></html>`;
        baixar(nome, codigo);
        return falar(`Arquivo ${nome} criado e baixado Chefe`);
    }
    return falar('O que devo criar?');
}
function baixar(nome, conteudo){
    const blob = new Blob([conteudo], {type: 'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nome;
    a.click();
}
function falar(t){window.falar(t)}
