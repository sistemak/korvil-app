// ============= K-B.D FORJA v8.4 - MOTOR COMPLETO =============
const dadosForja={acoes:["Criar","Editar","Atualizar","Mover","Excluir"],tipos:["Setor","Área","Serviço","Arquivo"],setores:["Sistema K","K-TP","K-AFORTUNADO","K-ALMA","CENTRAL K","K-OS"],areas:["Tecnologias","Treinamento Personalizado","Saúde","Finanças","Academia","Barbearia"],servicos:["Projeto TRANSFORMAÇÃO","Consultoria","Mentoria","Barbeiro","Massoterapia","Nutrição"],categorias:["Curso","Produto","Documento","Sistema"],arquivos:["index.html","app.js","style.css","core.js","db.js","kai.js"],pasta:["Assets","Components","Pages","Core"]};
const KORVIL_REPO={"index.html":"<!DOCTYPE html>\n<html>\n<head>\n <title>KORVIL OS v8.4</title>\n <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n <h1>KORVIL FORJA</h1>\n <script src=\"app.js\"><\/script>\n</body>\n</html>","app.js":"console.log('KORVIL OS Iniciado v8.4');","style.css":"body{background:#000;color:#00f0ff;font-family:Orbitron;}"};
let SANDBOX={...KORVIL_REPO};let ARQUIVO_SELECIONADO="index.html";let PENDENTE_COMMIT=false;let cgmAtivo=false;let hands,camera;

const editor=document.getElementById("editor");
function carregarSelect(id,array){const select=document.getElementById(id);if(!select)return;select.innerHTML='';array.forEach(item=>{const option=document.createElement("option");option.textContent=item;select.appendChild(option);});}
Object.keys(dadosForja).forEach(k=>carregarSelect(k,dadosForja[k]));
carregarSelect('arquivo', Object.keys(SANDBOX));

document.getElementById('arquivo').onchange=e=>{ARQUIVO_SELECIONADO=e.target.value;editor.value=SANDBOX[ARQUIVO_SELECIONADO]||"";K_AI.observar("mudou_arquivo",ARQUIVO_SELECIONADO);atualizarPreview();}
editor.addEventListener('input',()=>{SANDBOX[ARQUIVO_SELECIONADO]=editor.value;PENDENTE_COMMIT=true;K_AI.observar("digitou",editor.value.substring(0,30));atualizarPreview();});

document.getElementById('confirmarBtn').onclick=()=>{KORVIL_REPO[ARQUIVO_SELECIONADO]=SANDBOX[ARQUIVO_SELECIONADO];PENDENTE_COMMIT=false;HISTORICO.adicionar("Salvar",ARQUIVO_SELECIONADO);falarKai(`Confirmado! ${ARQUIVO_SELECIONADO} salvo no REPO REAL.`);alert("SALVO!");}
document.getElementById('executarBtn').onclick=()=>{falarKai("Executando ações selecionadas...");HISTORICO.adicionar("Executar",ARQUIVO_SELECIONADO);}

document.querySelectorAll('.aba').forEach(aba=>{aba.onclick=()=>{document.querySelectorAll('.aba').forEach(a=>a.classList.remove('ativa'));aba.classList.add('ativa');const tipo=aba.dataset.aba;document.getElementById('forja-app').style.display=tipo==='editor'?'flex':'none';document.getElementById('repo-explorer').style.display=tipo==='repo'?'block':'none';document.getElementById('kai-painel').style.display=tipo==='kai'?'block':'none';document.getElementById('historico').style.display=tipo==='historico'?'block':'none';}});

let recognition;if('webkitSpeechRecognition'in window){recognition=new webkitSpeechRecognition();recognition.lang='pt-BR';recognition.continuous=true;recognition.onresult=e=>{let texto=e.results[e.results.length-1][0].transcript;document.getElementById('comandoUnificado').value=texto;processarComandoUnificado(texto);}}
document.getElementById('btnVoz').onclick=()=>{document.getElementById('btnVoz').classList.toggle('gravando');recognition?recognition.start():alert("Navegador não suporta voz");}
document.getElementById('btnExecutarComando').onclick=()=>processarComandoUnificado(document.getElementById('comandoUnificado').value);

function processarComandoUnificado(texto){texto=texto.toLowerCase();falarKai(`Processando: ${texto}`);if(texto.includes('criar'))K_AI.construirEstrutura(texto);if(texto.includes('clonar'))clonarProjeto();}

function clonarProjeto(){let novoNome=prompt("Nome do clone:","clone_"+Date.now());if(novoNome){SANDBOX[novoNome+".html"]=SANDBOX["index.html"];carregarSelect('arquivo',Object.keys(SANDBOX));falarKai(`Projeto clonado como ${novoNome}.html`);}}

function carregarPecasRapidas(){const zona=document.getElementById('pecas-rapidas');zona.innerHTML='';[...dadosForja.setores,...dadosForja.areas,...dadosForja.servicos].slice(0,15).forEach(nome=>{const peca=document.createElement('div');peca.className='peca';peca.draggable=true;peca.textContent=nome;peca.ondragstart=e=>e.dataTransfer.setData('text',nome);zona.appendChild(peca);});}
carregarPecasRapidas();
document.querySelectorAll('.slot').forEach(slot=>{slot.ondragover=e=>e.preventDefault();slot.ondrop=e=>{e.preventDefault();const valor=e.dataTransfer.getData('text');slot.textContent=`${slot.dataset.tipo}: ${valor}`;slot.classList.add('preenchido');}});

// CGM
let mouseVirtual=document.createElement('div');mouseVirtual.id='mouse-virtual';document.body.appendChild(mouseVirtual);
function iniciarCGM(){cgmAtivo=true;document.getElementById('canvasCGM').style.display='block';hands=new Hands({locateFile:file=>`https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`});hands.setOptions({maxNumHands:1});hands.onResults(results=>{if(results.multiHandLandmarks){let x=results.multiHandLandmarks[0][8].x*window.innerWidth;let y=results.multiHandLandmarks[0][8].y*window.innerHeight;mouseVirtual.style.left=x-10+'px';mouseVirtual.style.top=y-10+'px';}});camera=new Camera(document.getElementById('videoCGM'),{onFrame:async()=>await hands.send({image:document.getElementById('videoCGM')}),width:640,height:480});camera.start();falarKai("CGM ATIVADO");}
document.getElementById('ativarCGMBTN').onclick=()=>cgmAtivo?camera.stop():iniciarCGM();

// K-AI DOUTORADO
const K_AI={ativo:false,observar(a,d){if(this.ativo)falarKai(`[OBS] ${a}: ${d}`)},iniciar(){this.ativo=true;falarKai("K-AI DOUTORADO ONLINE. QI 300. Monitorando tudo.");document.getElementById('status-kai').textContent='K-AI ATIVO';},construirEstrutura(c){falarKai(`Construindo: ${c}`);},analisarCodigo(){falarKai(`Analisei ${ARQUIVO_SELECIONADO}. Código otimizado.`);}};
function falarKai(t){document.getElementById('respostaKai').innerHTML=`K-AI: ${t}`;document.getElementById('kai-memorias').innerHTML+=`<p>> ${t}</p>`;}
document.getElementById('cubo-kai').onclick=()=>document.getElementById('menu-kai').classList.toggle('ativo');
document.getElementById('ativarKaiBtn').onclick=()=>K_AI.iniciar();
document.getElementById('perguntarKaiBtn').onclick=()=>falarKai(K_AI.analisarCodigo());
document.getElementById('sugerirMelhoriaBtn').onclick=()=>falarKai("Sugestão Doutor: Use Padrão MVC e separe em módulos.");

// AUTO START
window.onload=()=>{atualizarPreview();K_AI.iniciar();document.getElementById('menu-kai').classList.add('ativo');if(recognition)recognition.start();setTimeout(iniciarCGM,2000);}
function atualizarPreview(){const codigo=SANDBOX[ARQUIVO_SELECIONADO];let tipo=ARQUIVO_SELECIONADO.split('.').pop();document.getElementById('preview-container').innerHTML=`<iframe srcdoc='${codigo}' style='width:100%;height:100%;border:none'></iframe>`;}

// BLOQUEAR MENU CELULAR
document.addEventListener('contextmenu',e=>e.preventDefault());
