# K-Onversa - Commit Real Mestre

Caminho correto: `korvil/sok/k-or/k-onversa/` (k-or não kor)

## Regras mestres
- Nunca excluir nada, só ajustar se existir, criar se não existir, não duplicar
- Todos arquivos <100KB, index <25KB
- Usa base_tree para merge (preserva repo)
- Cyan #00E6CC, K-AI círculo 49px borda 3px #00E6CC pulsante kaiPulse
- Logo: `../../../k-ai/assets/logokai/logokai.png` com object-fit:contain
- Sem base64 gigante, apenas referência externa

## Arquivos
- index.html
- package.json
- server.js
- manifest.json
- sw.js
- .gitignore
- src/github/commit-all.js
- public/.gitkeep

## Commit real
Frontend ou backend chama GitHub API:
1. GET ref heads/main
2. GET commit para base_tree
3. POST blobs
4. POST trees com base_tree
5. POST commits
6. PATCH ref

Mensagem: `feat: atualiza k-onversa completo k-or - código mestre`
