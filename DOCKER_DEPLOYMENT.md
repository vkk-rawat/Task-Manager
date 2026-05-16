# Docker Deployment Guide

This guide explains how to deploy the full-stack application using Docker on Railway.

## Files Created

- **Dockerfile** - Multi-stage build that packages both frontend and backend
- **.dockerignore** - Optimizes build by excluding unnecessary files
- **docker-compose.yml** - Local development environment with Docker
- **railway.json** - Updated to use Docker builder

## Local Development with Docker

### Prerequisites

- Docker Desktop installed
- Docker Compose installed

### Running Locally

```bash
# Build and start services
docker-compose up --build

# Service will be available at http://localhost:5000

# Stop services
docker-compose down

# View logs
docker-compose logs -f app
```

The `docker-compose.yml` includes:

- Node.js application on port 5000
- MongoDB database on port 27017
- Volume mounts for live development
- Health checks for services

## Deployment on Railway

### Prerequisites

1. Railway account at https://railway.app
2. Docker image configured
3. MongoDB database provisioned on Railway

### Environment Variables

Set these on Railway:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-railway-mongodb-uri>
JWT_SECRET=<your-secure-jwt-secret>
JWT_EXPIRY=7d
CORS_ORIGIN=https://your-production-domain.com
```

### Deployment Steps

1. **Connect Repository**
   - Link your GitHub repository to Railway
   - Select the main branch

2. **Configure Build**
   - Railway will detect the Dockerfile
   - Docker builder will automatically be used
   - No additional build configuration needed

3. **Add MongoDB Plugin**
   - Click "Add" in Railway dashboard
   - Search for "MongoDB"
   - Click "Provision" to create a database
   - The `MONGODB_URI` will be automatically added to your environment

4. **Set Environment Variables**
   - Go to Variables tab
   - Add all required variables (see above)

5. **Deploy**
   - Trigger a deployment from the Railway dashboard
   - Railway will build the Docker image
   - Automatically restart on deployment success

### How It Works

The Dockerfile uses a **multi-stage build**:

1. **Stage 1: Frontend Builder**
   - Installs dependencies
   - Builds the Vite frontend (`npm run build`)
   - Creates optimized production bundle

2. **Stage 2: Final Image**
   - Installs only server dependencies
   - Copies built frontend from Stage 1
   - Serves frontend as static files from the backend
   - Runs a single Node.js process

**Result:** A single container serving both frontend and backend, reducing costs and complexity.

## Build Optimization

The Dockerfile is optimized for:

- **Small image size**: ~300-400MB (depends on dependencies)
- **Fast builds**: Frontend built once, reused in final image
- **Production ready**: No dev dependencies, minified code
- **Health checks**: Automatic health monitoring

## File Structure in Container

```
/app/
├── package.json
├── package-lock.json
├── server/
│   ├── src/
│   ├── package.json
│   └── public/            ← Frontend static files
│       ├── index.html
│       ├── assets/
│       └── ...
└── client/
    └── (not needed in production)
```

## Monitoring & Logs

Monitor your deployment on Railway:

1. View logs: Dashboard → Logs tab
2. Check metrics: Dashboard → Metrics tab
3. Restart service: Dashboard → Settings → Restart

## Troubleshooting

### Build Fails

- Check Docker build logs in Railway
- Verify all environment variables are set
- Ensure MongoDB URI is correct

### App Crashes

- Check server logs for errors
- Verify `MONGODB_URI` is accessible
- Check port availability (should be 5000)

### Static Files Not Served

- Verify `NODE_ENV=production` is set
- Check that frontend built successfully
- Look for `/public` directory in container

## Advanced Configuration

### Custom Port

Set `PORT` environment variable (default: 5000)

### CORS Configuration

Update `corsOrigins` in `server/src/config/env.js` for your domain

### Database Backups

Configure automated MongoDB backups in Railway dashboard

## Rolling Back

To rollback to a previous version:

1. Go to Railway dashboard
2. Click deployment history
3. Select previous deployment
4. Click "Redeploy"

## Performance Tips

1. **MongoDB Indexes**: Ensure indexes are created for frequently queried fields
2. **Caching**: Consider adding Redis for session/cache management
3. **CDN**: Use Railway's edge network or add a CDN for static assets
4. **Database Optimization**: Monitor slow queries and optimize them

## Security

- Store secrets in Railway environment variables (never in code)
- Use HTTPS (automatic on Railway)
- Implement rate limiting (already configured in app)
- Keep dependencies updated

## Support

For issues:

1. Check Railway documentation: https://docs.railway.app
2. Review app logs in Railway dashboard
3. Check health endpoint: `https://your-app.railway.app/api/health`
