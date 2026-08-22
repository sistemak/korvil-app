
const { Client, LocalAuth } = require('whatsapp-web.js');
const cron = require('node-cron');
const axios = require('axios');

const client = new Client({ authStrategy: new LocalAuth() });
const GRUPO_ID = "COLA_AQUI_ID_DO_GRUPO@c.us"

function getLinkDoAno(ano) {
  return `https://raw.githubusercontent.com/SEU_USUARIO/mensagens-automaticas-whatsapp/main/banco-de-mensagens/mensagens-${ano}.json`
}

function getFaseEMes(mes) {
  if ([1,2].includes(mes)) return "FASE_1_OFF_SEASON";
  if ([3,4,5].includes(mes)) return "FASE_2_BULKING";
  if ([6,7,8].includes(mes)) return "FASE_3_MAINTENANCE";
  if ([9,10,11].includes(mes)) return "FASE_4_CUTTING";
  return "DEZEMBRO_FERIAS";
}

function getSemanaDoMes(data) {
  const dia = data.getDate();
  if (dia <= 7) return "1_MANUTENCAO";
  if (dia <= 14) return "2_RESISTENCIA";
  if (dia <= 21) return "3_FORCA";
  return "4_HIPERTROFIA";
}

client.on('ready', () => console.log('K-TP 11° ANO Online!'));

cron.schedule('0 5 * 1', async () => { // Toda Seg 5h
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const LINK = getLinkDoAno(ano);

  const { data } = await axios.get(LINK);
  const fase = getFaseEMes(hoje.getMonth() + 1);
  const semana = getSemanaDoMes(hoje);
  const msg = ano === 2030 && hoje.getMonth() === 11 ? data : data[fase][semana];

  await client.sendMessage(GRUPO_ID, `*K-TP ${ano} - ${hoje.toLocaleDateString('pt-BR')}*\n\n${msg}`);
});

client.on('qr', qr => console.log('ESCANEIA O QR'));
client.initialize();
