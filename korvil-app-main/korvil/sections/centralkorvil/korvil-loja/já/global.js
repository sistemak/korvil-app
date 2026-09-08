function irPara(pasta){ window.location.href = `../${pasta}/index.html`; }
function irHome(){ window.location.href = `../index.html`; }
let carrinho = JSON.parse(localStorage.getItem('carrinhoKORVIL')) || [];
function atualizarQtd(){ document.querySelectorAll('.qtd').forEach(el=>el.innerText=carrinho.length); }
