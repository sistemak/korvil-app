# K-TP MASTER 9 ARQUIVOS - BANCO CENTRAL ATUALIZADO

Este pacote corrige o salvamento no banco central cronograma-de-alunos.json / .js

## Problema original
Criava pastas mãe e arquivos .json mas não salvava dados dentro do banco central 2026/cronograma-de-alunos.js

## Solução - 9 ARQUIVOS

1. projetotransformacao.html - âncoras MENU, CRONOGRAMA, calendario-anchor, token box fake livre, scripts calendario.js, menu-lateral.js, cronograma.js
2. calendario.js - 52 semanas module.exports + window.KTP_CALENDARIO
3. cronograma-de-alunos/cronograma-de-alunos.json - JSON simples online/presencial lista
4. cronograma-de-alunos/cronograma-de-alunos.js - Node fs + fetch wrapper
5. menu-lateral.js - toggleMenu
6. config/node-config.js - Octokit para 9 arquivos com getSha e commitFile nunca duplica
7. README.md - este arquivo
8. cronograma-de-alunos/2026/inscricao.html - INSCRIÇÃO CORRIGIDA com lógica que faltava para salvar no banco central por numeração
9. cronograma-de-alunos/2026/cronograma-de-alunos.js - BANCO CENTRAL literal usuário com 43 alunos, ALUNOS_DB, PRESENCIAL, ONLINE, CRONOGRAMA_DB

## Lógica Token Livre
- Input id="tokenInput" placeholder "Cole GH_TOKEN real ghp_..."
- Status id="tokenStatus"
- Fake amarelo livre: hp_RR67zU91Wyp59ES8wH2k4FZ8KS9XcM15PdHG NÃO BLOQUEIA
- Qualquer token 8+ chars habilita botão id="btnCommit"
- Salva em memória window.GH_TOKEN_REAL e getRealToken()

## Lógica GitHub
- OWNER=sistemak REPO=korvil-app BRANCH=main
- getSha busca SHA existente para nunca duplicar
- commitFile faz PUT com base64 + sha

## Correção inscrição.html
Após PUT do arquivo individual:
- centralPath = korvil/sections/ktp/projetotransformacao/cronograma-de-alunos/2026/cronograma-de-alunos.js
- Fetch GET via GitHub API com token real
- Decode base64, extrai KTP_CRONOGRAMA
- Adiciona em ALUNOS_DB[id] e ALUNOS_PRESENCIAL[id]
- Encontra slot da hora selecionada em CRONOGRAMA_DB.PRESENCIAL ou cria 08h00
- Push objeto aluno completo com TODOS dados das 3 telas (cpf, nasc, idade, genero, whats, email, nivel_atividade, q1-q9, cep, rua, numero, bairro, cidade, dias, freq, objetivo, valor, matricula, total, venc +30 dias, status Ativo, plano)
- Reconstrói JS completo com window.KTP_CRONOGRAMA = {...} + compat var Sr, pf etc + token falso comentário no final
- PUT atualiza central + .json equivalente
- Mantém popup CONFIRMADO verde #00ff88 e dispatch whatsapp.yml
