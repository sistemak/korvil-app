import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const CONTAS_DIR = path.join(ROOT, 'login', 'contas');
const GITKEEP = path.join(CONTAS_DIR, '.gitkeep');
const README = path.join(CONTAS_DIR, 'README.md');

function ensure() {
  console.log('KORVIL SETUP - garantindo estrutura, nunca duplicando...');

  if (!fs.existsSync(CONTAS_DIR)) {
    fs.mkdirSync(CONTAS_DIR, { recursive: true });
    console.log('✓ Criado: korvil/sections/korvil-loja/login/contas');
  } else {
    console.log('✓ Pasta já existe - pulando: login/contas');
  }

  if (!fs.existsSync(GITKEEP)) {
    fs.writeFileSync(GITKEEP, '', 'utf8');
    console.log('✓ Criado: .gitkeep');
  } else {
    console.log('✓ Arquivo já existe - pulando: .gitkeep');
  }

  if (!fs.existsSync(README)) {
    const md = `# KORVIL CONTAS

Estrutura automática:

```
login/contas/{pastaMae}/{pastaMae}.json
```

Exemplo: 
- João Silva Santos -> `joao_s_s/joao_s_s.json`
- Ana Maria Oliveira Costa -> `ana_m_o_c/ana_m_o_c.json`

Cada JSON: { id, pasta, nome, email, senha_hash sha256, criado_em }

Nunca duplicar, só adiciona ou ajusta.
Gerado por scripts/ensure-contas-structure.js - NODE PURO, SEM VERCEL
`;
    fs.writeFileSync(README, md, 'utf8');
    console.log('✓ Criado: README.md explicativo');
  } else {
    console.log('✓ Arquivo já existe - combinando se preciso: README.md');
    const atual = fs.readFileSync(README, 'utf8');
    if (!atual.includes('joao_s_s')) {
      fs.appendFileSync(README, '\n\n> Auto-update: exemplo joao_s_s mantido\n');
      console.log('✓ README ajustado - combinado');
    }
  }

  console.log('✔ Todas pastas e arquivos prontos! SEM DUPLICAR PORRA');
}

ensure();
