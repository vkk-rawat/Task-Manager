# Docker Deployment Guide

This guide explains how to deploy the full-stack application using Docker, running both frontend and backend together.

## Quick Start (Local Development)

### Prerequisites

- Docker Desktop installed
- Docker Compose installed

### Run Everything with One Command

```bash
# Build and start both frontend + backend + database
docker-compose up --build

# App will be available at http://localhost:5000
# API available at http://localhost:5000/api
# Database available at localhost:27017
```

That's it! Both frontend and backend run together in a single container.

### Stop Everything

```bash
docker-compose down

# Remove volumes (clears database)
docker-compose down -v
```

## Environment Variables

All environment variables are stored in a single file: **`.env.docker`**

```bash
# Development (local Docker)
.env.docker

# Production (Railway deployment)
.env.production
```

### For Local Development (`.env.docker`)

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://mongo:27017/team-task-manager
JWT_SECRET=your-dev-secret-key-change-this-in-production-min-24-chars
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
```

### For Production (Railway)

Copy `.env.production` and set real values:

```
NODE_ENV=production
MONGO_URI=<railway-mongodb-uri>
JWT_SECRET=<secure-random-string-min-24-chars>
FRONTEND_URL=https://your-production-domain.com
```

## How It Works

### Multi-Stage Docker Build

The `Dockerfile` uses a 2-stage build:

1. **Stage 1: Frontend Builder**
   - Builds React app with Vite
   - Optimizes and minifies code
   - Output: `/dist` folder

2. **Stage 2: Final Image**
   - Installs only server dependencies
   - Copies built frontend into `/server/public`
   - Serves frontend as static files through Express
   - **Result:** Single container with both frontend + backend

### Docker Compose Setup

The `docker-compose.yml` runs 2 services:

```
mongo (database)
  └─ Port 27017
     └─ Health check every 10s

app (frontend + backend)
  └─ Port 5000
     └─ Depends on mongo health check
     └─ Loads .env.docker variables
```

## Files Changed

These files were created/modified to run everything together:

1. **Dockerfile** - Multi-stage build for frontend + backend
2. **.dockerignore** - Optimizes build speed
3. **docker-compose.yml** - Runs all services together
4. **.env.docker** - Development environment variables
5. **.env.production** - Production environment variables
6. **server/src/app.js** - Updated to serve frontend files

## Deployment on Railway

### Step 1: Prepare Repository

```bash
# Push to GitHub with all Docker files
git add .
git commit -m "Add Docker setup for unified deployment"
git push
```

### Step 2: Create Railway Project

1. Go to https://railway.app
2. Click "Create Project"
3. Connect your GitHub repository
4. Select main branch

### Step 3: Add MongoDB

1. Click "Add" in Railway dashboard
2. Search for "MongoDB"
3. Click "Provision"
4. `MONGO_URI` automatically added to environment

### Step 4: Set Environment Variables

Go to "Variables" tab and add:

```
NODE_ENV=production
PORT=5000
JWT_SECRET=your-secure-random-string-min-24-characters
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-production-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
```

### Step 5: Deploy

Railway will:

- Detect `Dockerfile` automatically
- Build the Docker image
- Copy frontend into backend
- Start the single container
- Serve everything from one URL

## Verify Deployment

After deployment, test these endpoints:

```bash
# Health check
curl https://your-app.railway.app/api/health

# Frontend (should load UI)
curl https://your-app.railway.app/

# API
curl https://your-app.railway.app/api/auth
```

## Troubleshooting

### Build Fails Locally

```bash
# Clean everything and rebuild
docker-compose down -v
docker-compose up --build

# Check logs
docker-compose logs -f app
```

### Database Connection Error

```bash
# Verify MongoDB is running
docker-compose logs mongo

# Check MONGO_URI is correct in .env.docker
# Should be: mongodb://mongo:27017/team-task-manager
```

### Frontend Not Loading

```bash
# Verify frontend built successfully
docker-compose logs app | grep "build"

# Check if public folder exists in container
docker exec team-task-manager-app ls -la /app/server/public/
```

### Port Already in Use

```bash
# Find what's using port 5000
lsof -i :5000

# Or use different port in docker-compose.yml
# Change "5000:5000" to "3000:5000"
```

## Production Checklist

- [ ] Set secure `JWT_SECRET` (min 24 characters)
- [ ] Set correct `FRONTEND_URL` (your domain)
- [ ] Configure MongoDB Atlas (or Railway MongoDB)
- [ ] Enable CORS for your domain in server
- [ ] Set up SSL/HTTPS (Railway does this automatically)
- [ ] Configure backups for database
- [ ] Monitor logs regularly
- [ ] Set up error tracking (optional)

## Key Benefits

✅ **Single deployment** - No separate frontend/backend deployments
✅ **Unified environment** - One set of environment variables
✅ **Lower costs** - Single Railway container instead of two
✅ **Faster deploys** - Frontend and backend deploy together
✅ **Simplified setup** - One docker-compose command to run locally
✅ **Production ready** - Optimized multi-stage Docker build

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Docker Documentation](https://docs.docker.com)
- [Docker Compose Documentation](https://docs.docker.com/compose)
- [Express Static Files](https://expressjs.com/en/starter/static-files.html)
