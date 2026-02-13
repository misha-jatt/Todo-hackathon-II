# HuggingFace Spaces Deployment Guide

## Quick Start

### Step 1: Create a New Space

1. Go to https://huggingface.co/new-space
2. Fill in:
   - **Owner**: mishajatt96
   - **Space name**: `todoappapi`
   - **License**: MIT
   - **SDK**: Docker
   - **Hardware**: CPU basic (free)
   - **Visibility**: Public

### Step 2: Upload Files

You can either:

**Option A: Git Clone (Recommended)**
```bash
# Clone the space repo
git clone https://huggingface.co/spaces/mishajatt96/todoappapi
cd todoappapi

# Copy backend files (excluding .venv, __pycache__, etc.)
cp -r /path/to/Todo-hackathon-II/backend/* .
rm -rf .venv __pycache__ .pytest_cache *.log

# Commit and push
git add .
git commit -m "Initial deployment"
git push
```

**Option B: Upload via Web UI**
- Go to your space's Files tab
- Upload all files from the `backend/` directory
- Exclude: `.venv/`, `__pycache__/`, `.pytest_cache/`, `*.log`

### Step 3: Set Environment Variables (Secrets)

Go to your Space **Settings** > **Variables and secrets** and add:

| Variable | Value | Type |
|----------|-------|------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string | Secret |
| `JWT_SECRET` | Your JWT secret key (same as current) | Secret |
| `FRONTEND_URL` | `https://todo-hackathon-nine.vercel.app` | Variable |
| `ENVIRONMENT` | `production` | Variable |
| `GEMINI_API_KEY` | Your Gemini API key | Secret |
| `GEMINI_MODEL` | `gemini-2.0-flash-exp` | Variable |
| `GEMINI_BASE_URL` | `https://generativelanguage.googleapis.com/v1beta/openai/` | Variable |

### Step 4: Wait for Build

The Space will automatically build and deploy. Check the **Logs** tab for progress.

### Step 5: Test the API

Once deployed, your API will be available at:
```
https://mishajatt96-todoappapi.hf.space
```

Test it:
```bash
curl https://mishajatt96-todoappapi.hf.space/health
```

Expected response:
```json
{"status": "healthy", "database": "connected", "timestamp": "..."}
```

## Files Required for Deployment

The essential files from `backend/` directory:

```
backend/
├── Dockerfile          # Docker build configuration
├── pyproject.toml      # Python dependencies (UV)
├── uv.lock            # Locked dependencies
├── requirements.txt    # Alternative pip dependencies
├── main.py            # FastAPI application entry
├── api/               # API route handlers
├── core/              # Configuration, database, logging
├── models/            # SQLModel database models
├── services/          # Business logic
├── ai_agent/          # AI agent and tool wrappers
└── chatkit_server.py  # ChatKit SSE server
```

**Do NOT upload:**
- `.venv/` - Virtual environment
- `__pycache__/` - Python cache
- `.pytest_cache/` - Test cache
- `*.log` - Log files
- `.env` - Local environment (use HF Secrets instead)

## Troubleshooting

### Build Fails
- Check the Logs tab for error messages
- Ensure all required files are uploaded
- Verify Dockerfile syntax

### API Returns 500 Errors
- Check DATABASE_URL is correct
- Verify JWT_SECRET matches frontend expectations
- Check Logs for specific error messages

### CORS Errors
- Ensure FRONTEND_URL is exactly `https://todo-hackathon-nine.vercel.app`
- No trailing slash

### Mixed Content Errors
- The API URL must use `https://` (HuggingFace provides this automatically)
- Update Vercel environment variable to use `https://`

## After Deployment

Update your Vercel frontend environment variable:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings > Environment Variables
4. Set `NEXT_PUBLIC_API_URL` to `https://mishajatt96-todoappapi.hf.space`
5. Redeploy
