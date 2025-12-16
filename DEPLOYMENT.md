# Deployment Guide

## Prerequisites

- Node.js 18+ or compatible runtime
- npm or yarn package manager
- Minimum 2GB RAM
- 10GB disk space

## Production Build

### Step 1: Install Dependencies

```bash
npm install --production
```

### Step 2: Build Standalone Output

```bash
npm run build
```

This creates an optimized standalone build in `.next/standalone/` directory.

### Step 3: Verify Build

Check that these directories exist:
- `.next/standalone/` - Standalone server files
- `.next/static/` - Static assets
- `public/` - Public assets

## Deployment Methods

### Method 1: Standalone Server (Recommended)

The standalone output includes everything needed to run the application.

```bash
# Navigate to standalone directory
cd .next/standalone

# Start the server
node server.js
```

By default, the server runs on port 3000. Configure with environment variables:

```bash
PORT=8080 node server.js
```

### Method 2: Docker Container

#### Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
```

#### Build and Run Docker Image

```bash
# Build image
docker build -t job-magician:latest .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your_database_url" \
  -e REDIS_URL="your_redis_url" \
  job-magician:latest
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  job-magician:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Run with:
```bash
docker-compose up -d
```

### Method 3: Kubernetes

#### Deployment Configuration

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: job-magician
  labels:
    app: job-magician
spec:
  replicas: 3
  selector:
    matchLabels:
      app: job-magician
  template:
    metadata:
      labels:
        app: job-magician
    spec:
      containers:
      - name: job-magician
        image: job-magician:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: job-magician-secrets
              key: database-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: job-magician-service
spec:
  selector:
    app: job-magician
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
```

Deploy:
```bash
kubectl apply -f k8s/deployment.yaml
```

### Method 4: Process Manager (PM2)

For simple VPS deployments:

#### Install PM2

```bash
npm install -g pm2
```

#### Create ecosystem.config.js

```javascript
module.exports = {
  apps: [{
    name: 'job-magician',
    script: './server.js',
    cwd: './.next/standalone',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    merge_logs: true
  }]
}
```

#### Start Application

```bash
# Start
pm2 start ecosystem.config.js

# Save process list
pm2 save

# Setup startup script
pm2 startup
```

## Reverse Proxy Configuration

### Nginx

Create `/etc/nginx/sites-available/job-magician`:

```nginx
server {
    listen 80;
    server_name job-magician.example.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name job-magician.example.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/job-magician.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/job-magician.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /public {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=3600";
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/job-magician /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Caddy

Create `Caddyfile`:

```caddy
job-magician.example.com {
    reverse_proxy localhost:3000
    
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
    
    encode gzip
}
```

Start Caddy:
```bash
caddy run --config Caddyfile
```

## Environment Configuration

### Production Environment Variables

Create `.env.production`:

```bash
# Application
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_NAME=Job-Magician
NEXT_PUBLIC_APP_VERSION=1.0.0

# API Configuration
NEXT_PUBLIC_API_URL=https://api.job-magician.example.com

# Database (when Deno backend is integrated)
DATABASE_URL=postgresql://user:password@localhost:5432/jobmagician

# Redis (optional, for caching)
REDIS_URL=redis://localhost:6379

# Security
SESSION_SECRET=your-session-secret-here
JWT_SECRET=your-jwt-secret-here

# Texas Workforce Solutions API
TWS_API_KEY=your-tws-api-key
TWS_API_URL=https://api.texasworkforce.gov

# Monitoring (optional)
SENTRY_DSN=your-sentry-dsn
```

**Important**: Never commit `.env` files to version control!

## Health Checks

Add a health check endpoint for monitoring:

Create `app/api/health/route.ts`:

```typescript
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    uptime: process.uptime()
  })
}
```

## Monitoring Setup

### Application Logs

```bash
# PM2 logs
pm2 logs job-magician

# Docker logs
docker logs job-magician

# Kubernetes logs
kubectl logs -f deployment/job-magician
```

### Performance Monitoring

Consider integrating:
- **New Relic**: Application performance monitoring
- **Datadog**: Infrastructure and application monitoring
- **Prometheus + Grafana**: Self-hosted metrics
- **Sentry**: Error tracking

## Backup Procedures

### Database Backups (when integrated)

```bash
# PostgreSQL backup
pg_dump -U username jobmagician > backup_$(date +%Y%m%d).sql

# Automated daily backups
0 2 * * * pg_dump -U username jobmagician | gzip > /backups/jobmagician_$(date +\%Y\%m\%d).sql.gz
```

### Application Backups

```bash
# Backup entire application directory
tar -czf job-magician-backup-$(date +%Y%m%d).tar.gz /path/to/job-magician

# Backup .env and configuration
cp .env.production /backups/.env.production.$(date +%Y%m%d)
```

## Scaling

### Horizontal Scaling

1. **Load Balancer**: Deploy multiple instances behind a load balancer
2. **Session Management**: Use Redis for shared session storage
3. **Static Assets**: Use CDN for static asset delivery

### Vertical Scaling

- **CPU**: Increase instance CPU for compute-heavy operations
- **Memory**: Add RAM for caching and concurrent users
- **Storage**: Upgrade to SSD for faster I/O

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### Build Failures
```bash
# Clean build cache
rm -rf .next node_modules
npm install
npm run build
```

#### Memory Issues
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Performance Issues

1. Check application logs
2. Monitor resource usage (CPU, memory, disk)
3. Review database query performance
4. Check network latency
5. Verify CDN configuration

## Security Checklist

- [ ] HTTPS/TLS enabled with valid certificates
- [ ] Environment variables secured (not in code)
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Database credentials rotated regularly
- [ ] Firewall configured (only necessary ports open)
- [ ] Regular security updates applied
- [ ] Backup procedures tested
- [ ] Monitoring and alerting configured
- [ ] Incident response plan documented

## Rollback Procedures

### Quick Rollback

```bash
# PM2
pm2 stop job-magician
pm2 start previous-version

# Docker
docker stop job-magician
docker run -d --name job-magician job-magician:previous-tag

# Kubernetes
kubectl rollout undo deployment/job-magician
```

## Support

For deployment issues:
- GitHub Issues: [Report an issue](https://github.com/pinkycollie/VercelGuideline/issues)
- Documentation: [Architecture Guide](./ARCHITECTURE.md)

---

**Last Updated**: December 2025
