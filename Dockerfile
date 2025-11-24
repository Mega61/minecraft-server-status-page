# Dockerfile for KUMAFORCE Minecraft Server Web Application
# Multi-stage build for optimized production image

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Clear any npm auth tokens and force public registry
RUN npm config delete //registry.npmjs.org/:_authToken || true && \
    npm config set registry https://registry.npmjs.org/ && \
    npm config set //registry.npmjs.org/:_authToken ""

# Install dependencies
RUN npm ci --only=production --registry=https://registry.npmjs.org/

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Clear any npm auth tokens and force public registry
RUN npm config delete //registry.npmjs.org/:_authToken || true && \
    npm config set registry https://registry.npmjs.org/ && \
    npm config set //registry.npmjs.org/:_authToken ""

# Install all dependencies (including devDependencies for build)
RUN npm ci --registry=https://registry.npmjs.org/

# Copy source code
COPY . .

# Build the Next.js application
# This creates the optimized production build
RUN npm run build

# Stage 3: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy the Next.js build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Set hostname to localhost
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Start the application
CMD ["node", "server.js"]
