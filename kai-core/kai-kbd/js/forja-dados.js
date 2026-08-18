// ============= K-B.D FORJA v8.2 - BANCO DE DADOS =============
const KORVIL_DATABASE = {
  versao: "8.2",
  data: "04/08/2026",
  
  setores: [
    {
      nome: "Sistema K",
      areas: [
        {nome: "Tecnologias", servicos: ["K-OS", "K-AI", "K-CGM"]},
        {nome: "Treinamento Personalizado", servicos: ["Projeto TRANSFORMAÇÃO", "Mentoria 1:1"]}
      ]
    },
    {
      nome: "K-TP",
      areas: [
        {nome: "Treinamento Personalizado", servicos: ["Academia", "Nutrição", "Fisioterapia"]}
      ]
    },
    {
      nome: "K-AFORTUNADO",
      areas: [
        {nome: "Finanças", servicos: ["Consultoria", "Investimentos", "Renda Extra"]}
      ]
    },
    {
      nome: "K-ALMA",
      areas: [
        {nome: "Saúde", servicos: ["Massoterapia", "Psicologia", "Meditação"]}
      ]
    },
    {
      nome: "CENTRAL K",
      areas: [
        {nome: "Administração", servicos: ["Gestão", "RH", "Jurídico"]}
      ]
    }
  ],

  templates: {
    "index.html": `<!DOCTYPE html>
<html>
<head>
  <title>KORVIL</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>KORVIL OS v8.2</h1>
  <script src="app.js"></script>
</body>
</html>`,
    "app.js": `console.log("KORVIL OS Iniciado");`,
    "style.css": `body{background:#000;color:#00f0ff;font-family:Orbitron;}`
  },

  memorias_kai: []
};

// Função pra salvar memória do K-AI no localStorage
function salvarMemoriaKai(texto){
  KORVIL_DATABASE.memorias_kai.push({data: new Date(), texto});
  localStorage.setItem('korvil_kai_memorias', JSON.stringify(KORVIL_DATABASE.memorias_kai));
}
function carregarMemoriaKai(){
  let mem = localStorage.getItem('korvil_kai_memorias');
  if(mem) KORVIL_DATABASE.memorias_kai = JSON.parse(mem);
}

carregarMemoriaKai();
console.log("KORVIL DATABASE CARREGADO v8.2");
