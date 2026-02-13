# Docker Setup Guide

This guide explains how to run the Todo app in Docker containers, connecting to your HuggingFace Space API.

## Prerequisites

- Docker Desktop installed and running
- HuggingFace Space deployed at `https://mishajatt96-todoappapi.hf.space`

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# From the project root directory
docker-compose up --build
```

The frontend will be available at: http://localhost:3000

### Option 2: Manual Docker Build

#### Build Frontend Image

```bash
cd frontend

# Build with your HuggingFace API URL
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://mishajatt96-todoappapi.hf.space \
  -t todo-frontend .
```

#### Run Frontend Container

```bash
docker run -d \
  --name todo-frontend \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://mishajatt96-todoappapi.hf.space \
  todo-frontend
```

## Verify Connectivity

### 1. Check HuggingFace API is accessible

```bash
# Health check
curl https://mishajatt96-todoappapi.hf.space/health

# Expected response:
# {"status": "healthy", "database": "connected", "timestamp": "..."}
```

### 2. Check frontend container is running

```bash
docker ps

# Should show:
# CONTAINER ID   IMAGE           PORTS                    STATUS
# abc123...      todo-frontend   0.0.0.0:3000->3000/tcp   Up X minutes
```

### 3. Test frontend can reach API

```bash
# From inside the container
docker exec todo-frontend wget -qO- https://mishajatt96-todoappapi.hf.space/health

# Or via browser
# Open http://localhost:3000/tasks
```

### 4. Check container logs

```bash
docker logs todo-frontend
```

## Troubleshooting

### Mixed Content Errors

If you see "Mixed Content" errors in browser console:
- Ensure `NEXT_PUBLIC_API_URL` uses `https://` (not `http://`)
- Rebuild the Docker image with the correct URL

### API Connection Refused

If frontend can't connect to API:
1. Verify HuggingFace Space is running: `curl https://mishajatt96-todoappapi.hf.space/health`
2. Check the Space logs in HuggingFace dashboard
3. Ensure CORS allows your frontend origin

### Container Won't Start

```bash
# Check logs for errors
docker logs todo-frontend

# Common issues:
# - Port 3000 already in use: docker stop <other-container> or use -p 3001:3000
# - Build failed: Check Dockerfile and try rebuilding
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | HuggingFace API endpoint | `https://mishajatt96-todoappapi.hf.space` |
| `NODE_ENV` | Environment mode | `production` |

## Docker Commands Reference

```bash
# Build image
docker build -t todo-frontend ./frontend

# Run container
docker run -d -p 3000:3000 --name todo-frontend todo-frontend

# Stop container
docker stop todo-frontend

# Remove container
docker rm todo-frontend

# View logs
docker logs -f todo-frontend

# Shell into container
docker exec -it todo-frontend sh

# Remove image
docker rmi todo-frontend

# Clean up everything
docker-compose down --rmi all
```

## Production Deployment

For production, you have two options:

### 1. Deploy to Vercel (Frontend Only)

Update environment variable in Vercel Dashboard:
- `NEXT_PUBLIC_API_URL` = `https://mishajatt96-todoappapi.hf.space`

### 2. Self-host with Docker

```bash
# Build and run in detached mode
docker-compose up -d --build

# Or use Docker Swarm / Kubernetes for scaling
```

## Architecture

```
┌─────────────────────┐         HTTPS          ┌─────────────────────────────┐
│   Docker Container  │ ─────────────────────> │   HuggingFace Space         │
│   (Frontend)        │                        │   (Backend API)             │
│                     │                        │                             │
│   localhost:3000    │                        │   mishajatt96-todoappapi    │
│   Next.js App       │                        │   FastAPI + PostgreSQL      │
└─────────────────────┘                        └─────────────────────────────┘
```

The frontend runs locally in Docker but connects to your backend API hosted on HuggingFace Spaces over HTTPS.
