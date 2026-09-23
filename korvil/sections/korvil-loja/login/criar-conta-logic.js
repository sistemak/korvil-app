// criar-conta-logic.js - lógica isolada reusável
function gerarPastaMae(nomeCompleto){
  const partes = nomeCompleto.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim().split(/\s+/).filter(Boolean);
  if(partes.length===0) return "usuario";
  if(partes.length===1) return partes[0];
  if(partes.length===2) return `${partes[0]}-${partes[1][0]}`;
  return `${partes[0]}-${partes[1][0]}-${partes[2][0]}`;
}
function gerarArquivo(pastaMae){ return pastaMae + ".json"; }
async function sha256(str){
  if(typeof window!=="undefined" && window.crypto?.subtle){
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
  } else {
    const cryptoNode = require("crypto");
    return cryptoNode.createHash("sha256").update(str).digest("hex");
  }
}
if(typeof module!=="undefined") module.exports = {gerarPastaMae, gerarArquivo, sha256};
