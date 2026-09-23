const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3001);
const githubToken = process.env.GH_TOKEN;
const owner = process.env.REPO_OWNER || 'sistemak';
const repo = process.env.REPO_NAME || 'korvil-app';
const branch = process.env.REPO_BRANCH || 'main';
const basePath = process.env.WRITE_BASE_PATH || 'korvil/sections/ktp/projetotransformacao/projetos/2026/alunos';
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://sistemak.github.io,http://localhost:3000,http://localhost:8000')
  .split(',').map(value => value.trim()).filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS not allowed'));
  }
}));
app.use(express.json({ limit: '100kb' }));

function alunoTipo(id) {
  return /^(tchuco|dani)/i.test(String(id)) ? 'online' : 'presencial';
}

function validarId(id) {
  return /^[a-z0-9_-]{1,64}$/i.test(String(id || ''));
}

function pesoValido(peso) {
  const numero = Number(String(peso).replace(',', '.'));
  return Number.isFinite(numero) && numero >= 1 && numero <= 500;
}

function caminhoDoAluno(id) {
  return `${basePath}/${alunoTipo(id)}/${id}/registros/pesos.html`;
}

function githubHeaders() {
  return {
    Authorization: `Bearer ${githubToken}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'korvil-ktp-peso-api'
  };
}

async function obterSha(caminho) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${caminho}?ref=${encodeURIComponent(branch)}`, { headers: githubHeaders() });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Não foi possível consultar o arquivo (${response.status})`);
  return (await response.json()).sha;
}

async function salvarNoGithub(caminho, conteudo, id, peso) {
  if (!githubToken) throw new Error('GH_TOKEN não configurado no servidor');
  const sha = await obterSha(caminho);
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${caminho}`, {
    method: 'PUT',
    headers: { ...githubHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `feat(ktp): registra peso de ${id} (${peso}kg)`,
      content: Buffer.from(conteudo, 'utf8').toString('base64'),
      ...(sha ? { sha } : {}),
      branch
    })
  });
  if (!response.ok) throw new Error(`GitHub recusou o registro (${response.status})`);
  return response.json();
}

app.get('/api/ping', (req, res) => {
  res.json({ ok: true, service: 'korvil-ktp-peso-api', githubConfigured: Boolean(githubToken) });
});

app.post('/api/peso', async (req, res) => {
  try {
    const { id, pesoDigitado, dataRegistro, semanaStr } = req.body || {};
    if (!validarId(id)) return res.status(400).json({ ok: false, message: 'ID inválido.' });
    if (!pesoValido(pesoDigitado)) return res.status(400).json({ ok: false, message: 'Peso inválido.' });

    const peso = String(pesoDigitado).replace(',', '.');
    const registro = dataRegistro || new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const semana = semanaStr || new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const caminho = caminhoDoAluno(id);
    const html = `<!DOCTYPE html>\n<html lang="pt-BR"><head><meta charset="UTF-8"><title>${id} - pesos</title></head><body><h1>K-TP 11º ANO 2026 - ${id}</h1><p>Semana: ${semana}</p><p>Peso: ${peso}kg</p><p>Registro: ${registro}</p></body></html>`;

    await salvarNoGithub(caminho, html, id, peso);
    return res.json({ ok: true, path: caminho, message: 'Peso registrado com sucesso.' });
  } catch (error) {
    console.error('[KTP peso]', error);
    return res.status(500).json({ ok: false, message: 'Não foi possível registrar o peso.' });
  }
});

app.use((error, req, res, next) => {
  if (error && error.message === 'CORS not allowed') return res.status(403).json({ ok: false, message: 'Origem não autorizada.' });
  return next(error);
});

app.listen(port, () => console.log(`KTP peso API disponível na porta ${port}`));
