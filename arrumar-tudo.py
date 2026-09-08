import os, re
from pathlib import Path

root = Path(".")

# pega todos html/js/css
for filepath in root.rglob("*.*"):
    if filepath.suffix not in [".html",".js",".css"]: continue
    if ".git" in str(filepath): continue
    
    try:
        text = filepath.read_text(encoding="utf-8", errors="ignore")
        original = text

        # calcula profundidade pra voltar
        depth = len(filepath.parent.relative_to(root).parts)
        prefix = "../" * depth if depth > 0 else "./"
        if filepath.parent.name == "": 
            prefix = "./"

        # arruma tudo:
        # 1. /korvil-app/ -> relativo
        text = text.replace("/korvil-app/", prefix)
        text = text.replace("/korvil/", prefix + "korvil/")
        text = re.sub(r'href="/(?!/)', f'href="{prefix}', text)
        text = re.sub(r'src="/(?!/)', f'src="{prefix}', text)
        # 2. window.location = "/loja.html" -> "./loja.html"
        text = re.sub(r'window\.location.*=\s*"/', f'window.location = "{prefix}', text)
        text = re.sub(r'location\.href.*=\s*"/', f'location.href = "{prefix}', text)

        if text != original:
            filepath.write_text(text, encoding="utf-8")
            print(f"✔ Arrumado: {filepath}")
    except Exception as e:
        print(f"Erro {filepath}: {e}")

print("\nPRONTO! Agora é só subir de novo pro GitHub.")
