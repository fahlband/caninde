# Imagem da API (HU-01.3). Contexto de build: raiz do monorepo.
#   docker build -f apps/api/Dockerfile .

# Versão fixada para o Node.js 22 LTS, igual a .nvmrc.
ARG NODE_IMAGE=node:22.20.0-bookworm-slim

FROM ${NODE_IMAGE} AS base
# Mesma versão de pnpm do campo packageManager do package.json.
RUN npm install -g pnpm@12.18.0
WORKDIR /app

# Instala dependências antes de copiar o código, para aproveitar o cache de camadas.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile --filter @caninde/api...

FROM deps AS build
COPY tsconfig.base.json ./
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN pnpm --filter @caninde/shared build \
  && pnpm --filter @caninde/api build \
  && pnpm --filter @caninde/api deploy --prod /out

# Imagem final: somente dist/ e dependências de produção, como usuário não-root.
FROM ${NODE_IMAGE} AS runtime
ENV NODE_ENV=production
ENV API_PORT=3001
WORKDIR /app
COPY --from=build --chown=node:node /out ./
USER node
EXPOSE 3001
HEALTHCHECK --interval=10s --timeout=3s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:' + process.env.API_PORT + '/api/v1/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node", "dist/main.js"]
