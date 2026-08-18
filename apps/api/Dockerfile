# Multi-stage Dockerfile for NestJS Backend API

# Stage 1: Base image with OpenSSL and musl compatibility for Prisma on Alpine
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# Stage 2: Builder
FROM base AS builder
COPY . .
RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @codeverse/database prisma generate
RUN pnpm build --filter=@codeverse/api

# Stage 3: Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app ./

EXPOSE 4000
CMD ["pnpm", "--filter", "@codeverse/api", "start:prod"]
