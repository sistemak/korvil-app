# crie_login_jwt_em_node_js_re - JavaScript

**Prompt:** crie login JWT em Node.js + React admin

**Nível:** 6
**Intent:** auth
**Linguagem:** javascript (JavaScript)

**Como rodar:**
```bash
# javascript
npm install\nnode main.js
```

**Código:**
```javascript
// K-AI GERADO - Nível 6
// Prompt: crie login JWT em Node.js + React admin
// Linguagem: JavaScript (javascript)
// Intent: auth
// Timestamp: 2026-09-19T19:33:44.528Z
// Dicionário: 24 linguagens
// Template REAL funcional - pronto pra rodar

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'kai-secret-' + Date.now();
const users = [{id:1,email:'kai@korvil.ai', password: bcrypt.hashSync('kai123',8)}];

function auth(req,res,next){
  const h = req.headers.authorization;
  if(!h) return res.status(401).json({error:'No token'});
  const token = h.split(' ')[1];
  try{ req.user = jwt.verify(token, SECRET); next(); }
  catch(e){ return res.status(401).json({error:'Invalid token'}); }
}

app.post('/api/login', (req,res)=>{
  const {email,password} = req.body;
  const user = users.find(u=>u.email===email);
  if(!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({error:'Invalid credentials'});
  const token = jwt.sign({id:user.id,email:user.email}, SECRET, {expi
```
