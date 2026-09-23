// criar-conta-logic.js - Lógica compartilhada pasta mãe
function gerarPastaMae(nomeCompleto){
  if(!nomeCompleto) return '';
  const sem = nomeCompleto.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9\s-]/g,'').trim();
  const partes = sem.split(/\s+/).filter(Boolean);
  if(partes.length===0) return '';
  if(partes.length===1) return partes[0];
  const primeiro = partes[0];
  const iniciais = partes.slice(1).map(p=>p[0]);
  return [primeiro, ...iniciais].join('-');
}
function gerarConta({nome_completo,email,senha_hash,cpf,whatsapp,cep,rua,numero,bairro,cidade,estado,foto_perfil}){
  const pasta_mae = gerarPastaMae(nome_completo);
  const arquivo = pasta_mae + '.json';
  const agora = new Date().toISOString();
  const id = (typeof crypto!=='undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)+Math.random().toString(36).slice(2));
  return {
    id, arquivo, pasta_mae,
    nome_completo: nome_completo,
    primeiro_nome: nome_completo.split(/\s+/)[0],
    email, senha_hash, cpf, whatsapp, cep, rua, numero, bairro, cidade, estado,
    foto_perfil: foto_perfil || '',
    criado_em: agora,
    atualizado_em: agora
  };
}
if(typeof module!=='undefined') module.exports = { gerarPastaMae, gerarConta };
