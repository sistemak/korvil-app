# API segura de pesos do K-TP

Esta pasta contém o backend Node/Express. O GitHub Pages não executa Node; publique esta API em Render, Railway, Fly.io ou outro host Node.

## Configuração

1. Copie `.env.example` para `.env` no servidor.
2. Configure `GH_TOKEN` como segredo do provedor de hospedagem. Nunca faça commit do `.env`.
3. Execute `npm install` e `npm start` dentro desta pasta.

## Endpoint

`POST /api/peso`

```json
{
  "id": "mcarla2",
  "pesoDigitado": "72,5",
  "semanaStr": "23/09/2026",
  "dataRegistro": "23/09/2026 10:00:00"
}
```

Após publicar a API, configure a URL pública em `window.KTP_PESO_ENDPOINT` na página do projeto.
