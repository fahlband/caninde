# Caninde

Plataforma que conecta consumidores a empresas de serviços locais de um município. O piloto do MVP é São Cristóvão/SE.

Antes de mudar arquitetura, leia as decisões em [`docs/adr/`](docs/adr/) e as orientações em [`CLAUDE.md`](CLAUDE.md).

## Pré-requisitos

- Node.js 22 (veja `.nvmrc`)
- pnpm 12
- Docker (para o ambiente local, previsto no ADR-0003)

## Primeiros passos

```bash
pnpm install
cp .env.example .env
pnpm test        # testes da API
pnpm typecheck   # verificação de tipos em todos os pacotes
pnpm build       # build da API e do frontend
```

Para rodar em desenvolvimento:

```bash
pnpm --filter @caninde/api dev   # API em http://localhost:3001
pnpm --filter @caninde/web dev   # frontend em http://localhost:3000
```

Teste o health check da API: `curl http://localhost:3001/api/v1/health`

## Estrutura

```
apps/api        API em NestJS (monólito modular)
apps/web        Frontend em Next.js
packages/shared Tipos e schemas Zod compartilhados
infra/          Keycloak, Envoy e OPA (configurações a serem adicionadas)
docs/adr/       Registros de decisões de arquitetura
```
