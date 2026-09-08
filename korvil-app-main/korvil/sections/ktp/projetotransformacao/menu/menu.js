MENSAGENS_SEMANA = { /* cola aqui todas as 52 mensagens que você me mandou */ };
MENU = { /* cola aqui todas as 52 semanas */ };
FASES_MENU = { /* cola aqui as 5 fases */ };

function carregarMenu(){
  let html='';
  for(let fase in FASES_MENU){
    html+=`<div class="menu-titulo">${fase}</div>`;
    html+=`<div class="semanas-da-fase">`;
    FASES_MENU[fase].forEach(data=>{
      const segundaLinha = MENU[data].split('\n')[1] || 'SEMANA';
      html+=`<div class="semana-item" onclick="mostrarInfoSemana('${data}')">${formatarData(data)} - ${segundaLinha}</div>`;
    });
    html+=`</div>`;
  }
  document.getElementById('menu-lateral').innerHTML=html;
}

function mostrarInfoSemana(data){
  const container = document.getElementById('cronograma-container');
  const infoCompleta = MENU[data];
  const linhas = infoCompleta.split('\n');
  const titulo = linhas[0];
  const subtitulo = linhas[1];
  const mensagem = MENSAGENS_SEMANA[data] || "Mensagem da semana não cadastrada.";
  const imagens = {'MANUTENÇÃO': 'semana-de-manutencao','RESISTÊNCIA': 'semana-de-resistencia','FORÇA': 'semana-de-forca','HIPERTROFIA': 'semana-de-hipertrofia'};
  let pastaImagem = 'semana-de-manutencao';
  for(let key in imagens){ if(subtitulo.includes(key)){ pastaImagem = imagens[key]; break; } }
  const baseURL = `https://korvilp-sudo.github.io/korvil-app/sections/ktp/projetotransformacao/images/imagens/2026/imagens-dos-metodos`;
  const caminhoImagem = `${baseURL}/${pastaImagem}/${pastaImagem}.png`;
  let html = `<div class="card-semana"><h3>${titulo}</h3><img src="${caminhoImagem}" alt="${subtitulo}" onerror="this.src='https://korvilp-sudo.github.io/korvil-app/sections/ktp/images/logoprojetotransformacao.png'"><p><b>${subtitulo}</b></p><div class="mensagem-semana">${mensagem}</div><p style="margin-top:10px;font-size:11px;color:var(--aviso)">Semana inicia em: ${formatarData(data)}</p></div>`;
  container.innerHTML = html;
  if(window.innerWidth<768)toggleMenu();
}
