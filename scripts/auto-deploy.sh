#!/bin/bash

cd ~/cv-forge || { echo "Directory not found"; exit 1; }

git fetch origin main

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "[$(date)] Found new changes! Deploying..."
    
    git pull origin main

    docker-compose up -d --build

    docker image prune -f
    
    echo "[$(date)] Deployment complete."
else
    :
fi
