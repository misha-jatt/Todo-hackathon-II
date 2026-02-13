# Multi-stage Dockerfile for Next.js Frontend (Standalone Node.js)
# Configured to connect to HuggingFace Space API

# Stage 1: Build stage - Install dependencies and build Next.js app
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@latest

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build argument for API URL (passed at build time)
ARG NEXT_PUBLIC_API_URL=https://mishajatt96-todoappapi.hf.space
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Build Next.js application with the API URL baked in
RUN pnpm build

# Stage 2: Production stage - Run standalone Next.js server
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nextjs && \
    adduser -S -D -H -u 1001 -h /app -s /sbin/nologin -G nextjs -g nextjs nextjs

# Copy standalone output from builder
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nextjs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Set environment to production
ENV NODE_ENV=production

# Runtime environment variable (can be overridden)
ARG NEXT_PUBLIC_API_URL=https://mishajatt96-todoappapi.hf.space
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Start the Next.js standalone server
CMD ["node", "server.js"]
