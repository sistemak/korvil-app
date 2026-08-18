<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>K-AI KORVIL</title>
<style>
body{background:#000;color:#00FFFF;font-family:'Consolas',monospace;text-align:center;padding:40px}
#avatar{width:140px;border-radius:50%;border:3px solid #00FFFF;box-shadow:0 0 30px #00FFFF;animation:pulse 2s infinite}
@keyframes pulse{50%{box-shadow:0 0 50px #00FFFF}}
h1{text-shadow:0 0 10px #00FFFF}
#mic{padding:30px 60px;font-size:20px;background:#00FFFF;color:#000;border:0;border-radius:15px;font-weight:900;cursor:pointer;margin:30px}
#mic.gravando{background:#FF0044;color:#FFF;animation:pulse 0.5s infinite}
#log{text-align:left;background:#111;padding:15px;height:200px;overflow-y:scroll;border:1px solid #00FFFF;margin-top:20px}
</style>
</head>
<body>
<img id="avatar" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==">
<h1>K-AI KORVIL</h1>
<p>FALE SUA IDEIA. EU CRIO E BAIXO PRA VOCÊ</p>

<button id="mic">🎤 SEGURE E FALE</button>
<div id="log">> Aguardando comando...<br></div>

<script>
const REPO = "korvilp-sudo/korvil-app";
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'pt-BR';

const btnMic = document.getElementById('mic');
btnMic.onmousedown=()=>{recognition.start(); btnMic.classList.add('gravando'); btnMic.innerText='🔴 FALANDO...'};
btnMic.onmouseup=()=>{recognition.stop(); btnMic.classList.remove('gravando'); btnMic.innerText='🎤 SEGURE E FALE'};

recognition.onresult = e => {
  let ideia = e.results[0][0].transcript;
  log('VOCÊ: ' + ideia);
  forjar(ideia);
}

function log(t){
  document.getElementById('log').innerHTML += "> " + t + '<br>';
  document.getElementById('log').scrollTop = 99999
}

async function forjar(ideia) {
  // K-AI decide o nome e o tipo do arquivo sozinho
  const prompt = `Você é K-AI dev. O usuário disse: "${ideia}".
  TAREFA: Crie o código completo do jeito que você achar melhor.
  Decida o nome do arquivo e a extensão.
  REGRAS: 1. Retorne no formato NOME_DO_ARQUIVO.extensão|CODIGO_COMPLETO
    2. Só 1 arquivo por vez. 3. Sem explicação.`;

  log("K-AI PENSANDO E FORJANDO...");

  // Manda pro Backend
  await fetch(`https://api.github.com/repos/${REPO}/actions/workflows/kai-backend.yml/dispatches`, {
    method: 'POST',
    headers: {'Accept': 'application/vnd.github.v3+json'},
    body: JSON.stringify({ref: 'main', inputs: {comando: prompt, contexto: "MODO_FORJA_AUTO"}})
  });

  log("✅ ORDEM ENVIADA. AGUARDE 30S");
  log("Quando terminar vou baixar automaticamente pra você");

  // Na v2 vamos pegar a resposta e baixar. Por enquanto commita
}
</script>
</body></html>
