export default {
  nome: "Manipulação",
  comandos: {
    "ampliar": () => kai.falar("Ampliando 200%").e(document.body.style.zoom='1.2'),
    "reduzir": () => kai.falar("Reduzindo 80%").e(document.body.style.zoom='0.8'),
    "girar": () => kai.falar("Girando objeto").e(girar()),
    "vista superior": () => kai.falar("Vista superior ativada").e(vistaTopo()),
    "vista interna": () => kai.falar("Vista interna ativada").e(vistaInterna()),
    "destacar alvo": () => kai.falar("Alvo destacado").e(destacar()),
    "isolar componente": () => kai.falar("Isolando componente").e(isolar()),
    "remover elementos secundários": () => kai.falar("Limpando tela").e(limparSec())
  }
}
function girar(){ document.querySelector('.card').style.transform='rotate(5deg)' }
function vistaTopo(){ kai.falar("Função em desenvolvimento") }
function vistaInterna(){ kai.falar("Função em desenvolvimento") }
function destacar(){ document.querySelector('.card').style.boxShadow='0 0 80px #00FFFF' }
function isolar(){ document.querySelectorAll('.btn-kai').forEach(b => b.style.display='none') }
function limparSec(){ document.querySelector('.words-bg').innerHTML='' }
export async function executar(cmd){
    if(cmd.includes('edita')){
        const alvo = cmd.replace('edita','').trim();
        return falar(`Abrindo editor do ${alvo}. Me mande o novo código por voz`);
    }
    return falar('Qual arquivo devo editar?');
}
function falar(t){window.falar(t)}
