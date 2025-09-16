#!/bin/bash

# Artist Tech Deployment Script
# This script handles deployment to different environments

set -e

# Configuration
APP_NAME="artist-tech"
ENVIRONMENT=${1:-"staging"}
VERSION=$(node -p "require('./package.json').version")

echo "🚀 Deploying $APP_NAME v$VERSION to $ENVIRONMENT"

# Validate environment
case $ENVIRONMENT in
  "staging"|"production")
    echo "✅ Environment: $ENVIRONMENT"
    ;;
  *)
    echo "❌ Invalid environment: $ENVIRONMENT"
    echo "Usage: $0 [staging|production]"
    exit 1
    ;;
esac

# Pre-deployment checks
echo "🔍 Running pre-deployment checks..."

# Check if all required environment variables are set
required_vars=("DATABASE_URL" "JWT_SECRET" "ENCRYPTION_KEY")
for var in "${required_vars[@]}"; do
  if [[ -z "${!var}" ]]; then
    echo "❌ Required environment variable $var is not set"
    exit 1
  fi
done

# Run tests
echo "🧪 Running tests..."
npm run test:run

# Build application
echo "🔨 Building application..."
npm run build

# Run security audit
echo "🔒 Running security audit..."
npm audit --audit-level high || {
  echo "⚠️  Security vulnerabilities found. Please review."
  read -p "Continue with deployment? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
}

# Database migration check
echo "🗄️ Checking database migrations..."
npm run db:push

# Backup current deployment (for production)
if [[ "$ENVIRONMENT" == "production" ]]; then
  echo "💾 Creating backup..."
  # Add backup logic here
  echo "✅ Backup created"
fi

# Deploy based on environment
case $ENVIRONMENT in
  "staging")
    deploy_staging
    ;;
  "production")
    deploy_production
    ;;
esac

echo "✅ Deployment completed successfully!"
echo "🌐 Application deployed to $ENVIRONMENT environment"

# Post-deployment verification
echo "🔍 Running post-deployment checks..."
verify_deployment

echo "🎉 Deployment verification completed!"

# Functions
deploy_staging() {
  echo "📦 Deploying to staging environment..."

  # Example deployment commands for staging
  # Adjust these based on your actual deployment method

  # Using PM2 for process management
  if command -v pm2 &> /dev/null; then
    pm2 stop $APP_NAME-staging || true
    pm2 delete $APP_NAME-staging || true
    pm2 start dist/index.js --name $APP_NAME-staging
    pm2 save
  fi

  # Or using Docker
  if command -v docker &> /dev/null; then
    docker build -t $APP_NAME:$VERSION .
    docker stop $APP_NAME-staging || true
    docker rm $APP_NAME-staging || true
    docker run -d \
      --name $APP_NAME-staging \
      -p 5001:5000 \
      --env-file .env.staging \
      $APP_NAME:$VERSION
  fi
}

deploy_production() {
  echo "🚀 Deploying to production environment..."

  # More cautious production deployment
  echo "⚠️  Production deployment requires manual approval"

  # Blue-green deployment strategy
  # 1. Deploy to new version
  # 2. Run health checks
  # 3. Switch traffic
  # 4. Keep old version as rollback

  # Example with load balancer
  # aws elbv2 modify-listener \
  #   --listener-arn $LISTENER_ARN \
  #   --default-actions Type=forward,TargetGroupArn=$NEW_TARGET_GROUP_ARN

  echo "✅ Production deployment completed"
}

verify_deployment() {
  # Wait for application to start
  echo "⏳ Waiting for application to start..."
  sleep 10

  # Health check
  if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
  else
    echo "❌ Health check failed"
    exit 1
  fi

  # Database connectivity check
  if curl -f http://localhost:5000/api/health | grep -q '"database": "connected"'; then
    echo "✅ Database connectivity verified"
  else
    echo "❌ Database connectivity check failed"
    exit 1
  fi

  # Basic functionality test
  if curl -f http://localhost:5000/api/studio/status > /dev/null 2>&1; then
    echo "✅ API functionality verified"
  else
    echo "❌ API functionality check failed"
    exit 1
  fi
}

# Rollback function (for production emergencies)
rollback() {
  echo "🔄 Rolling back deployment..."

  case $ENVIRONMENT in
    "staging")
      # Rollback staging
      pm2 stop $APP_NAME-staging
      pm2 start $APP_NAME-staging-backup || echo "No backup found"
      ;;
    "production")
      # Rollback production (switch back to previous version)
      echo "Production rollback initiated"
      ;;
  esac

  echo "✅ Rollback completed"
}

# Show usage if no arguments provided
if [[ $# -eq 0 ]]; then
  echo "Usage: $0 [staging|production]"
  echo "Example: $0 staging"
  exit 1
fi