// ===== CALIBRAGEM RÁPIDA 3 ETAPAS + VOZ =====
const AudioContext = window.AudioContext || window.webkitAudioContext;let audioCtx = null;let vozLigada=true;
function initAudio(){if(!audioCtx)audioCtx=new AudioContext();}
function playSound(f,t='sine',d=0.1,v=0.1){if(!audioCtx)return;try{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=t;o.frequency.setValueAtTime(f,audioCtx.currentTime);g.gain.setValueAtTime(v,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+d);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+d);}catch(e){}}
const SFX={click:()=>playSound(800,'square',0.05,0.08),grab:()=>playSound(300,'sawtooth',0.12,0.08),trash:()=>playSound(150,'sawtooth',0.25,0.12),spawn:()=>{playSound(600,'sine',0.1,0.1);setTimeout(()=>playSound(900,'sine',0.1,0.08),50);},action:()=>playSound(1000,'sine',0.15,0.06),sucesso:()=>{playSound(1200,'sine',0.1,0.1);setTimeout(()=>playSound(1500,'sine',0.1,0.08),100)}};
const falas=window.speechSynthesis;function falar(texto){if(!vozLigada)return;falas.cancel();let msg=new SpeechSynthesisUtterance(texto);msg.lang='pt-BR';msg.rate=1.2;falas.speak(msg);}

// ESTADO
let cubos=[],segurado=null;
let cores=['#00f0ff','#ff00ea','#ffe600','#00ff66','#ff3366'];let corAtual=0;
let posSuave={x:-100,y:-100,cx:-100,cy:-100};

// NOVO ESTADO CALIBRAGEM
let etapaCalibragem=0; // 0=não calibrado, 1=aberto, 2=punho, 3=pinça, 4=pronto
let calibrado=false,calibValues={abrir:0.32,punho:0.12,pinca:0.06};
let tempoCalib=0;

// FUNÇÕES BASE
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
function isPinca(h){return dist(h[4],h[8])<calibValues.pinca;}
function isMaoFechada(h){return dist(h[8],h[5])<calibValues.punho&&dist(h[12],h[9])<calibValues.punho;}
function isMaoAberta(h){return dist(h[8],h[0])>calibValues.abrir&&dist(h[12],h[0])>calibValues.abrir;}
function identificarGesto(h){if(isPinca(h))return"PINÇA";if(isMaoFechada(h))return"PUNHO";if(isMaoAberta(h))return"ABERTO";if(h[8].y<h[6].y&&h[12].y<h[10].y)return"PAZ";if(h[8].y<h[6].y)return"APONTAR";if(h[4].y<h[3].y)return"LIKE";if(h[4].y>h[2].y)return"DISLIKE";if(h[8].y<h[6].y&&h[20].y<h[18].y)return"ROCK";return"NEUTRO";}

// CALIBRAGEM RÁPIDA 3 ETAPAS
function iniciarCalibragem(){
  etapaCalibragem=1;calibrado=false;
  document.getElementById('calibFill').style.width='0%';
  document.getElementById('st-text').textContent="CALIBRANDO 1/3";
  document.getElementById('tutorial-box').innerHTML="📍 <b>ETAPA 1/3:</b><br>Mostre a MÃO ABERTA e segure 2s";
  falar("Etapa 1 de 3. Mostre a mão aberta e segure");
}

function checarCalibragem(h){
  if(etapaCalibragem===0)return;

  tempoCalib+=0.1;
  document.getElementById('calibFill').style.width=(tempoCalib*50)+'%';

  // ETAPA 1: MÃO ABERTA
  if(etapaCalibragem===1 && isMaoAberta(h) && tempoCalib>2){
    calibValues.abrir=dist(h[8],h[0])*1.1;
    etapaCalibragem=2;tempoCalib=0;
    document.getElementById('st-text').textContent="CALIBRANDO 2/3";
    document.getElementById('tutorial-box').innerHTML="📍 <b>ETAPA 2/3:</b><br>Feche o PUNHO e segure 2s";
    falar("Ótimo. Etapa 2 de 3. Agora feche o punho");
    SFX.sucesso();
  }

  // ETAPA 2: PUNHO
  else if(etapaCalibragem===2 && isMaoFechada(h) && tempoCalib>2){
    calibValues.punho=dist(h[8],h[5])*1.2;
    etapaCalibragem=3;tempoCalib=0;
    document.getElementById('st-text').textContent="CALIBRANDO 3/3";
    document.getElementById('tutorial-box').innerHTML="📍 <b>ETAPA 3/3:</b><br>Faça PINÇA e segure 2s";
    falar("Perfeito. Etapa 3 de 3. Agora faça pinça");
    SFX.sucesso();
  }

  // ETAPA 3: PINÇA
  else if(etapaCalibragem===3 && isPinca(h) && tempoCalib>2){
    calibValues.pinca=dist(h[4],h[8])*0.9;
    etapaCalibragem=4;calibrado=true;tempoCalib=0;
    document.getElementById('calibFill').style.width='100%';
    document.getElementById('st-text').textContent="CALIBRADO";
    document.getElementById('tutorial-box').innerHTML="✅ <b>CALIBRAGEM CONCLUÍDA!</b><br>Você pode usar todos os gestos agora";
    falar("Calibragem concluída com sucesso. Sistema pronto para uso");
    SFX.sucesso();
  }

  // Reset se soltar antes dos 2s
  if(tempoCalib>0 && tempoCalib<2 &&
     ((etapaCalibragem===1&&!isMaoAberta(h)) ||
      (etapaCalibragem===2&&!isMaoFechada(h)) ||
      (etapaCalibragem===3&&!isPinca(h)))){
    tempoCalib=0;
  }
}

// CRIAR CUBO + MOUSE
function criarCubo(x,y){
  initAudio();
  const c=document.createElement('div');c.className='cubo';
  c.style.left=(x||window.innerWidth/2-45)+'px';c.style.top=(y||window.innerHeight/2-45)+'px';
  c.style.borderColor=cores[corAtual];c.style.background=cores[corAtual]+'22';

  let isDragging=false,offsetX=0,offsetY=0;
  c.addEventListener('pointerdown',e=>{initAudio();isDragging=true;offsetX=e.clientX-c.offsetLeft;offsetY=e.clientY-c.offsetTop;c.classList.add('segurado');SFX.grab();c.setPointerCapture(e.pointerId);});
  c.addEventListener('pointermove',e=>{if(!isDragging)return;c.style.left=`${e.clientX-offsetX}px`;c.style.top=`${e.clientY-offsetY}px`;const lix=document.getElementById('lixeira').getBoundingClientRect();document.getElementById('lixeira').classList.toggle('ativo',Math.hypot(e.clientX-(lix.left+lix.width/2),e.clientY-(lix.top+lix.height/2))<90);});
  c.addEventListener('pointerup',e=>{isDragging=false;c.classList.remove('segurado');const lix=document.getElementById('lixeira').getBoundingClientRect();if(Math.hypot(e.clientX-(lix.left+lix.width/2),e.clientY-(lix.top+lix.height/2))<90){SFX.trash();c.remove();cubos=cubos.filter(item=>item!==c);document.getElementById('st-obj').textContent=cubos.length;}document.getElementById('lixeira').classList.remove('ativo');});
  document.body.appendChild(c);cubos.push(c);document.getElementById('st-obj').textContent=cubos.length;SFX.spawn();
}

// 21 AÇÕES
function executarAcao(g1,g2){
  if(!calibrado)return;
  if(Date.now()<cooldownGesto)return;cooldownGesto=Date.now()+800;
  const combo=g2==="NEUTRO"?g1:g1+" "+g2;
  const acoes={"PINÇA":()=>criarCubo(posSuave.x,posSuave.y),"LIKE":()=>document.getElementById('cor').click(),"DISLIKE":()=>{if(cubos.length){cubos.pop().remove();document.getElementById('st-obj').textContent=cubos.length;}},"ABERTO ABERTO":()=>document.getElementById('limpar').click(),"PUNHO PUNHO":()=>cubos.forEach((c,i)=>{c.style.left=window.innerWidth/2-45+'px';c.style.top=window.innerHeight/2-45+i*20+'px'}),"LIKE LIKE":()=>cubos.forEach(c=>c.style.transform='scale(1.5)'),"DISLIKE DISLIKE":()=>cubos.forEach(c=>c.style.transform='scale(0.7)'),"PAZ PAZ":()=>criarCubo(),"APONTAR APONTAR":()=>document.getElementById('cursor').style.borderColor="#ff00ea"};
  if(acoes[combo]){document.getElementById('st-acao').textContent=combo;falar("Ação: "+combo);SFX.action();acoes[combo]();}
}

// MEDIAPIPE
const hands=new Hands({locateFile:f=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`});
hands.setOptions({maxNumHands:2,modelComplexity:1,minDetectionConfidence:0.6,minTrackingConfidence:0.6});

hands.onResults(res=>{
  const maos=res.multiHandLandmarks;
  if(maos&&maos.length>0){
    const h1=maos[0];
    let tx=(1-h1[8].x)*window.innerWidth,ty=h1[8].y*window.innerHeight;
    posSuave.x+=(tx-posSuave.x)*0.4;posSuave.y+=(ty-posSuave.y)*0.4;
    document.getElementById('pino1').style.left=posSuave.x+'px';document.getElementById('pino1').style.top=posSuave.y+'px';
    const gesto1=identificarGesto(h1);document.getElementById('st-gesto').textContent=gesto1;

    // CALIBRAGEM
    checarCalibragem(h1);

    // AÇÕES SÓ FUNCIONAM DEPOIS DE CALIBRADO
    if(calibrado){
      if(maos.length>1){const h2=maos[1];const gesto2=identificarGesto(h2);executarAcao(gesto1,gesto2);}else{executarAcao(gesto1,"NEUTRO");}
    }
  }
});

// BOTÕES
document.getElementById('novo').onclick=()=>criarCubo();
document.getElementById('limpar').onclick=()=>{cubos.forEach(c=>c.remove());cubos=[];document.getElementById('st-obj').textContent=0;};
document.getElementById('cor').onclick=()=>{corAtual=(corAtual+1)%cores.length;document.getElementById('cor').style.color=cores[corAtual];};
document.getElementById('voz').onclick=()=>{vozLigada=!vozLigada;document.getElementById('voz').innerText=vozLigada?'🔊 VOZ: LIGADA':'🔇 VOZ: DESLIGADA';};
document.getElementById('calibrar').onclick=()=>iniciarCalibragem();

const camera=new Camera(document.getElementById('video'),{onFrame:async()=>{await hands.send({image:document.getElementById('video')});},width:640,height:480});
camera.start();
criarCubo();
falar("Bem vindo ao Korvil. Clique em calibrar para começar");
