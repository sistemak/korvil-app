// korvil/sections/ktp/projetotransformacao/menu-lateral.js
function toggleMenu(){
  var el = document.getElementById('MENU');
  if(!el) return;
  el.classList.toggle('open');
  if(el.classList.contains('open')){
    el.style.display='block';
  } else {
    el.style.display='none';
  }
  console.log('MENU toggled', el.className);
}
window.toggleMenu = toggleMenu;
document.addEventListener('DOMContentLoaded', function(){
  var btn = document.getElementById('btnMenu');
  if(btn) btn.addEventListener('click', toggleMenu);
});
