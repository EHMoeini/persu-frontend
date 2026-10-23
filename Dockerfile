# ==============================================================================
# Production Dockerfile for Frontend Service (Next.js)
# Designed for standalone deployment and integration within a microservices setup
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Install dependencies
# ------------------------------------------------------------------------------
FROM oven/bun:1-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy dependency manifests
COPY package.json bun.lock ./

# Install all dependencies (including devDependencies needed for build)
RUN bun install --frozen-lockfile

# ------------------------------------------------------------------------------
# Stage 2: Build the Next.js application
# ------------------------------------------------------------------------------
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Copy installed dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy full application source
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build Next.js application with standalone output
RUN bun run build

# ------------------------------------------------------------------------------
# Stage 3: Minimal production runtime
# ------------------------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Network configuration for container orchestration / reverse proxies
# Binding to 0.0.0.0 ensures the frontend service is reachable within Docker networks
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create a non-root system user and group for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and public assets
COPY --from=builder /app/public ./public

# Set up prerender cache directory with proper non-root permissions for Next.js ISR
RUN mkdir .next && chown nextjs:nodejs .next

# Copy standalone server build and static output
# Automatically traces and bundles only necessary dependencies
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose service port for internal/external networking
EXPOSE 3000

# Healthcheck to allow container orchestrators (e.g., Docker Compose, Kubernetes)
# to verify service readiness before routing traffic
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/ || exit 1

# Start the standalone Next.js server
CMD ["node", "server.js"]
