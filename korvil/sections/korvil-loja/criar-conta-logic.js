// criar-conta-logic.js - KORVIL LOJA ATUALIZADO
// Validação completa + criação só quando preencher tudo + commit automático

function validarDadosCompleto(){
  const nome = document.getElementById('nome')?.value?.trim() || '';
  const email = document.getElementById('email')?.value?.trim() || '';
  const senha = document.getElementById('senha')?.value || '';
  const confirmar = document.getElementById('confirmarSenha')?.value || document.getElementById('confirmar')?.value || '';

  if(!nome || !email || !senha || !confirmar){
    mostrarErro('Preencha todos os dados: nome, email, senha e confirmar senha');
    return false;
  }
  if(nome.length < 3){
    mostrarErro('Nome deve ter pelo menos 3 caracteres');
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(email)){
    mostrarErro('Email inválido');
    return false;
  }
  if(senha.length < 6){
    mostrarErro('Senha deve ter pelo menos 6 caracteres');
    return false;
  }
  if(senha !== confirmar){
    mostrarErro('Confirmar senha não confere');
    return false;
  }
  limparErro();
  return true;
}

function mostrarErro(msg){
  const el = document.getElementById('erro-criacao');
  if(el){ el.textContent = msg; el.style.display='block'; }
  else alert(msg);
}
function limparErro(){
  const el = document.getElementById('erro-criacao');
  if(el) el.style.display='none';
}

function gerarNomePasta(nomeCompleto){
  const semAcento = nomeCompleto.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const partes = semAcento.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if(partes.length===0) return '';
  if(partes.length===1) return partes[0].replace(/[^a-z0-9]/g,'');
  const primeiro = partes[0];
  const iniciais = partes.slice(1).map(p=>p[0]).join('');
  return `${primeiro}_${iniciais}`.replace(/[^a-z0-9_]/g,'').slice(0,40);
}

async function criarContaReal(){
  // SÓ executa se validarDadosCompleto() true
  if(!validarDadosCompleto()){
    return { ok:false, erro:'preencha todos dados' };
  }

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  const pastaMae = gerarNomePasta(nome);
  const path = `korvil/sections/korvil-loja/login/contas/${pastaMae}/${pastaMae}.json`;
  const token = localStorage.getItem('loja_github_token');

  if(!token){
    mostrarErro('Token GitHub não configurado - admin precisa configurar em loja_github_token');
    return { ok:false };
  }

  // Verifica se já existe - não duplica
  try{
    const check = await fetch(`https://api.github.com/repos/sistemak/korvil-app/contents/${path}`,{
      headers:{ Authorization: `Bearer ${token}` }
    });
    if(check.ok){
      mostrarErro('Conta já existe: ' + pastaMae);
      return { ok:false, erro:'já existe' };
    }
  }catch(_){}

  const conta = {
    id: (crypto.randomUUID ? crypto.randomUUID() : ''+Date.now()),
    pasta: pastaMae,
    nome,
    email: email.toLowerCase(),
    senha_hash: await hashSHA256(senha),
    criado_em: new Date().toISOString()
  };

  // Commit automático - cria pasta mãe/.json
  const res = await fetch(`https://api.github.com/repos/sistemak/korvil-app/contents/${path}`,{
    method:'PUT',
    headers:{ Authorization: `Bearer ${token}`, 'Content-Type':'application/json', Accept:'application/vnd.github.v3+json' },
    body: JSON.stringify({
      message: `KORVIL: cria conta ${pastaMae}`,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(conta,null,2)))),
      branch: 'main'
    })
  });

  if(!res.ok){
    const txt = await res.text();
    mostrarErro('Erro ao criar conta no GitHub: '+txt);
    return { ok:false, erro: txt };
  }

  return { ok:true, pastaMae, conta };
}

async function hashSHA256(str){
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
