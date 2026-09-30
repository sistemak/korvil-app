import fs from 'fs'
const ALUNOS_PATH = './korvil/sections/ktp/projetotransformacao/mensagens-automaticas-whatsapp/src/alunos-mensalidades.json'
const FILA_PATH = './korvil/sections/ktp/projetotransformacao/mensagens-automaticas-whatsapp/data/scheduled.json'
async function main(){
  if(!fs.existsSync(ALUNOS_PATH)) return
  const alunos = JSON.parse(fs.readFileSync(ALUNOS_PATH,'utf8'))
  const fila = fs.existsSync(FILA_PATH) ? JSON.parse(fs.readFileSync(FILA_PATH,'utf8')) : []
  const hoje = new Date()
  for(const aluno of alunos){
    const vencDia = aluno.dia_vencimento
    let proxVenc = new Date(hoje.getFullYear(), hoje.getMonth(), vencDia)
    if(proxVenc < hoje) proxVenc = new Date(hoje.getFullYear(), hoje.getMonth()+1, vencDia)
    const diffDias = Math.ceil((proxVenc - hoje)/(1000*60*60*24))
    if(diffDias === 7){
      const jaExiste = fila.some(f=> f.phone===aluno.phone && f.tipo==='cobranca' && new Date(f.send_at).getMonth()===proxVenc.getMonth() && f.status==='pending')
      if(!jaExiste){
        const msg = `Olá ${aluno.nome}! 💰 Sua mensalidade de R$ ${aluno.valor} vence em 7 dias, dia ${vencDia}/${proxVenc.getMonth()+1}. Evite juros! Chave PIX: ${aluno.pix||'...'} - KTP`
        fila.push({ id: Date.now()+Math.random(), phone: aluno.phone, message: msg, send_at: hoje.toISOString(), status: 'pending', tipo: 'cobranca', aluno_id: aluno.id })
        console.log(`+ Cobrança agendada ${aluno.nome}`)
      }
    }
  }
  fs.writeFileSync(FILA_PATH, JSON.stringify(fila, null, 2))
}
main()
// --- INTELIGÊNCIA AUTÔNOMA 7 DIAS ANTES - NÃO DUPLICAR ---
