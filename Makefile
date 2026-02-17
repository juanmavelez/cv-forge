.PHONY: build dev clean deps frontend backend lint lint-frontend lint-backend test test-frontend test-backend

# Build everything
build: deps frontend backend
	@echo "✅ Build complete! Run ./cv-forge to start."

# Install dependencies
deps:
	@echo "📦 Installing frontend dependencies..."
	cd web && npm install --silent
	@echo "📦 Installing Go dependencies..."
	go mod tidy

# Build frontend (React + Vite → dist/)
frontend:
	@echo "🔨 Building frontend..."
	cd web && npx vite build

# Build Go binary
backend:
	@echo "🔨 Building backend..."
	go build -o cv-forge ./cmd/server

# Development mode
dev: deps
	@echo "🚀 Starting Go backend and Vite dev server..."
	(go run ./cmd/server & cd web && npm run dev)

# Clean build artifacts
clean:
	rm -rf cv-forge cmd/server/dist web/node_modules web/dist
	@echo "🧹 Cleaned."

# Linting
lint: lint-frontend lint-backend
	@echo "✅ Linting complete!"

lint-frontend:
	@echo "🔍 Linting frontend..."
	cd web && npm run lint

lint-backend:
	@echo "🔍 Linting backend..."
	go fmt ./...
	go vet ./...

# Testing
test: test-frontend test-backend
	@echo "✅ All tests complete!"

test-frontend:
	@echo "🧪 Running frontend tests..."
	cd web && npm run test

test-backend:
	@echo "🧪 Running backend tests..."
	go test ./...