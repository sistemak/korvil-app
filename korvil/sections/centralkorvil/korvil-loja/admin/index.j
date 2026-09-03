<!doctype html>
<html>
<head><meta charset="utf-8"/><title>SISTEMA K - ADMIN</title></head>
<body>
  <script>
    window.CMS_CONFIG = {
      backend: {
        name: "github",
        repo: "korvilp-sudo/korvil-app",
        branch: "main",
        auth_endpoint: "api.github.com"
      },
      publish_mode: "editorial_workflow",
      media_folder: "sections/centralkorvil/korvil-loja/uploads",
      public_folder: "/uploads",
      collections: [{
        name: "produtos",
        label: "📦 SISTEMA K - PRODUTOS",
        folder: "sections/centralkorvil/korvil-loja",
        create: true,
        slug: "{{sistema}}/{{area}}/marcas/{{marca}}/produtos/{{produto}}",
        extension: "html",
        fields: [
          {label: "SISTEMA", name: "sistema", widget: "select", options: ["K", "K-TP", "K-AFORTUNADO", "K-ALMA"]},
          {label: "ÁREA", name: "area", widget: "select", options: ["Profissionais", "Tecnologias", "Suplementos", "Acessorios", "Alimentos", "Livros", "Financas", "Saude", "Beleza"]},
          {label: "MARCA", name: "marca", widget: "string"},
          {label: "PRODUTO", name: "produto", widget: "string"},
          {label: "TITULO", name: "titulo", widget: "string"},
          {label: "PRECO", name: "preco", widget: "number"},
          {label: "DESCRICAO", name: "descricao", widget: "markdown"}
        ]
      }]
    }
  </script>
  <script src="https://unpkg.com/decap-cms@^3.5.0/dist/decap-cms.js"></script>
</body>
</html>
