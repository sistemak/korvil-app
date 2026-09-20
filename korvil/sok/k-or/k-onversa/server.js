const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(__dirname));
app.use('/public', express.static(path.join(__dirname,'public')));
app.get('/', (req,res)=> res.sendFile(path.join(__dirname,'index.html')));
app.get('/health', (req,res)=> res.json({ ok:true, path:'korvil/sok/k-or/k-onversa/', turq:'#00E6CC' }));
app.post('/api/commit', async (req,res)=>{
  const { token } = req.body;
  if(!token) return res.status(400).json({ error:'Token required' });
  res.json({ message:'Use frontend commit flow with base_tree merge - nunca apaga nada', basePath:'korvil/sok/k-or/k-onversa/' });
});
app.listen(PORT, ()=> console.log('K-ONVERSA em http://localhost:'+PORT+' | base: korvil/sok/k-or/k-onversa/'));
