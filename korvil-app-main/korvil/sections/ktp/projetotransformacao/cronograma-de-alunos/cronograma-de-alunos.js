<script>
let ALUNOS_DB = {
  "ktp0": {nome:"SAY KORVIL", tipo:"ADMIN"}, // SEU ID ADM
  "mag1": {nome:"Magda Gomes dos Santos", tipo:"ADMIN"}, // MAG ADM
  "mcarla2": {nome:"Maria Carla Carvalho Santos", tipo:"ALUNO"},
  "hvitoria3": {nome:"Hellem Vitória Carvalho dos Santos", tipo:"ALUNO"},
  "alexandra4": {nome:"Alexandra", tipo:"ALUNO"},
  "michele5": {nome:"Michele B", tipo:"ALUNO"},
  "aline6": {nome:"Aline", tipo:"ALUNO"},
  "adriana7": {nome:"Adriana", tipo:"ALUNO"},
  "joss8": {nome:"Jossiane Alves", tipo:"ALUNO"},
  "amigaadrum9": {nome:"amigaadrum", tipo:"ALUNO"},
  "amigaadrdois10": {nome:"amigaadrdois", tipo:"ALUNO"},
  "angel11": {nome:"Angélica", tipo:"ALUNO"},
  "anapaula12": {nome:"Ana Paula", tipo:"ALUNO"},
  "gusta13": {nome:"Gustavo Geraldino", tipo:"ALUNO"},
  "sueli14": {nome:"Sueli", tipo:"ALUNO"},
  "fabi15": {nome:"Fabiana", tipo:"ALUNO"},
  "paula16": {nome:"Paula Cristine", tipo:"ALUNO"},
  "nop17": {nome:"Natan Osvath Paoli", tipo:"ALUNO"},
  "bianca18": {nome:"Bianca", tipo:"ALUNO"},
  "lau19": {nome:"Laura Jesus Aragão", tipo:"ALUNO"},
  "cass20": {nome:"Cassandra Jesus", tipo:"ALUNO"},
  "katia21": {nome:"Kátia Paoli", tipo:"ALUNO"},
  "mara22": {nome:"Lucimara", tipo:"ALUNO"},
  "edna23": {nome:"Edna", tipo:"ALUNO"},
  "luciane24": {nome:"Luciane Paoli", tipo:"ALUNO"},
  "marly25": {nome:"Marly", tipo:"ALUNO"},
  "mcris26": {nome:"Maria Cristina", tipo:"ALUNO"},
  "juci27": {nome:"Jucilene", tipo:"ALUNO"},
  "joce28": {nome:"Jocélia", tipo:"ALUNO"},
  "marcos29": {nome:"Marcos França", tipo:"ALUNO"},
  "lucas30": {nome:"Lucas", tipo:"ALUNO"},
  "celi31": {nome:"Celidalva", tipo:"ALUNO"},
  "jaque32": {nome:"Jaqueline", tipo:"ALUNO"},
  "elisa33": {nome:"Elisangela", tipo:"ALUNO"},
  "gice34": {nome:"Gicelia", tipo:"ALUNO"},
  "pati35": {nome:"Patrícia", tipo:"ALUNO"},
  "mel36": {nome:"Melissa", tipo:"ALUNO"},
  "naty37": {nome:"Natália Melo", tipo:"ALUNO"},
  "gon38": {nome:"José Gonzaga", tipo:"ALUNO"},
  "nicol39": {nome:"Nicoli da Silga Guedes", tipo:"ALUNO"},
  "tchuco1": {nome:"Tchuco Silva", tipo:"ALUNO"},
  "dani2": {nome:"Daniele Vieira Leite", tipo:"ALUNO"}
};

let CRONOGRAMA_DB = {
"PRESENCIAL": [
    {hora:"06h00 🐦", status:"DESATIVADOS", alunos:[
      {n:0, id:"adriana7", aluno:"Adriana", dias:"Ter Qua", freq:"2x", objetivo:"Emagrecimento", valor:"R$80,00", matricula:"R$0,00", total:"R$80,00", venc:"24/03/26", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 2x"},
      {n:1, id:"joss8", aluno:"Jossiane Alves", dias:"Seg a Sex", freq:"5x", objetivo:"Definição", valor:"R$150,00", matricula:"R$0,00", total:"R$150,00", venc:"24/10/25", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 5x"},
      {n:2, id:"amigaadrum9", aluno:"amigaadrum", dias:"--", freq:"--", objetivo:"Saúde", valor:"--", matricula:"--", total:"--", venc:"--", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"--"},
      {n:3, id:"amigaadrdois10", aluno:"amigaadrdois", dias:"--", freq:"--", objetivo:"Saúde", valor:"--", matricula:"--", total:"--", venc:"--", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"--"}
    ]},
    {hora:"08h00 🐢", status:"ATIVOS", alunos:[
      {n:0, id:"mag1", aluno:"Magda Gomes dos Santos", dias:"Segunda, Terça, Quarta, Quinta, Sexta", freq:"5x", objetivo:"Definição Muscular", valor:"R$150,00", matricula:"R$50,00", total:"R$200,00", venc:"13/05/26", status:"Ativo", cpf:"112.505.24", nasc:"2026-07-27", idade:"0 anos", genero:"Feminino", whats:"(13) 99636-4009", email:"magdagomes998@gmail.com", nivel_atividade:"Intermediário", q1:"Sim", q2:"Irregular", q3:"9 horas", q4:"Não", q5:"Abdômen", q6:"Não", q7:"Sim", q8:"Sim", q9:"Anti depressivo", plano:"Presencial 5x"},
      {n:1, id:"mcarla2", aluno:"Maria Carla Carvalho Santos", dias:"Segunda, Quinta, Sexta", freq:"3x", objetivo:"Emagrecimento | Saúde | Hipertrofia | Definição Muscular | Condicionamento Físico | Reabilitação Física", valor:"R$100,00", matricula:"R$50,00", total:"R$150,00", venc:"06/08/2026", status:"Ativo", cpf:"417.344.068-52", nasc:"1996-04-22", idade:"30 anos", genero:"Feminino", whats:"(13) 99768-3699", email:"carlacarvalho8362@gmail.com", nivel_atividade:"Iniciante", q1:"Sim", q2:"Mais ou menos, preciso melhorar", q3:"6 a 7 horas", q4:"Não", q5:"Barriga, braços e pernas", q6:"Não", q7:"Sim", q8:"Sim", q9:"Vitaminas e ferro norimpurum", plano:"Presencial 3x"},
      {n:2, id:"hvitoria3", aluno:"Hellem Vitória Carvalho dos Santos", dias:"Segunda, Quinta, Sexta", freq:"3x", objetivo:"Definição Muscular | Saúde | Hipertrofia | Condicionamento Físico | Reabilitação Física | Emagrecimento", valor:"R$100,00", matricula:"R$50,00", total:"R$150,00", venc:"06/08/2026", status:"Ativo", cpf:"417.344.078-24", nasc:"1999-01-11", idade:"27 anos", genero:"Feminino", whats:"(13) 99645-0471", email:"vitoria2018201@gmail.com", nivel_atividade:"Iniciante", q1:"Sim", q2:"Normal,preciso aumentar a proteína", q3:"7 horas", q4:"Não", q5:"Braços,barriga, culote e pernas.", q6:"Não", q7:"Sim", q8:"Sim", q9:"Só noripurum", plano:"Presencial 3x"}
    ]},
    {hora:"19h00 ⭐", status:"ATIVOS", alunos:[
      {n:0, id:"gon38", aluno:"José Gonzaga", dias:"Seg Qua Sex", freq:"3x", objetivo:"Hipertrofia", valor:"R$100,00", matricula:"R$0,00", total:"R$100,00", venc:"13/05/26", status:"Ativo", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Presencial 3x"},
      {n:1, id:"nicol39", aluno:"Nicoli da Silga Guedes", dias:"Segunda, Quarta, Sexta", freq:"3x", objetivo:"Definição Muscular | Condicionamento Físico | Reabilitação Física | Saúde", valor:"R$100,00", matricula:"R$50,00", total:"R$150,00", venc:"30/04/26", status:"Ativo", cpf:"397.764.168-96", nasc:"2001-10-21", idade:"25 anos", genero:"Feminino", whats:"(13) 99657-4924", email:"nicolisgdss@gmail.com", nivel_atividade:"Iniciante", q1:"Apenas na epoca de escola", q2:"Nao me alimento corretamente", q3:"7/8h", q4:"Nao", q5:"Resistencia de braco e pernas, pois nao tenho forca", q6:"Nao", q7:"Sim", q8:"Sim", q9:"Nao", plano:"Presencial 3x"}
    ]}
  ],
"ONLINE": [
    {hora:"14h00", status:"DESATIVADOS", alunos:[
      {n:0, id:"tchuco1", aluno:"Tchuco Silva", dias:"Segunda a Sexta", freq:"5x", objetivo:"Condicionamento Físico | Saúde", valor:"R$60,00", matricula:"R$0,00", total:"R$60,00", venc:"15/07/26", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Online 5x"},
      {n:1, id:"dani2", aluno:"Daniele Vieira Leite", dias:"Seg a Sex", freq:"5x", objetivo:"Definição", valor:"R$60,00", matricula:"R$0,00", total:"R$60,00", venc:"13/05/26", status:"Desativado", cpf:"--", nasc:"--", idade:"--", genero:"--", whats:"--", email:"--", nivel_atividade:"--", q1:"--", q2:"--", q3:"--", q4:"--", q5:"--", q6:"--", q7:"--", q8:"--", q9:"--", plano:"Online 5x"}
    ]}
  ]
};
  
let planoAtivo = 'PRESENCIAL';
let idLogado = localStorage.getItem('idLogado') || '';

function abrirBuscaAluno(){document.getElementById('modal-aluno').classList.add('ativo');}
function fecharBuscaAluno(){document.getElementById('modal-aluno').classList.remove('ativo');}

function trocarAba(plano, el){
  planoAtivo = plano;
  document.querySelectorAll('.aba-plano').forEach(b=>b.classList.remove('ativa'));
  el.classList.add('ativa');
  mostrarCronograma();
}

function tabelaAlunos(lista){
  lista.sort((a,b)=>a.n - b.n); // ORDENA POR NUMERO
  let thead = `<thead><tr><th>Nº</th><th>Aluno</th><th>Dias</th><th>Freq</th><th>Objetivo</th><th>Valor</th><th>Matrícula</th><th>Total</th><th>Vencimento</th><th>Status</th><th>ID</th><th>CPF</th><th>Data Nasc</th><th>Idade</th><th>Gênero</th><th>WhatsApp</th><th>Email</th><th>Nível de Atividade Física</th><th>1. Já praticou atividade física antes?</th><th>2. Como você descreve sua ALIMENTAÇÃO atual?</th><th>3. Quantas horas você DORME por noite?</th><th>4. Possui alguma RESTRIÇÃO alimentar?</th><th>5. Qual parte do corpo quer MELHORAR mais?</th><th>6. Possui alguma DEFICIENCIA ou LIMITAÇÃO fisica?</th><th>7. Está passando ou JÁ TEVE acompanhamento profissional PSICOLÓGICO?</th><th>8. Está fazendo ALGUM TRATAMENTO fisico ou psicológico?</th><th>9. Está fazendo USO DE MEDICAMENTOS? Quais?</th><th>Plano</th></tr></thead>`;
  let tbody = '<tbody>';
  lista.forEach(a=>{
    tbody += `<tr><td>${a.n?? '-'}</td><td>${a.aluno}</td><td>${a.dias}</td><td>${a.freq}</td><td>${a.objetivo}</td><td>${a.valor}</td><td>${a.matricula}</td><td>${a.total}</td><td>${a.venc}</td><td class="${a.status==='Ativo'?'status-ativo':'status-desativado'}">${a.status}</td><td>${a.id}</td><td>${a.cpf}</td><td>${a.nasc}</td><td>${a.idade}</td><td>${a.genero}</td><td>${a.whats}</td><td>${a.email}</td><td>${a.nivel_atividade}</td><td>${a.q1}</td><td>${a.q2}</td><td>${a.q3}</td><td>${a.q4}</td><td>${a.q5}</td><td>${a.q6}</td><td>${a.q7}</td><td>${a.q8}</td><td>${a.q9}</td><td>${a.plano}</td></tr>`;
  });
  tbody += '</tbody>';
  return `<div class="tabela-wrapper"><table>${thead}${tbody}</table></div>`;
}

function mostrarCronograma(){
  const container = document.getElementById('cronograma-container');
  if(!idLogado){ container.innerHTML = '<div class="msg-inicial">Clique em "COLAR ID" e digite seu ID para ver seu cronograma</div>'; return; }
  let html = `<div class="titulo-crono">📋 CRONOGRAMA K-TP — PROJETO TRANSFORMAÇÃO</div>`;
  const ehAdmin = ALUNOS_DB[idLogado]?.tipo === 'ADMIN';
  html += `<div class="obs-pix">Olá ${ALUNOS_DB[idLogado].nome}, sua mensalidade está prestes a vencer.<br>Esteja com o pagamento corretamente em dia para continuar participando.<br><b>Pix: korvilloja@gmail.com</b></div>`;
  if(ehAdmin){
    html += `<div class="abas-plano"><button class="aba-plano ${planoAtivo==='PRESENCIAL'?'ativa':''}" onclick="trocarAba('PRESENCIAL', this)">🌐 PRESENCIAL</button><button class="aba-plano ${planoAtivo==='ONLINE'?'ativa':''}" onclick="trocarAba('ONLINE', this)">💻 ONLINE</button></div>`;
  }
  CRONOGRAMA_DB[planoAtivo].forEach(bloco=>{
    let alunosDoBloco = ehAdmin? bloco.alunos : bloco.alunos.filter(a => a.id === idLogado); // ADM VE TUDO, ALUNO VE SO O DELE
    if(alunosDoBloco.length === 0) return;
    html += `<div class="grupo-horario">🕒 ${bloco.hora}</div>`;
    html += `<div class="grupo-status">${bloco.status==='ATIVOS'?'✅ ATIVOS':'❌ DESATIVADOS'}</div>`;
    html += tabelaAlunos(alunosDoBloco);
  });
  container.innerHTML = html || '<div class="msg-inicial">Nenhum aluno encontrado para este ID</div>';
}

function buscarAluno(){
  const id=document.getElementById('input-id-aluno').value.toLowerCase().trim().replace(/\s+/g, '');
  let encontrado = ALUNOS_DB[id];
  if(!encontrado){alert('ID não encontrado');return;}
  idLogado = id;
  localStorage.setItem('idLogado', id);
  fecharBuscaAluno();
  mostrarCronograma();
  document.getElementById('input-id-aluno').value='';
}

window.onload = function(){
  if(idLogado && ALUNOS_DB[idLogado]){
    mostrarCronograma();
  }
};
</script>
