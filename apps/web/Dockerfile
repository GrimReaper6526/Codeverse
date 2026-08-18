# Multi-stage Dockerfile for Next.js Frontend Web App

# Stage 1: Base image with OpenSSL and musl compatibility for Prisma on Alpine
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate
WORKDIR /app

# Stage 2: Builder
FROM base AS builder
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @codeverse/database prisma generate
RUN pnpm build --filter=@codeverse/web

# Stage 3: Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app ./

EXPOSE 3000
CMD ["pnpm", "--filter", "@codeverse/web", "start"]
