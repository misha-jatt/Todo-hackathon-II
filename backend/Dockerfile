# Multi-stage Dockerfile for FastAPI Backend
# Optimized for HuggingFace Spaces deployment

# Stage 1: Builder stage - Install dependencies with UV
FROM python:3.13-slim AS builder

# Set working directory
WORKDIR /app

# Install system dependencies and UV
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gcc \
        libpq-dev \
        && rm -rf /var/lib/apt/lists/* && \
    pip install --no-cache-dir uv

# Copy dependency files first for better caching
COPY pyproject.toml ./
COPY uv.lock ./

# Create src directory for package build (may not exist yet)
RUN mkdir -p src

# Install dependencies
RUN uv sync --no-dev --no-editable || uv sync --no-dev

# Stage 2: Production stage - Copy dependencies and run application
FROM python:3.13-slim

# Set environment variables
# HuggingFace Spaces uses port 7860 by default
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app/.venv/bin:$PATH" \
    PORT=7860

# Set working directory
WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libpq5 \
        curl \
        && rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder
COPY --from=builder /app/.venv /app/.venv

# Copy application code
COPY . .

# Create startup script that loads HuggingFace secrets
RUN echo '#!/bin/bash\n\
echo "===== Application Startup at $(date) ====="\n\
echo "Loading environment variables..."\n\
# HuggingFace passes secrets as environment variables directly\n\
# Print debug info (without values)\n\
echo "DATABASE_URL is set: $([ -n \"$DATABASE_URL\" ] && echo yes || echo no)"\n\
echo "JWT_SECRET is set: $([ -n \"$JWT_SECRET\" ] && echo yes || echo no)"\n\
echo "FRONTEND_URL is set: $([ -n \"$FRONTEND_URL\" ] && echo yes || echo no)"\n\
# Start the application\n\
exec uvicorn main:app --host 0.0.0.0 --port 7860\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expose port (HuggingFace Spaces default is 7860)
EXPOSE 7860

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:7860/health || exit 1

# Run via startup script
CMD ["/app/start.sh"]
