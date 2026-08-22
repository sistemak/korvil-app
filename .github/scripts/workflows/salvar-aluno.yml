name: Salvar Aluno
on:
  workflow_dispatch:
    inputs:
      dados:
        description: 'JSON do aluno'
        required: true
jobs:
  salvar:
    runs-on: ubuntu-latest
    permissions: { contents: write }
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: node.github/scripts/atualiza.js '${{ github.event.inputs.dados }}'
      - run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add cronograma-de-alunos.json
          git commit -m "Update aluno" || exit 0
          git push
