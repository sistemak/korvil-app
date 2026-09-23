// scripts/ensure-contas-structure.js - ATUALIZADO
// Garante estrutura login/contas + remove joao_s_s se existir + .gitkeep

const fs = require('fs');
const path = require('path');

const CONTAS_DIR = path.join(__dirname, '..', 'login', 'contas');
const JOAO_PATH = path.join(CONTAS_DIR, 'joao_s_s');
const JOAO_JSON = path.join(JOAO_PATH, 'joao_s_s.json');

function ensureContasStructure(){
  // 1. Garante pasta login/contas
  if(!fs.existsSync(CONTAS_DIR)){
    fs.mkdirSync(CONTAS_DIR, { recursive: true });
    console.log('✓ Criado: login/contas');
  }

  // 2. Garante .gitkeep
  const gitkeep = path.join(CONTAS_DIR, '.gitkeep');
  if(!fs.existsSync(gitkeep)){
    fs.writeFileSync(gitkeep, '');
    console.log('✓ Criado: .gitkeep em login/contas');
  }

  // 3. Verifica e exclui joao_s_s se existir (local)
  if(fs.existsSync(JOAO_JSON)){
    try{
      fs.unlinkSync(JOAO_JSON);
      console.log('✓ Excluído local: joao_s_s/joao_s_s.json');
    }catch(e){ console.error('Erro ao excluir joao_s_s.json', e); }
  }
  if(fs.existsSync(JOAO_PATH)){
    try{
      const files = fs.readdirSync(JOAO_PATH);
      if(files.length===0){
        fs.rmdirSync(JOAO_PATH);
        console.log('✓ Pasta joao_s_s removida (vazia)');
      } else {
        console.log('! Pasta joao_s_s contém arquivos, mantida para revisão:', files);
      }
    }catch(e){ console.error('Erro ao remover pasta joao_s_s', e); }
  }

  // 4. Lista contas existentes
  try{
    const entries = fs.readdirSync(CONTAS_DIR, { withFileTypes: true });
    const contas = entries.filter(d=>d.isDirectory()).map(d=>d.name).filter(n=>n!=='.git');
    console.log('Contas existentes:', contas.length ? contas.join(', ') : '(nenhuma, só .gitkeep)');
  }catch(_){}
}

if(require.main===module){
  ensureContasStructure();
}

module.exports = { ensureContasStructure };
