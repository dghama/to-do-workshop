FROM node:26.13.1-alpine AS base

WORKDIR /workspace
RUN npm install --global pnpm@12.21.0

FROM base AS build

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY tests/e2e/package.json tests/e2e/package.json
RUN pnpm install --filter @todo/api... --frozen-lockfile

COPY . .
RUN pnpm --filter @todo/shared build
RUN pnpm --filter @todo/api build

FROM base AS production-deps

ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY tests/e2e/package.json tests/e2e/package.json
RUN pnpm install --prod --filter @todo/api... --frozen-lockfile

FROM base AS runtime

ENV NODE_ENV=production
ENV API_PORT=3000
EXPOSE 3000

COPY --from=production-deps /workspace/node_modules ./node_modules
COPY --from=production-deps /workspace/apps/api/node_modules ./apps/api/node_modules
COPY --from=production-deps /workspace/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=production-deps /workspace/package.json ./package.json
COPY --from=production-deps /workspace/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=production-deps /workspace/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=production-deps /workspace/.npmrc ./.npmrc
COPY --from=production-deps /workspace/apps/api/package.json ./apps/api/package.json
COPY --from=production-deps /workspace/apps/web/package.json ./apps/web/package.json
COPY --from=production-deps /workspace/packages/shared/package.json ./packages/shared/package.json
COPY --from=production-deps /workspace/tests/e2e/package.json ./tests/e2e/package.json
COPY --from=build /workspace/apps/api/dist ./apps/api/dist
COPY --from=build /workspace/apps/api/prisma.config.ts ./apps/api/prisma.config.ts
COPY --from=build /workspace/apps/api/prisma ./apps/api/prisma
COPY --from=build /workspace/packages/shared/dist ./packages/shared/dist

WORKDIR /workspace/apps/api
USER node
CMD ["node", "dist/src/server.js"]
