import Groq from "groq-sdk";
import { Octokit } from "@octokit/rest";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const github = new Octokit({ auth: process.env.GITHUB_TOKEN });

const OWNER = "sistemak";
const REPO = "korvil-app";
const ARQUIVO = "README.md"; // pode mudar pra index.js, app.js etc

async function run() {
  const pedido = process.argv[2] || "melhore esse arquivo";
  const { data } = await github.repos.getContent({ owner: OWNER, repo: REPO, path: ARQUIVO });
  const codigoAtual = Buffer.from(data.content, 'base64').toString();

  console.log(`IA mexendo em ${ARQUIVO}...`);

  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: "Retorne APENAS o código/conteúdo novo completo, sem markdown." },
      { role: "user", content: `${pedido}\n\nARQUIVO ATUAL:\n${codigoAtual}` }
    ]
  });

  const novo = res.choices[0].message.content.replace(/```.*\n/g, "").replace(/```/g, "");

  await github.repos.createOrUpdateFileContents({
    owner: OWNER, repo: REPO, path: ARQUIVO,
    message: `feat: ${pedido} [AI Bot]`,
    content: Buffer.from(novo).toString('base64'),
    sha: data.sha
  });
  console.log("FEITO! Já está no GitHub.");
}
run();
