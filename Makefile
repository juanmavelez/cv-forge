.PHONY: build dev clean deps frontend backend

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
	@echo "🚀 Starting Go backend..."
	go run ./cmd/server &
	@echo "🚀 Starting Vite dev server..."
	cd web && npx vite --open

# Clean build artifacts
clean:
	rm -rf cv-forge cmd/server/dist web/node_modules
	@echo "🧹 Cleaned."
