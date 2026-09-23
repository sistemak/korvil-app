// KORVIL FRONTEND - SÓ CRIA QUANDO CLICAR CRIAR CONTA
function gerarNomePasta(nomeCompleto) {
  const semAcento = nomeCompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const partes = semAcento.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '';
  if (partes.length === 1) return partes[0];
  const primeiro = partes[0];
  const iniciais = partes.slice(1).map(p => p[0]).join('_');
  return `${primeiro}_${iniciais}`;
}

function hashSHA256(str) {
  // Browser-safe sha256 usando SubtleCrypto
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  return crypto.subtle.digest('SHA-256', data).then(buf => {
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  });
}

async function criarContaReal() {
  const nomeEl = document.getElementById('nome');
  const emailEl = document.getElementById('email');
  const senhaEl = document.getElementById('senha');
  const confirmarEl = document.getElementById('confirmar');
  const btn = document.getElementById('btn-criar');
  const statusEl = document.getElementById('status-criar');

  const nome = nomeEl?.value?.trim() || '';
  const email = emailEl?.value?.trim() || '';
  const senha = senhaEl?.value || '';
  const confirmar = confirmarEl?.value || '';

  // VALIDAÇÃO SÓ QUANDO CLICAR
  if (nome.length < 3) {
    statusEl.textContent = 'Nome min 3 letras';
    statusEl.className = 'text-red-500';
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    statusEl.textContent = 'Email inválido';
    statusEl.className = 'text-red-500';
    return;
  }
  if (senha.length < 6) {
    statusEl.textContent = 'Senha min 6 chars';
    statusEl.className = 'text-red-500';
    return;
  }
  if (senha !== confirmar) {
    statusEl.textContent = 'Senhas não conferem';
    statusEl.className = 'text-red-500';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'CRIANDO...';
  statusEl.textContent = 'Gerando pasta e commitando...';
  statusEl.className = 'text-orange-400';

  try {
    const pastaMae = gerarNomePasta(nome);
    const filePath = `korvil/sections/korvil-loja/login/contas/${pastaMae}/${pastaMae}.json`;
    const senha_hash = await hashSHA256(senha);

    const payload = {
      id: crypto.randomUUID(),
      pasta: pastaMae,
      nome,
      email: email.toLowerCase(),
      senha_hash,
      criado_em: new Date().toISOString()
    };

    // Tenta via server Node se estiver rodando
    try {
      const res = await fetch('/criar-conta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });
      if (res.ok) {
        const data = await res.json();
        statusEl.textContent = `✓ Conta ${data.pasta} criada via NODE!`;
        statusEl.className = 'text-green-400';
        btn.textContent = 'CRIADO!';
        return;
      }
    } catch {}

    // Fallback direto GitHub API se admin configurou token
    const GH_TOKEN = localStorage.getItem('loja_github_token');
    if (!GH_TOKEN) {
      throw new Error('Configure GH_TOKEN em admin ou rode node server.js');
    }

    const toBase64 = (str) => btoa(unescape(encodeURIComponent(str)));
    const contentBase64 = toBase64(JSON.stringify(payload, null, 2));

    // GET para pegar sha se já existe
    let sha;
    try {
      const getRes = await fetch(`https://api.github.com/repos/sistemak/korvil-app/contents/${filePath}`, {
        headers: { Authorization: `token ${GH_TOKEN}` }
      });
      if (getRes.ok) {
        const j = await getRes.json();
        sha = j.sha;
      }
    } catch {}

    const putRes = await fetch(`https://api.github.com/repos/sistemak/korvil-app/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GH_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `KORVIL AUTO: nova conta ${pastaMae}`,
        content: contentBase64,
        branch: 'main',
        ...(sha ? { sha } : {})
      })
    });

    if (!putRes.ok) {
      const err = await putRes.text();
      throw new Error(err);
    }

    const result = await putRes.json();
    statusEl.innerHTML = `✓ Commit criado: <a href="${result.commit.html_url}" target="_blank" class="underline">${pastaMae}</a>`;
    statusEl.className = 'text-green-400';
    btn.textContent = 'CONTA CRIADA!';

    // toast com link commit
    console.log('KORVIL:', result.commit.html_url);

  } catch (e) {
    statusEl.textContent = 'Erro: ' + e.message;
    statusEl.className = 'text-red-500';
    btn.disabled = false;
    btn.textContent = 'CRIAR CONTA';
  }
}

// Export para uso no HTML
window.criarContaReal = criarContaReal;
window.gerarNomePasta = gerarNomePasta;
