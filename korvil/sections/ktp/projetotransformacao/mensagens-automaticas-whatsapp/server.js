import express from 'express';
import { verificarEvolucao } from './lib/github-checker.js';
import { enviarMensagens } from './lib/whatsapp-sender.js';

const app = express();
app.use(express.json());
app.use(express.static('.'));

app.get('/api/status', async (req,res)=>{
  const status = await verificarEvolucao();
  res.json({ ok:true, status, hora: new Date().toISOString() });
});

app.post('/api/disparar', async (req,res)=>{
  try{
    const result = await enviarMensagens();
    res.json({ ok:true, result });
  }catch(e){ res.status(500).json({ ok:false, error:e.message }) }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, ()=> console.log(`K-TP rodando na porta ${PORT}`));
