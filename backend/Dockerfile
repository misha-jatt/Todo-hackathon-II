# =============================================================
# Production Dockerfile for FastAPI Backend
# Compatible with Railway, HuggingFace Spaces, and local Docker
# =============================================================

# Stage 1: Builder — install dependencies with UV
FROM python:3.13-slim AS builder

WORKDIR /app

# Install build-time system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/* && \
    pip install --no-cache-dir uv

# Copy dependency files first (better layer caching)
COPY pyproject.toml uv.lock ./

# Create src directory for package build
RUN mkdir -p src

# Install production dependencies only
RUN uv sync --no-dev --no-editable || uv sync --no-dev

# =============================================================
# Stage 2: Production — minimal runtime image
# =============================================================
FROM python:3.13-slim

# Prevent Python from writing .pyc files and enable unbuffered output
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app/.venv/bin:$PATH"

WORKDIR /app

# Install runtime-only system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends libpq5 curl && \
    rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder
COPY --from=builder /app/.venv /app/.venv

# Copy application code
COPY . .

# Expose port (Railway injects PORT env var at runtime)
EXPOSE 8000

# Start uvicorn — Railway sets PORT automatically, fallback to 8000
CMD ["sh", "-c", "exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1 --log-level info"]
