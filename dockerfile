FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN npm ci

RUN npm install --save-dev ts-node typescript

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npx prisma generate

RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache git

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json

# Ensure nextjs user has write access to the app directory
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run database migrations and start the app with retry logic
CMD sh -c "echo 'Waiting for database...' && \
	MAX_RETRIES=30 && \
	RETRY_INTERVAL=5 && \
	RETRIES=0 && \
	until [ \$RETRIES -ge \$MAX_RETRIES ]; do \
	npx prisma db push --skip-generate && break; \
	RETRIES=\$((RETRIES+1)); \
	echo \"Database not ready yet. Retry \$RETRIES of \$MAX_RETRIES...\"; \
	sleep \$RETRY_INTERVAL; \
	done && \
	if [ \$RETRIES -ge \$MAX_RETRIES ]; then \
	echo \"Could not connect to database after \$MAX_RETRIES attempts. Exiting.\"; \
	exit 1; \
	fi && \
	echo 'Database is ready. Running migrations...' && \
	npx prisma db push && \
	echo 'Starting Next.js application...' && \
	node server.js"
