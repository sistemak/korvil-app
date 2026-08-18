// server.js - CEREBRO DO CORVO K-AI
const express = require('express');
const { Octokit } = require("octokit");
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.static('.')); // Serve seu index.html

const PORT = 3000;

// 1. COLE SEU TOKEN AQUI 1 VEZ SÓ. FICA SEGURO NO SERVIDOR
const TOKEN = 'ghp_COLE_SEU_TOKEN_AQUI'; 
const octokit = new Octokit({ auth: TOKEN });

// 2. FUNÇÃO QUE LÊ TUDO E ANALISA
app.get('/api/analisar-korvil', async (req, res) => {
  try {
    const relatorio = { repos: [], erros: [], faltando: [] };
    
    // PEGA TODOS OS REPOS
    const { data: repos } = await octokit.request('GET /users/korvilp-sudo/repos?per_page=100');
    relatorio.totalRepos = repos.length;

    for (const repo of repos) {
      const repoData = { nome: repo.name, arquivos: [], analise: '' };
      
      // PEGA TODOS OS ARQUIVOS
      const { data: tree } = await octokit.request(`GET /repos/korvilp-sudo/${repo.name}/git/trees/main?recursive=1`);
      repoData.arquivos = tree.tree.map(f => f.path);
      
      // ANÁLISE REAL: O QUE FALTA PRA FUNCIONAR?
      if (!repoData.arquivos.includes('index.html')) relatorio.faltando.push(`${repo.name}: Falta index.html na raiz`);
      if (!repoData.arquivos.includes('README.md')) relatorio.faltando.push(`${repo.name}: Falta README.md`);
      if (repoData.arquivos.filter(f=>f.endsWith('.html')).length > 1) relatorio.faltando.push(`${repo.name}: Tem pastas duplicadas. Ex: korvil-app/korvil-app/`);
      
      // LÊ O index.html E VÊ SE TEM ERRO DE LINK
      const indexFile = repoData.arquivos.find(f=>f==='index.html');
      if(indexFile){
        const { data: file } = await octokit.request(`GET /repos/korvilp-sudo/${repo.name}/contents/${indexFile}`);
        const content = Buffer.from(file.content, 'base64').toString();
        if(!content.includes('<script>')) relatorio.faltando.push(`${repo.name}: index.html sem <script>`);
      }

      relatorio.repos.push(repoData);
    }
    
    res.json(relatorio);

  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.listen(PORT, () => console.log(`CORVO K-AI RODANDO EM http://localhost:${PORT}`));
