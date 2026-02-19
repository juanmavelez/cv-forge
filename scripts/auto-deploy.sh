#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT" || { echo "Directory not found"; exit 1; }

git fetch origin main
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "[$(date)] Found new changes in $(basename "$PROJECT_ROOT")! Deploying..."
    git pull origin main
    docker compose up -d --build
    docker image prune -f
    echo "[$(date)] Deployment complete."
fi
