// ==============================================================
// Registro central dos modulos do KORVIL
// Agrega todos os modulos e expoe helpers de consulta/validacao.
// ==============================================================
import kth from "./k-th.js";
import whatsapp from "./whatsapp.js";
import kai from "./kai.js";
import geral from "./geral.js";
import afiliados from "./afiliados.js";

// Mapa: slug (usado nas URLs/checkout) -> definicao do modulo
export const modulos = {
  "k-th": kth,
  whatsapp,
  kai,
  geral,
  afiliados,
};

// Lista de slugs validos
export const slugsValidos = Object.keys(modulos);

// Verifica se um slug de modulo existe
export function moduloValido(slug) {
  return slugsValidos.includes(slug);
}

// Retorna a definicao de um modulo (ou null)
export function getModulo(slug) {
  return modulos[slug] || null;
}

// Retorna todos os modulos em formato de lista, incluindo o slug
export function listarModulos() {
  return slugsValidos.map((slug) => ({ slug, ...modulos[slug] }));
}
