export default {
  nome: "Interface",
  comandos: {
    "projetar holograma": () => kai.falar("Projetando holograma 3D").e(document.getElementById('holograma').classList.remove('oculto')),
    "abrir painel": () => kai.falar("Abrindo painel principal").e(abrirPainel()),
    "expandir projeção": () => kai.falar("Expandindo projeção").e(document.body.classList.add('tela-cheia')),
    "ocultar interface": () => kai.falar("Ocultando interface").e(document.querySelector('.card').classList.add('oculto')),
    "tela limpa": () => kai.falar("Tela limpa").e(document.querySelectorAll('.oculto').forEach(el => el.classList.remove('oculto'))),
    "mostrar somente o essencial": () => kai.falar("Modo essencial ativado").e(modoEssencial())
  }
}
function abrirPainel(){ document.querySelector('.tabs').classList.remove('oculto') }
function modoEssencial(){ document.querySelectorAll('.btn-kai').forEach(b => b.style.display='none') }
