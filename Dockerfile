# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy client source
COPY client ./client

# Install all dependencies for building
RUN npm ci

# Build frontend
RUN npm run build --workspace client

# Stage 2: Build and run backend with frontend
FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy server source
COPY server ./server

# Install server dependencies
RUN npm ci --workspace server

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/client/dist ./server/public

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)}).on('error', (e) => {throw e})"

# Start the server
CMD ["npm", "start", "--workspace", "server"]
