.PHONY: lint lint-frontend lint-backend test test-frontend test-backend deploy

# Linting
lint: lint-frontend lint-backend
	@echo "Linting complete!"

lint-frontend:
	@echo "Linting frontend..."
	cd web && npm run lint

lint-backend:
	@echo "Linting backend..."
	go fmt ./...
	go vet ./...

# Testing
test: test-frontend test-backend
	@echo "All tests complete!"

test-frontend:
	@echo "Running frontend tests..."
	cd web && npm run test

test-backend:
	@echo "Running backend tests..."
	go test ./...

# Deploy using Docker Compose (Production)
deploy:
	@echo "Deploying CV Forge..."
	@docker compose down
	@docker compose up -d --build --force-recreate --remove-orphans
	@docker image prune -f
	@echo "Deployed!"