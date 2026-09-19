// Camada 0 - Entrada sensorial
export const layer0 = { id:0, type:"input", size:128, activation:"relu", process: (x) => x.map(v=> Math.max(0,v)) }