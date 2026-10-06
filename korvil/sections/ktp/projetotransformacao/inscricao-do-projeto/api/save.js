// korvil/sections/ktp/projetotransformacao/inscricao-do-projeto/api/save.js - compatibilidade - redireciona para /api/ktp-inscricao-3-acoes
export default async function handler(req,res){
  // Redireciona para API nova que usa GH_TOKEN escondido
  const r = await fetch((process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') + '/api/ktp-inscricao-3-acoes', {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(req.body)
  });
  const data = await r.text();
  res.status(r.status).send(data);
}
