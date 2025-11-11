# Frontend Docker Deployment Guide

Complete guide for deploying Luxe Threads Frontend using Docker.

## Overview

This guide covers:
- Building production Docker images
- Running with Docker Compose
- Environment configuration
- Health checks and monitoring
- Production best practices

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

## Quick Start

### 1. Configure Environment Variables

Create a `.env.production` file (optional):

```bash
cd luxethreads
# Environment variables can be set here or passed to docker-compose
FRONTEND_PORT=80
NODE_VERSION=24.11.0
```

### 2. Build and Start

**Version Management:**
The project uses version files (similar to `.nvmrc` for Node.js):
- `.node-version` - Node.js version (currently: 24.11.0)

This version is automatically read by the build scripts.

**Build Options:**

```bash
# Option 1: Use build script (reads from .node-version)
./docker-build.sh

# Option 2: Use docker-compose build script
./docker-compose.build.sh

# Option 3: Manual build (version from file)
docker build \
  --build-arg NODE_VERSION=$(cat .node-version) \
  -t luxethreads-frontend:latest .

# Option 4: Use docker-compose for full stack
docker-compose -f docker-compose.production.yml up -d --build
```

## Docker Compose Deployment

### Full Stack

```bash
# Start service
docker-compose -f docker-compose.production.yml up -d

# View logs
docker-compose -f docker-compose.production.yml logs -f

# Stop service
docker-compose -f docker-compose.production.yml down
```

### Environment Variables

Set variables in `.env.production` or export them:

```bash
export FRONTEND_PORT=80
export NODE_VERSION=24.11.0
```

Or use a `.env` file:

```bash
docker-compose -f docker-compose.production.yml --env-file .env.production up -d
```

## Manual Docker Deployment

### Build Image

**Recommended:** Use the build script that reads from version file:

```bash
./docker-build.sh
```

**Manual build** (reading version from file):

```bash
docker build \
  --build-arg NODE_VERSION=$(cat .node-version) \
  -t luxethreads-frontend:latest \
  .
```

**Manual build** (with explicit version):

```bash
docker build \
  --build-arg NODE_VERSION=24.11.0 \
  -t luxethreads-frontend:latest \
  .
```

### Run Container

```bash
docker run -d \
  --name luxethreads_frontend \
  -p 80:80 \
  --restart unless-stopped \
  luxethreads-frontend:latest
```

## Health Checks

The application includes health check endpoints:

```bash
# Check application health
curl http://localhost/health

# Response:
healthy
```

## Monitoring

### View Logs

```bash
# All services
docker-compose -f docker-compose.production.yml logs -f

# Specific service
docker-compose -f docker-compose.production.yml logs -f frontend

# Last 100 lines
docker-compose -f docker-compose.production.yml logs --tail=100 frontend
```

### Container Status

```bash
# Check container status
docker-compose -f docker-compose.production.yml ps

# Container health
docker inspect luxethreads_frontend | grep -A 10 Health
```

### Resource Usage

```bash
# Container stats
docker stats luxethreads_frontend

# Disk usage
docker system df
```

## Production Best Practices

### 1. Security

- ✅ Use HTTPS in production (configure nginx with SSL)
- ✅ Set security headers (already configured)
- ✅ Keep images updated
- ✅ Use non-root user (nginx runs as nginx user)

### 2. Performance

- ✅ Enable gzip compression (already configured)
- ✅ Cache static assets (already configured)
- ✅ Optimize build with production mode
- ✅ Use CDN for static assets (optional)

### 3. Scaling

```bash
# Scale frontend containers
docker-compose -f docker-compose.production.yml up -d --scale frontend=3

# Use load balancer (nginx) to distribute traffic
```

## Nginx Configuration

The Docker image includes a custom nginx configuration optimized for React SPA:

- **SPA Routing:** All routes serve `index.html` for React Router
- **Static Assets:** Cached for 1 year
- **Gzip Compression:** Enabled for all text-based files
- **Security Headers:** X-Frame-Options, X-Content-Type-Options, etc.

### SSL Setup

1. Place SSL certificates in `config/ssl/`:
   - `cert.pem` - Certificate
   - `key.pem` - Private key

2. Update `config/nginx.conf` to enable HTTPS:

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    # ... rest of config
}
```

3. Rebuild and restart:
```bash
docker-compose -f docker-compose.production.yml build frontend
docker-compose -f docker-compose.production.yml up -d frontend
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose -f docker-compose.production.yml logs frontend

# Check environment variables
docker-compose -f docker-compose.production.yml exec frontend env
```

### Build Failures

```bash
# Clean build (no cache)
docker build --no-cache -t luxethreads-frontend:latest .

# Check build logs
docker build -t luxethreads-frontend:latest . 2>&1 | tee build.log
```

### Memory Issues

```bash
# Check memory usage
docker stats

# Increase memory limits in docker-compose.yml
# Add to frontend service:
deploy:
  resources:
    limits:
      memory: 512M
```

### 404 Errors on Routes

This is normal for React Router. The nginx config handles this by serving `index.html` for all routes. If you see 404s:

1. Check nginx config is correct
2. Verify `try_files $uri $uri/ /index.html;` is present
3. Rebuild the image

## Updating Application

```bash
# Pull latest code
git pull

# Rebuild image
docker-compose -f docker-compose.production.yml build frontend

# Restart with new image
docker-compose -f docker-compose.production.yml up -d frontend
```

## Environment-Specific Configs

### Development

```bash
# Use Vite dev server (not Docker)
npm run dev
```

### Staging

```bash
docker-compose -f docker-compose.production.yml --env-file .env.staging up -d
```

### Production

```bash
docker-compose -f docker-compose.production.yml --env-file .env.production up -d
```

## Version Management

The project uses `.node-version` file (similar to `.nvmrc`):

```bash
# Check current version
cat .node-version

# Update version (if needed)
echo "24.11.0" > .node-version

# Rebuild with new version
./docker-build.sh
```

## Security Checklist

- [ ] Enable SSL/TLS in production
- [ ] Set proper CORS headers if needed
- [ ] Configure rate limiting (via nginx or load balancer)
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity
- [ ] Use non-root user (already configured)
- [ ] Limit container resources

## Support

For deployment issues:
- Check logs: `docker-compose logs -f`
- Verify environment variables
- Test health endpoint: `curl http://localhost/health`
- Check nginx configuration

