// Camada 1 - Memória curta
export const layer1 = { id:1, type:"memory", size:256, activation:"tanh", memory: [], push(m){ this.memory.push(m); if(this.memory.length>100) this.memory.shift(); } }