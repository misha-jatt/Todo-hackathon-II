# Deployment Complete

Your Todo App is now fully deployed and running.

## URLs

| Service | URL | Status |
|---------|-----|--------|
| **Backend API** | https://mishajatt96-todoappapi.hf.space | ✅ Running |
| **Frontend (Vercel)** | https://todo-hackathon-nine.vercel.app | Update env var needed |
| **Frontend (Docker)** | http://localhost:3001 | ✅ Running |

## Backend API (HuggingFace Space)

**Space:** https://huggingface.co/spaces/mishajatt96/todoappapi

**API Endpoints:**
```bash
# Health check
curl https://mishajatt96-todoappapi.hf.space/health

# Root endpoint
curl https://mishajatt96-todoappapi.hf.space/

# Tasks (requires auth)
curl https://mishajatt96-todoappapi.hf.space/api/tasks
```

**Secrets configured:**
- `DATABASE_URL` - Neon PostgreSQL
- `JWT_SECRET` - JWT signing key
- `FRONTEND_URL` - https://todo-hackathon-nine.vercel.app

## Frontend Docker

**Build:**
```bash
cd frontend
docker build --build-arg NEXT_PUBLIC_API_URL=https://mishajatt96-todoappapi.hf.space -t todo-frontend .
```

**Run:**
```bash
docker run -d --name todo-frontend -p 3001:3000 -e NEXT_PUBLIC_API_URL=https://mishajatt96-todoappapi.hf.space todo-frontend
```

**Access:** http://localhost:3001

## Update Vercel (Required)

To fix the production frontend on Vercel:

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Update `NEXT_PUBLIC_API_URL`:
   ```
   https://mishajatt96-todoappapi.hf.space
   ```
5. Redeploy

## Docker Commands

```bash
# View running containers
docker ps

# View logs
docker logs todo-frontend

# Stop container
docker stop todo-frontend

# Remove container
docker rm todo-frontend

# Restart
docker restart todo-frontend
```

## Verification

```bash
# Check backend API
curl https://mishajatt96-todoappapi.hf.space/health
# Expected: {"status":"healthy","database":"connected",...}

# Check frontend Docker
curl http://localhost:3001/
# Expected: HTML response

# Check frontend can reach backend (in browser console)
# Go to http://localhost:3001 and check Network tab
```

## Architecture

```
┌─────────────────────────┐
│   Vercel Frontend       │
│   (todo-hackathon-nine) │
└───────────┬─────────────┘
            │ HTTPS
            ▼
┌─────────────────────────┐      ┌─────────────────────┐
│  HuggingFace Space      │      │  Neon PostgreSQL    │
│  (Backend API)          │─────▶│  (Database)         │
│  mishajatt96/todoappapi │      │                     │
└─────────────────────────┘      └─────────────────────┘
            ▲
            │ HTTPS
┌───────────┴─────────────┐
│   Docker Frontend       │
│   (localhost:3001)      │
└─────────────────────────┘
```

## Troubleshooting

**API returns 401 Unauthorized:**
- User not logged in, JWT token missing or expired

**Mixed Content Error:**
- Ensure `NEXT_PUBLIC_API_URL` uses `https://` not `http://`

**Space in Error:**
- Check secrets are set in HuggingFace Space settings
- View logs at https://huggingface.co/spaces/mishajatt96/todoappapi

**Docker build fails:**
- Ensure Docker Desktop is running
- Check available disk space
