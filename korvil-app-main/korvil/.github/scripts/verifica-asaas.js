const fs = require('fs');
const https = require('https');

const API_KEY = process.env.ASAAS_API_KEY;

// meses com nome, sem acento pra URL não quebrar
const MESES_NOME = ['janeiro','fevereiro','marco','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];

const agora = new Date();
const ANO = agora.getFullYear().toString();
const MES_NOME = MESES_NOME[agora.getMonth()]; // setembro

const PASTA_PAGAMENTOS = `korvil/sections/korvil-loja/pagamentos/${ANO}/${MES_NOME}`;
const PASTA_PENDENTES = `korvil/sections/korvil-loja/pendentes`;

if (!API_KEY) { console.log('SEM KEY'); process.exit(0); }

function asaasGet(path) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.asaas.com', path: path, method: 'GET',
      headers: { 'access_token': API_KEY }
    }, res => {
      let data=''; res.on('data', d=>data+=d);
      res.on('end', ()=>{ try{resolve(JSON.parse(data))}catch(e){resolve({})} });
    });
    req.on('error', reject); req.end();
  });
}

async function main() {
  if (!fs.existsSync(PASTA_PAGAMENTOS)) {
    fs.mkdirSync(PASTA_PAGAMENTOS, {recursive:true});
    fs.writeFileSync(`${PASTA_PAGAMENTOS}/.gitkeep`, '');
    console.log(`📁 Criou: ${PASTA_PAGAMENTOS}`);
  }
  if (!fs.existsSync(PASTA_PENDENTES)) fs.mkdirSync(PASTA_PENDENTES, {recursive:true});

  console.log(`Setor korvil-loja - ${ANO}/${MES_NOME}`);

  const lista = await asaasGet('/v3/payments?limit=100&status=PENDING,RECEIVED,CONFIRMED');
  const payments = lista.data || [];

  for (const payment of payments) {
    const pixId = payment.externalReference;
    if (!pixId || (!pixId.startsWith('KORVIL-') && !pixId.startsWith('KVL'))) continue;

    if (payment.status === 'RECEIVED' || payment.status === 'CONFIRMED') {
      let anoPagamento = ANO;
      let mesPagamentoNome = MES_NOME;
      
      if (payment.paymentDate) {
        const d = new Date(payment.paymentDate);
        anoPagamento = d.getFullYear().toString();
        mesPagamentoNome = MESES_NOME[d.getMonth()];
      }

      const pastaDestino = `korvil/sections/korvil-loja/pagamentos/${anoPagamento}/${mesPagamentoNome}`;
      if (!fs.existsSync(pastaDestino)) {
        fs.mkdirSync(pastaDestino, {recursive:true});
        console.log(`📁 Criou pasta: ${pastaDestino}`);
      }

      const destino = `${pastaDestino}/${pixId}.json`;
      if (fs.existsSync(destino)) continue;

      fs.writeFileSync(destino, JSON.stringify({
        pago: true,
        ano: anoPagamento,
        mes: mesPagamentoNome,
        setor: 'korvil-loja',
        pixId: pixId,
        asaasId: payment.id,
        status: payment.status,
        valor: payment.value,
        dataConfirmacao: new Date().toISOString(),
        dataPagamentoAsaas: payment.paymentDate,
        contaAsaas: 'korvil.p@gmail.com',
        rawUrl: `https://raw.githubusercontent.com/sistemak/korvil-app/main/korvil/sections/korvil-loja/pagamentos/${anoPagamento}/${mesPagamentoNome}/${pixId}.json`
      }, null, 2));

      console.log(`✅ ${pixId} -> ${pastaDestino}/`);
    }
  }
}
main();