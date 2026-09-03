import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Carrega as variáveis de ambiente (.env)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.')); // Serve os arquivos estáticos (HTML, JS, CSS)

// Configuração da API do Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Configurações da API do GitHub (KAI-KBD)
const KAI_TOKEN = process.env.KAI_TOKEN;
const OWNER = "korvilp-sudo";
const REPO = "kai-core";

const GITHUB_API = `https://api.github.com/repos/${OWNER}/${REPO}`;
const HEADERS = {
  'Authorization': `Bearer ${KAI_TOKEN}`,
  'User-Agent': 'KAI-KBD',
  'Accept': 'application/vnd.github.v3+json'
};

// ==========================================
// ROTAS DO K-AI CORE (INTELIGÊNCIA ARTIFICIAL)
// ==========================================

app.post('/api/kai/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "A mensagem é obrigatória." });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: (
          "Você é o K-AI, a Inteligência Artificial central do ecossistema KORVIL. " +
          "Sua função é auxiliar no gerenciamento, automação e desenvolvimento da plataforma. " +
          "Seja direto, técnico e responda sempre em português do Brasil."
        )
      }
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("[K-AI ERROR]", error);
    res.status(500).json({ error: "Falha interna ao processar requisição no K-AI Core." });
  }
});

// ==========================================
// ROTAS DO KAI-KBD (INTEGRAÇÃO GITHUB API)
// ==========================================

// 1. BUSCAR ESTRUTURA DE PASTAS/ARQUIVOS
app.get('/api/estrutura', async (req, res) => {
  try {
    const resposta = await fetch(`${GITHUB_API}/git/trees/main?recursive=1`, { headers: HEADERS });
    const dados = await resposta.json();
    res.json(dados.tree);
  } catch(e) { 
    res.status(500).json({ erro: e.message });
  }
});

// 2. LER CONTEÚDO DE UM ARQUIVO
app.get('/api/ler/:caminho(*)', async (req, res) => {
  try {
    const caminho = req.params.caminho;
    const resposta = await fetch(`${GITHUB_API}/contents/${caminho}`, { headers: HEADERS });
    const dados = await resposta.json();
    const conteudo = Buffer.from(dados.content, 'base64').toString('utf8');
    res.json({ conteudo, sha: dados.sha });
  } catch(e) { 
    res.status(500).json({ erro: e.message });
  }
});

// 3. CRIAR/ATUALIZAR ARQUIVO
app.put('/api/salvar/:caminho(*)', async (req, res) => {
  try {
    const caminho = req.params.caminho;
    const { conteudo, sha, mensagem } = req.body;
    const body = {
      message: mensagem || `KAI-KBD: Atualizando ${caminho}`,
      content: Buffer.from(conteudo).toString('base64'),
      sha: sha
    };
    const resposta = await fetch(`${GITHUB_API}/contents/${caminho}`, {
      method: 'PUT', headers: HEADERS, body: JSON.stringify(body)
    });
    res.json(await resposta.json());
  } catch(e) { 
    res.status(500).json({ erro: e.message });
  }
});

// 4. DELETAR ARQUIVO
app.delete('/api/deletar/:caminho(*)', async (req, res) => {
  try {
    const caminho = req.params.caminho;
    const { sha, mensagem } = req.body;
    const body = {
      message: mensagem || `KAI-KBD: Deletando ${caminho}`,
      sha: sha
    };
    const resposta = await fetch(`${GITHUB_API}/contents/${caminho}`, {
      method: 'DELETE', headers: HEADERS, body: JSON.stringify(body)
    });
    res.json(await resposta.json());
  } catch(e) { 
    res.status(500).json({ erro: e.message });
  }
});

// Status do Servidor
app.get('/api/status', (req, res) => {
  res.json({
    system: "K-AI Core / KORVIL Backend",
    status: "online",
    timestamp: new Date().toISOString()
  });
});

// Inicialização do Servidor
app.listen(PORT, () => {
  console.log(`\n==========================================`);
  console.log(`🚀 K-AI Core + KAI-KBD rodando em http://localhost:${PORT}`);
  console.log(`==========================================\n`);
});
