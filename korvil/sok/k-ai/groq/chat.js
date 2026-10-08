export function mountKaiBar({ onSend }){
  const bar = document.getElementById('kaiBar');
  const input = document.getElementById('kaiInput');
  const btn = document.getElementById('kaiSend');
  if(!bar || !input || !btn) return false;
  const handler = () => {
    const v = input.value.trim();
    if(!v) return;
    if(onSend) onSend(v);
    input.value = '';
  };
  btn.onclick = handler;
  input.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter') handler();
  });
  bar.style.display = 'flex';
  return true;
}

export async function sendToGroqViaIssue(prompt){
  const token = localStorage.getItem('GH_TOKEN') || localStorage.getItem('gh_token');
  if(!token){
    alert('GH_TOKEN não encontrado no localStorage. Configure em Config.');
    return;
  }
  const res = await fetch('https://api.github.com/repos/sistemak/korvil-app/issues',{
    method: 'POST',
    headers: {
      'Authorization': 'token '+token,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      title: 'k-ai: '+prompt.slice(0,80),
      body: prompt,
      labels: ['k-ai']
    })
  });
  if(!res.ok){
    const t = await res.text();
    throw new Error('Issue create failed '+res.status+' '+t);
  }
  const data = await res.json();
  return data;
}

export function autoActivate(){
  const token = localStorage.getItem('GH_TOKEN');
  const modeEl = document.getElementById('authMode');
  if(modeEl) modeEl.textContent = token ? '🔐 GH_TOKEN ativo (localStorage)' : '👁️ modo público read-only';
  return !!token;
}
