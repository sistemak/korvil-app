import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3000;
const REPO = 'sistemak/korvil-app';
const BASE_PATH = 'korvil/sok/k-or/k-onversa';

app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname)));

app.get('/api/github/status', (req, res) => {
  const hasToken = !!process.env.GH_TOKEN;
  res.json({ hasToken, repo: REPO, basePath: BASE_PATH, tokenPreview: hasToken ? process.env.GH_TOKEN.slice(0,6)+'***' : null });
});

app.post('/api/github/commit', async (req, res) => {
  try {
    const token = process.env.GH_TOKEN || req.headers['x-gh-token'];
    if(!token) return res.status(401).json({ error: 'GH_TOKEN ausente. Defina no .env ou envie no header x-gh-token' });
    const { files, message } = req.body;
    if(!files || !Array.isArray(files)) return res.status(400).json({ error: 'files array required' });

    const gh = (url, opts={}) => fetch(`https://api.github.com${url}`, {
      ...opts,
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'Content-Type':'application/json', ...(opts.headers||{}) }
    });

    const refRes = await gh(`/repos/${REPO}/git/ref/heads/main`);
    if(!refRes.ok) throw new Error('Falha ao pegar ref main: '+(await refRes.text()));
    const refData = await refRes.json();
    const latestCommitSha = refData.object.sha;

    const commitRes = await gh(`/repos/${REPO}/git/commits/${latestCommitSha}`);
    const commitData = await commitRes.json();
    const baseTreeSha = commitData.tree.sha;

    const treeEntries = [];
    for(const f of files){
      const contentB64 = Buffer.from(f.content, 'utf8').toString('base64');
      const blobRes = await gh(`/repos/${REPO}/git/blobs`, { method:'POST', body: JSON.stringify({ content: contentB64, encoding:'base64' }) });
      if(!blobRes.ok) throw new Error('blob fail '+f.path+': '+await blobRes.text());
      const blob = await blobRes.json();
      treeEntries.push({ path: `${BASE_PATH}/${f.path}`, mode:'100644', type:'blob', sha: blob.sha });
    }

    const newTreeRes = await gh(`/repos/${REPO}/git/trees`, { method:'POST', body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries }) });
    if(!newTreeRes.ok) throw new Error('tree fail: '+await newTreeRes.text());
    const newTree = await newTreeRes.json();

    const newCommitRes = await gh(`/repos/${REPO}/git/commits`, { method:'POST', body: JSON.stringify({ message: message || 'feat: atualiza k-onversa completo k-or - código mestre', tree: newTree.sha, parents:[latestCommitSha] }) });
    if(!newCommitRes.ok) throw new Error('commit fail: '+await newCommitRes.text());
    const newCommit = await newCommitRes.json();

    const patchRes = await gh(`/repos/${REPO}/git/refs/heads/main`, { method:'PATCH', body: JSON.stringify({ sha: newCommit.sha }) });
    if(!patchRes.ok) throw new Error('patch ref fail: '+await patchRes.text());

    res.json({ ok:true, commitSha: newCommit.sha, commitUrl: `https://github.com/${REPO}/commit/${newCommit.sha}`, treeSha: newTree.sha });
  } catch(e){
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

io.on('connection', s=>{ s.emit('k-onversa:ready', { cyan:'#00E6CC', path: BASE_PATH }); });

app.get('*', (req,res)=> res.sendFile(path.join(__dirname,'index.html')));

server.listen(PORT, ()=> console.log(`K-Onversa rodando :${PORT} | ${BASE_PATH} | cyan #00E6CC`));
