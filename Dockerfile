# syntax=docker/dockerfile:1
# Multi-stage Dockerfile for production deployment
# Optimized for Vite + React frontend

# Read Node.js version from .node-version file (default fallback)
ARG NODE_VERSION=22.12.0
FROM docker.io/library/node:${NODE_VERSION}-alpine AS base

# Set working directory
WORKDIR /app

# Set production environment
ENV NODE_ENV=production \
    PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH"

# Install pnpm (faster than npm for production)
RUN corepack enable && corepack prepare pnpm@latest --activate

# ============================================================================
# Build stage - install dependencies and build
# ============================================================================
FROM base AS build

# Install build dependencies
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile || npm ci --only=production

# Copy application code
COPY . .

# Build application
RUN pnpm run build || npm run build

# ============================================================================
# Production stage - serve static files with nginx
# ============================================================================
FROM docker.io/library/nginx:alpine AS production

# Copy custom nginx configuration
COPY --from=build /app/config/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

