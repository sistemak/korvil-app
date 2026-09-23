import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Octokit } from '@octokit/rest';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const GH_TOKEN = process.env.GH_TOKEN;
const REPO_OWNER = 'sistemak';
const REPO_NAME = 'korvil-app';
const BRANCH = 'main';

function gerarNomePasta(nomeCompleto) {
  // Remove acento
  const semAcento = nomeCompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const partes = semAcento.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return '';
  if (partes.length === 1) return partes[0];
  const primeiro = partes[0];
  const iniciais = partes.slice(1).map(p => p[0]).join('_');
  return `${primeiro}_${iniciais}`;
  // Ex: João Silva Santos -> joao_s_s
  // Ana Maria Oliveira Costa -> ana_m_o_c
}

app.post('/criar-conta', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Todos campos obrigatórios' });
    }
    if (nome.trim().length < 3) {
      return res.status(400).json({ erro: 'Nome min 3 chars' });
    }

    const pastaMae = gerarNomePasta(nome);
    const filePath = `korvil/sections/korvil-loja/login/contas/${pastaMae}/${pastaMae}.json`;

    const hash = crypto.createHash('sha256').update(senha).digest('hex');
    const conteudo = {
      id: crypto.randomUUID(),
      pasta: pastaMae,
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha_hash: hash,
      criado_em: new Date().toISOString()
    };

    const conteudoBase64 = Buffer.from(JSON.stringify(conteudo, null, 2)).toString('base64');

    if (!GH_TOKEN) {
      return res.status(500).json({ erro: 'GH_TOKEN não configurado no .env' });
    }

    const octokit = new Octokit({ auth: GH_TOKEN });

    let sha;
    try {
      const { data } = await octokit.repos.getContent({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        path: filePath,
        ref: BRANCH
      });
      // @ts-ignore
      if (!Array.isArray(data)) sha = data.sha;
    } catch (e) {
      // 404 = não existe, vai criar
    }

    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: filePath,
      message: `KORVIL AUTO: nova conta ${pastaMae}`,
      content: conteudoBase64,
      branch: BRANCH,
      ...(sha ? { sha } : {})
    });

    return res.json({ ok: true, pasta: pastaMae, path: filePath });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro interno', detalhe: String(err) });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`KORVIL NODE RODANDO ${PORT} - SEM VERCEL PORRA`);
});
