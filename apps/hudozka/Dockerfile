FROM node:24.12.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy workspace manifests (root + every workspace) to leverage npm ci caching.
COPY package.json package-lock.json ./
COPY apps/hudozka/package.json ./apps/hudozka/
COPY apps/hudozka-writer/package.json ./apps/hudozka-writer/
COPY apps/migrate-to-pocketbase/package.json ./apps/migrate-to-pocketbase/
COPY packages/ ./packages/

RUN npm ci
RUN npm install --os=linux --libc=musl --cpu=x64 sharp --workspace apps/hudozka

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build -w apps/hudozka

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/hudozka/public ./apps/hudozka/public

# Set the correct permission for prerender cache
RUN mkdir -p apps/hudozka/.next
RUN chown nextjs:nodejs apps/hudozka/.next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/hudozka/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/hudozka/.next/static ./apps/hudozka/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
WORKDIR /app/apps/hudozka
CMD ["node", "server.js"]
