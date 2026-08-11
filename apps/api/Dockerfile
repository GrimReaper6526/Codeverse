# Multi-stage Dockerfile for NestJS Backend API

# Stage 1: Base image
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# Stage 2: Dependencies
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api/package.json ./apps/api/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/
COPY packages/config/package.json ./packages/config/
COPY packages/ai-sdk/package.json ./packages/ai-sdk/
COPY packages/database/package.json ./packages/database/
COPY packages/universe-sdk/package.json ./packages/universe-sdk/
RUN pnpm install --frozen-lockfile || pnpm install

# Stage 3: Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL="postgresql://user:password@localhost:5432/codeverse_db"
RUN pnpm --filter @codeverse/database db:generate || true
RUN pnpm --filter @codeverse/api build

# Stage 4: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4000
CMD ["node", "dist/main"]
