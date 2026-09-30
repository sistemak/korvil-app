import fs from 'fs';

const mensagens = JSON.parse(fs.readFileSync('./config/mensagens.json','utf8'));
const participantes = JSON.parse(fs.readFileSync('./config/participantes.json','utf8'));

function escolherMensagem(evolucao) {
  const pool = evolucao === 'ATIVA' ? mensagens.ativas : mensagens.incentivo;
  return pool[Math.floor(Math.random()*pool.length)];
}

export async function enviarMensagens(evolucao='ATIVA'){
  const msg = escolherMensagem(evolucao);
  console.log(`[K-TP 05h] Disparando para ${participantes.length} participantes`);
  
  for(const p of participantes){
    const texto = msg.replace('{nome}', p.nome).replace('{dia}', '11 anos de transformação');
    // Integração real: aqui entra Baileys / Z-API / Evolution API
    console.log(`→ ${p.nome} (${p.whatsapp}): ${texto.slice(0,60)}...`);
    // await whatsappClient.send(p.whatsapp, texto);
    await new Promise(r=>setTimeout(r, 800));
  }
  return { enviados: participantes.length, mensagem: msg };
}
