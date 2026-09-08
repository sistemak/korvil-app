setup: ## instala tudo
	npm ci || pip install -r requirements.txt || go mod tidy
fix: ## corrige tudo automatico
	npx prettier -w . || black . && isort .
lint: ## verifica algoritmos e erros
	npm run lint || ruff check . || golangci-lint run
update: ## atualiza dependencias
	npm update && npm audit fix
