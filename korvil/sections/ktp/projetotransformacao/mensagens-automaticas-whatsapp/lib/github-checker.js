import { Octokit } from '@octokit/rest';

export async function verificarEvolucao() {
  const octokit = new Octokit({ auth: process.env.GH_TOKEN });
  const owner = 'sistemak';
  const repo = 'korvil-app';
  
  // Lista commits recentes para medir evolução
  const { data: commits } = await octokit.repos.listCommits({
    owner, repo, per_page: 20
  });
  
  const hoje = new Date().toISOString().slice(0,10);
  const commitsHoje = commits.filter(c => c.commit.author.date.startsWith(hoje));
  
  return {
    totalVerificados: commits.length,
    commitsHoje: commitsHoje.length,
    ultimaAtividade: commits[0]?.commit?.author?.date,
    evolucao: commitsHoje.length > 0 ? 'ATIVA' : 'AGUARDANDO'
  };
}

// CLI
if (import.meta.url.endsWith('github-checker.js')) {
  verificarEvolucao().then(console.log);
}
