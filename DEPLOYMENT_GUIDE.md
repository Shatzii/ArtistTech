# Artist Tech - Deployment Guide

## Quick Deployment Summary

### Platform Status: Production Ready ✅
- **Full-Stack Implementation**: Complete backend API integration
- **25+ Professional Endpoints**: All studios fully functional
- **19 AI Engines**: Self-hosted artificial intelligence system
- **Real-time Features**: WebSocket communication and collaboration
- **Professional Hardware**: Industry-standard controller support

## Replit Deployment (Recommended)

### 1. Repository Setup
```bash
# Clone the repository
git clone https://github.com/artisttech/platform.git
cd platform

# Verify all files are present
ls -la
# Should show: package.json, server/, client/, shared/, uploads/, etc.
```

### 2. Environment Configuration
Create `.env` file:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:5432/artisttech
PGHOST=your-postgres-host
PGPORT=5432
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=artisttech

# Session Security
SESSION_SECRET=your-secure-session-secret-here

# Optional AI API Keys (for enhanced features)
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# Replit Configuration (auto-configured in Replit)
REPL_ID=auto-generated
REPLIT_DOMAINS=your-repl-domain.replit.app
ISSUER_URL=https://replit.com/oidc
```

### 3. Replit Configuration Files

#### `.replit`
```toml
modules = ["nodejs-20", "web", "postgresql-16"]

[deployment]
run = ["npm", "run", "start"]
build = ["npm", "run", "build"] 
deploymentTarget = "autoscale"

[[ports]]
localPort = 5000
externalPort = 80
exposeLocalhost = true

[nix]
channel = "stable-24_05"
```

### 4. Database Setup
```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Verify database connection
npm run db:studio
```

### 5. Development Server
```bash
# Start development server (automatically configured)
npm run dev

# Server will start on port 5000 with:
# - Frontend: React with Vite HMR
# - Backend: Express with TypeScript
# - Database: PostgreSQL with Drizzle ORM
# - WebSockets: Real-time communication
# - AI Engines: 19 self-hosted models
```

### 6. Production Deployment
```bash
# Build for production
npm run build

# Start production server
npm run start

# Server automatically handles:
# - Static file serving
# - API endpoint routing  
# - WebSocket connections
# - Database migrations
# - AI engine initialization
```

## Manual Deployment (Alternative)

### System Requirements
- **Node.js**: 20+
- **PostgreSQL**: 16+
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 10GB minimum (50GB recommended)
- **Network**: Stable internet connection

### Installation Steps
```bash
# 1. Clone repository
git clone https://github.com/artisttech/platform.git
cd platform

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Setup database
createdb artisttech
npm run db:push

# 5. Build application
npm run build

# 6. Start production server
npm run start
```

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/artisttech
    depends_on:
      - db
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:16
    environment:
      - POSTGRES_DB=artisttech
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## Production Configuration

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support for real-time features
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }
}
```

### PM2 Configuration
```json
{
  "apps": [{
    "name": "artisttech",
    "script": "npm",
    "args": "start",
    "cwd": "/path/to/artisttech",
    "env": {
      "NODE_ENV": "production",
      "PORT": "5000"
    },
    "instances": 4,
    "exec_mode": "cluster",
    "max_memory_restart": "1G",
    "log_date_format": "YYYY-MM-DD HH:mm Z",
    "error_file": "./logs/pm2-error.log",
    "out_file": "./logs/pm2-out.log",
    "log_file": "./logs/pm2-combined.log"
  }]
}
```

## Health Checks & Monitoring

### Health Check Endpoint
```bash
# Check application health
curl http://localhost:5000/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-01-31T...",
  "uptime": 12345,
  "services": {
    "database": "connected",
    "ai_engines": "19/19 online",
    "websockets": "active"
  }
}
```

### Monitoring Dashboard
Access real-time monitoring at:
- **Studio Status**: `/api/studios/status`
- **System Health**: `/api/health`
- **AI Engine Status**: `/api/ai/status`
- **User Analytics**: `/api/analytics/dashboard`

## Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check database status
pg_isready -h localhost -p 5432

# Verify environment variables
echo $DATABASE_URL

# Test connection
npm run db:studio
```

#### AI Engines Not Loading
```bash
# Check AI engine status
curl http://localhost:5000/api/ai/status

# Restart AI services
npm run restart:ai

# Check logs
tail -f logs/ai-engines.log
```

#### WebSocket Connection Issues
```bash
# Check WebSocket servers
netstat -tlnp | grep :808

# Test WebSocket connection
wscat -c ws://localhost:8081

# Restart WebSocket services
npm run restart:websockets
```

#### File Upload Problems
```bash
# Check upload directory permissions
ls -la uploads/
chmod 755 uploads/

# Verify storage space
df -h

# Check file size limits
grep -r "fileSize" server/
```

### Performance Optimization

#### Database Optimization
```sql
-- Update database statistics
ANALYZE;

-- Reindex tables
REINDEX DATABASE artisttech;

-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

#### Application Performance
```bash
# Monitor CPU and memory usage
top -p $(pgrep -f "npm.*start")

# Check application metrics
curl http://localhost:5000/api/metrics

# Profile application
npm run profile
```

## Backup & Recovery

### Database Backup
```bash
# Create backup
pg_dump artisttech > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql artisttech < backup_20250131_123000.sql
```

### File Backup
```bash
# Backup uploads directory
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/

# Restore uploads
tar -xzf uploads_backup_20250131.tar.gz
```

## Scaling Considerations

### Horizontal Scaling
- **Load Balancer**: Distribute traffic across multiple instances
- **Database Clustering**: PostgreSQL read replicas for better performance
- **CDN Integration**: Global content delivery for static assets
- **Microservices**: Split AI engines into separate services

### Vertical Scaling
- **CPU**: Increase cores for AI processing
- **RAM**: More memory for concurrent users
- **Storage**: NVMe SSDs for better I/O performance
- **Network**: Higher bandwidth for streaming features

---

## Support

For deployment assistance:
- **Technical Support**: tech@artisttech.com
- **Documentation**: [docs.artisttech.com](https://docs.artisttech.com)
- **Community**: [discord.gg/artisttech](https://discord.gg/artisttech)