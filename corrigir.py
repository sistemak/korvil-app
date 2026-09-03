import os

# O QUE VAI TROCAR - edita aqui
trocas = {
    "/korvil-app/": "./",
    "/korvil-app": "./",
    "sistemak.github.io/korvil-app": "sistemak.github.io/korvil-app",
}

# Não mexe nessas pastas
ignorar = {".git", "node_modules", ".vscode"}

for raiz, pastas, arquivos in os.walk("."):
    pastas[:] = [p for p in pastas if p not in ignorar]
    for nome in arquivos:
        if nome.endswith((".html", ".js", ".css", ".json")):
            caminho = os.path.join(raiz, nome)
            try:
                with open(caminho, "r", encoding="utf-8") as f:
                    conteudo = f.read()
                novo = conteudo
                for velho, novo_valor in trocas.items():
                    novo = novo.replace(velho, novo_valor)
                if novo != conteudo:
                    with open(caminho, "w", encoding="utf-8") as f:
                        f.write(novo)
                    print(f"Arrumado: {caminho}")
            except:
                pass

print("PRONTO - todos os codigos foram arrumados!")
