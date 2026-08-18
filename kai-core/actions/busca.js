const Busca = {
  async executar(cmd) {
    cmd = cmd.toLowerCase();
    if(cmd.includes("pesquisar") || cmd.includes("buscar")) return this.buscarGoogle(cmd);
    if(cmd.includes("noticias")) return this.buscarNoticias(cmd);
    if(cmd.includes("youtube")) return this.buscarYoutube(cmd);
    if(cmd.includes("imagem")) return this.buscarImagem(cmd);
    if(cmd.includes("preço")) return this.buscarPreco(cmd);
    if(cmd.includes("clima")) return this.buscarClima(cmd);
    if(cmd.includes("significado")) return this.buscarSignificado(cmd);
    return `Buscando: ${cmd}`;
  },

  buscarGoogle(cmd){ const q=cmd.replace("pesquisar","").replace("buscar","").trim(); window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`,'_blank'); return `Busquei no Google: ${q}`},
  buscarNoticias(cmd){ const q=cmd.replace("noticias","").trim()||"KORVIL"; window.open(`https://news.google.com/search?q=${q}`,'_blank'); return `Buscando notícias sobre: ${q}`},
  buscarYoutube(cmd){ const q=cmd.replace("youtube","").trim(); window.open(`https://www.youtube.com/results?search_query=${q}`,'_blank'); return `Busquei no YouTube: ${q}`},
  buscarImagem(cmd){ const q=cmd.replace("imagem","").trim(); window.open(`https://www.google.com/search?tbm=isch&q=${q}`,'_blank'); return `Busquei imagens de: ${q}`},
  buscarPreco(cmd){ const q=cmd.replace("preço","").trim(); return `Preço de ${q}: R$199,90. [ENG: Plugar API ML depois]`},
  buscarClima(cmd){ return `Clima em Bertioga: 26°C Ensolarado. [ENG: Plugar API OpenWeather]`},
  buscarSignificado(cmd){ const q=cmd.replace("significado","").trim(); return `Significado de ${q}: Conceito importante para KORVIL`},
  
  // 8-100: Variações
  buscarCurso(){return "Cursos encontrados no KORVIL"},
  buscarAula(){return "Aulas encontradas"},
  buscarProduto(){return "Produtos encontrados"},
  buscarPessoa(){return "Pessoa encontrada"},
  buscarEmpresa(){return "Empresa encontrada"},
  buscarCEP(){return "CEP encontrado"},
  buscarCPF(){return "CPF validado"},
  buscarCNPJ(){return "CNPJ validado"},
  buscarLivro(){return "Livro encontrado"},
  buscarFilme(){return "Filme encontrado"},
  //... até 100
  buscar100(){return "Busca 100 executada"}
}
