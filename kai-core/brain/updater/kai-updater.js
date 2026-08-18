// ============= K-AI UPDATER V-2026.4 - A PONTE =============
const TOKEN = localStorage.getItem('kai_gh_token') || prompt("K-AI PONTE: Cole seu token GitHub 1x só:");
if(TOKEN) localStorage.setItem('kai_gh_token', TOKEN);

const REPO = "korvilp-sudo/korvil-app"; // <<-- MUDA AQUI SE FOR OUTRO REPO

class KAIUpdater {
  async enviar(caminho, codigo){
    if(!TOKEN) return this.log("ERRO: Sem token");
    const url = `https://api.github.com/repos/${REPO}/contents/${caminho}`;

    let sha = null;
    try{
      const res = await fetch(url, {headers: {Authorization: `token ${TOKEN}`}});
      if(res.ok) sha = (await res.json()).sha;
    }catch{}

    const r = await fetch(url, {
      method: 'PUT',
      headers: {Authorization: `token ${TOKEN}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({
        message: `Auto-update by K-AI V-2026.4`,
        content: btoa(unescape(encodeURIComponent(codigo))),
        sha: sha
      })
    });
    if(r.ok) this.log(`[PONTE] Enviado: ${caminho}`);
    else this.log(`[PONTE] ERRO ao enviar`);
  }
  log(t){ console.log(t) }
}
window.PONTE = new KAIUpdater();
