
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

let sock = null;
let sched = JSON.parse(fs.existsSync('./sched.json') ? fs.readFileSync('./sched.json','utf8') : '[]');

async function connect(){
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  sock = makeWASocket({ auth: state, printQRInTerminal: true });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', (u)=>{
    if(u.connection==='close' && u.lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) connect();
  });
}
connect();

// Programar envio real
setInterval(async ()=>{
  if(!sock) return;
  const now = Date.now();
  for(const s of sched){
    if(s.next && now >= s.next){
      for(const num of s.contacts){
        await sock.sendMessage(num.replace(/[^0-9]/g,'')+'@s.whatsapp.net', { text: s.msg });
      }
      if(s.repeat==='once') s.next = null;
      if(s.repeat==='daily') s.next = now + 86400000;
      if(s.repeat==='interval') s.next = now + (s.interval||5)*60000;
      fs.writeFileSync('./sched.json', JSON.stringify(sched));
    }
  }
}, 10000);

app.post('/schedule', (req,res)=>{
  const { msg, contacts, date, time, repeat, interval } = req.body;
  let next = Date.now();
  if(date && time) next = new Date(date+'T'+time).getTime();
  sched.push({ msg, contacts, repeat, interval, next });
  fs.writeFileSync('./sched.json', JSON.stringify(sched));
  res.json({ok:true});
});

app.get('/status', (req,res)=> res.json({connected: !!sock, sched}));
app.listen(3000, ()=> console.log('K-ONVERSA Node 10/10 rodando porta 3000'));
