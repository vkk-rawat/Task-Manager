# Vercel Deployment Guide - Team Task Manager

## Quick Start

### 1. Prerequisites

- Vercel account (sign up at https://vercel.com)
- GitHub account with your repository pushed
- MongoDB Atlas account for database

### 2. Connect Repository to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select the root project folder
4. Click "Deploy"

### 3. Configure Environment Variables

In Vercel dashboard → Settings → Environment Variables, add only:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

**That's all you need!** The API communication works via Vercel's URL rewrites (same-origin).

### 4. Configure Build & Development Settings

- **Build Command:** `npm run build`
- **Install Command:** `npm run install:all`
- **Output Directory:** `client/dist`
- **Node.js Version:** 20.x (or later)

### 5. Deploy

Click "Deploy" and wait for build completion. Your app will be live at `https://your-project.vercel.app`

## Project Structure

```
├── client/              # React Vite frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/              # Express.js backend
│   ├── src/
│   ├── package.json
│   └── vercel.json
├── vercel.json          # Main Vercel config
└── package.json         # Root workspace config
```

## Architecture

- **Frontend:** React + Vite deployed on Vercel
- **Backend:** Express.js API (serverless functions)
- **Database:** MongoDB Atlas
- **Real-time:** Socket.IO compatible

## Key Features

✅ Monorepo support with npm workspaces
✅ Automatic frontend builds and deployment
✅ Express.js backend as Vercel functions
✅ Environment variable support
✅ Socket.IO ready for real-time features
✅ Production-ready security headers

## Deployment Workflow

1. **Local Development:**

   ```bash
   npm run install:all
   npm run dev
   ```

2. **Build Locally (to test):**

   ```bash
   npm run build
   ```

3. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Setup Vercel deployment"
   git push origin main
   ```

4. **Vercel Auto-deploys** on every push to main branch

## Troubleshooting

### Build fails

- Check Node.js version (must be 20.x or higher)
- Verify all dependencies are in package.json
- Check build logs in Vercel dashboard

### API not connecting

- Verify `VITE_API_URL` environment variable
- Check CORS_ORIGIN matches your domain
- Ensure MongoDB connection string is valid

### Frontend 404 errors

- Vercel rewrites all unknown routes to index.html
- This is configured in vercel.json

## Environment Setup

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

Then fill in your actual values.

## Next Steps

1. Create a Vercel account
2. Connect your GitHub repository
3. Add environment variables
4. Deploy!

For more info: https://vercel.com/docs
