# Usuarios - pastas mães - K-Onversa 1000%

Estrutura:
- usuarios/{id}/perfil.json - CPF e acento esses dados eu já tive
- usuarios/{id}/config.json - tema, cor, autoPost, privacidade
- usuarios/{id}/status/ - status 24h igual WhatsApp
- usuarios/{id}/social/conexoes.json - tokens criptografados AES-256
- usuarios/{id}/automacoes/regras.json - respostas auto, agendamentos, auto-arquivar
- usuarios/{id}/conversas/ - conversas criptografadas

Anti-duplicação: verifica email/zap/cpf + hash de lógica antes de criar