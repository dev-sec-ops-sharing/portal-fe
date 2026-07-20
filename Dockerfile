# ============ BUILD STAGE ============
FROM node:20-alpine AS builder

WORKDIR /app
RUN mkdir -p public

# Cache dependencies
COPY package*.json ./
RUN npm ci

# Build application
COPY . .
RUN npm run build

# ============ PRODUCTION STAGE ============
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Security: non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy standalone output
COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static
COPY --from=builder --chown=appuser:appgroup /app/public ./public

# Switch to non-root
USER appuser

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
