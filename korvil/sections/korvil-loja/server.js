const express = require('express');
const path = require('path');
const app = express();
app.use(express.json({limit:'10mb'}));
app.use(express.static(path.join(__dirname)));
app.get('/api/health',(req,res)=>res.json({ok:true, loja:'korvil'}));
const PORT = process.env.PORT||3000;
app.listen(PORT,()=>console.log('KORVIL server '+PORT));