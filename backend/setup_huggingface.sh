#!/bin/bash
# HuggingFace Space Deployment Script
# This script deploys the backend to HuggingFace Spaces under mishajatt96/todoappapi

set -e

SPACE_NAME="mishajatt96/todoappapi"
BACKEND_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=========================================="
echo "HuggingFace Space Deployment Script"
echo "Space: $SPACE_NAME"
echo "Backend Dir: $BACKEND_DIR"
echo "=========================================="

# Check if huggingface-cli is installed
if ! command -v huggingface-cli &> /dev/null; then
    echo "Installing huggingface_hub..."
    pip install huggingface_hub
fi

# Check login status
echo ""
echo "Step 1: Checking HuggingFace login..."
if ! huggingface-cli whoami &> /dev/null; then
    echo "You need to login to HuggingFace."
    echo "Run: huggingface-cli login"
    echo "Then re-run this script."
    exit 1
fi
echo "✓ Logged in as: $(huggingface-cli whoami)"

# Create temp directory for upload
TEMP_DIR=$(mktemp -d)
echo ""
echo "Step 2: Preparing files in $TEMP_DIR..."

# Copy files (excluding .venv, __pycache__, .pytest_cache, logs)
rsync -av --progress "$BACKEND_DIR/" "$TEMP_DIR/" \
    --exclude '.venv' \
    --exclude '__pycache__' \
    --exclude '.pytest_cache' \
    --exclude '*.log' \
    --exclude '.env' \
    --exclude '.git' \
    --exclude 'nul'

echo "✓ Files prepared"

# Create/Update the Space
echo ""
echo "Step 3: Creating/Updating HuggingFace Space..."

# Check if space exists
if huggingface-cli repo info $SPACE_NAME --repo-type space &> /dev/null; then
    echo "Space already exists, updating..."
else
    echo "Creating new Space..."
    huggingface-cli repo create todoappapi --type space --space_sdk docker -y || true
fi

# Upload files
echo ""
echo "Step 4: Uploading files to Space..."
cd "$TEMP_DIR"
huggingface-cli upload $SPACE_NAME . . --repo-type space

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo "=========================================="
echo "✓ Deployment Complete!"
echo "=========================================="
echo ""
echo "Your Space URL: https://huggingface.co/spaces/$SPACE_NAME"
echo "API Endpoint: https://mishajatt96-todoappapi.hf.space"
echo ""
echo "IMPORTANT: Set these secrets in Space Settings:"
echo "  - DATABASE_URL"
echo "  - JWT_SECRET"
echo "  - FRONTEND_URL=https://todo-hackathon-nine.vercel.app"
echo "  - ENVIRONMENT=production"
echo "  - GEMINI_API_KEY"
echo "  - GEMINI_MODEL=gemini-2.0-flash-exp"
echo "  - GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/"
echo ""
echo "After setting secrets, verify with:"
echo "  curl https://mishajatt96-todoappapi.hf.space/health"
