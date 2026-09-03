import os, re
from pathlib import Path

root = Path("korvil") # onde tá seu site de verdade
# mapeia todos os arquivos reais
mapa = {}
for p in root.rglob("*"):
    if p.is_file():
        mapa[p.name.lower()] = p # ex: loja.html -> caminho real
        mapa[str(p.relative_to(root)).replace("\\","/").lower()] = p

print("Arquivos encontrados:", len(mapa))

for html_file in root.rglob("*.html"):
    try:
        txt = html_file.read_text(encoding="utf-8", errors="ignore")
        orig = txt

        # pega todos href/src="..."
        def corrige(match):
            aspas = match.group(1)
            caminho = match.group(2)
            if caminho.startswith("http") or caminho.startswith("#") or caminho.startswith("data:"):
                return match.group(0)

            # limpa caminho antigo
            nome = Path(caminho).name # pega só loja.html
            if not nome:
                return match.group(0)

            # procura onde esse arquivo REALMENTE tá hoje
            alvo = mapa.get(nome.lower()) or mapa.get(caminho.lower().lstrip("./").lstrip("/"))
            if alvo:
                # calcula caminho relativo certo da página atual até o alvo
                rel = os.path.relpath(alvo, html_file.parent).replace("\\","/")
                return f'{match.group(1).split("=")[0]}={aspas}{rel}{aspas}'
            return match.group(0)

        # arruma href="..." e src="..."
        txt = re.sub(r'(href|src)\s*=\s*(["\'])([^"\']+)\2', corrige, txt, flags=re.I)
        # arruma window.location
        txt = re.sub(r'(location\.href|window\.location)\s*=\s*(["\'])([^"\']+)\2', corrige, txt, flags=re.I)

        if txt!= orig:
            html_file.write_text(txt, encoding="utf-8")
            print(f"✔ Corrigido: {html_file.relative_to(root)}")
    except Exception as e:
        print(f"Erro em {html_file}: {e}")

print("\nPRONTO! Todos os sub-caminhos arrumados na ordem certa.")
