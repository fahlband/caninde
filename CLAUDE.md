# CLAUDE.md

Orientações para o Claude Code neste repositório. Para instalação e comandos, veja o `README.md`.

## Projeto

Plataforma de busca que conecta consumidores a empresas de serviços locais de um município (piloto: São Cristóvão/SE). Os dados vêm da base aberta de CNPJ da Receita Federal, filtrada por município. Empresas só aparecem na busca após confirmarem o perfil (opt-in, LGPD).

Os ADRs em `docs/adr/` são aceitos e são a fonte de verdade para stack, autenticação, ambiente local e gateway. Leia-os antes de mudar essas áreas.

## Stack

- TypeScript (modo estrito) no Node.js 22, com workspaces pnpm
- Backend: NestJS, Prisma, Zod, `@nestjs/swagger` (previsto), pino (previsto)
- Frontend: Next.js, Tailwind CSS, publicado na Vercel
- Banco: PostgreSQL 16 com PostGIS; pgvector no pós-MVP
- Autenticação: Supabase Auth em produção, Keycloak localmente. A API depende só de issuer e JWKS.
- Gateway: Envoy (`jwt_authentication`) com OPA via `ext_authz`
- Testes: Vitest, Testcontainers, Playwright (previsto)
- Ambiente local: Docker Compose

## Estrutura do repositório

Monorepo modular. Uma única API implantável, dividida em módulos de domínio.

```
caninde/
├── apps/
│   ├── api/                  # monólito modular em NestJS
│   │   ├── prisma/           # schema.prisma e migrations
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── common/       # guards, filtros, pipes, configuração, logger
│   │   │   └── modules/
│   │   │       ├── auth/         # validação de tokens, mapeamento de claims
│   │   │       ├── profiles/     # usuários e papéis (identificados pelo sub do token)
│   │   │       ├── municipality/ # municípios e gestores
│   │   │       ├── companies/    # dados do CNPJ, reivindicação e perfil
│   │   │       ├── segments/     # mapeamento CNAE → segmento
│   │   │       ├── search/       # busca textual, em linguagem natural e por voz
│   │   │       ├── import/       # importação mensal em streaming da Receita
│   │   │       └── analytics/    # eventos anônimos de busca para o painel
│   │   └── test/             # testes de integração e e2e
│   └── web/                  # frontend em Next.js
│       └── src/
│           ├── app/          # rotas
│           ├── components/
│           └── lib/          # cliente da API
├── packages/
│   └── shared/               # tipos e schemas Zod compartilhados
├── infra/
│   ├── envoy/envoy.yaml      # gateway: JWT e chamada ao OPA
│   ├── keycloak/realm.json   # realm local, importado na inicialização
│   ├── opa/                  # políticas Rego e seus testes
│   └── postgres/Dockerfile   # PostgreSQL 16 com PostGIS
├── docs/
│   └── adr/                  # decisões de arquitetura (MADR, pt-BR)
├── docker-compose.yml        # postgres, keycloak, envoy, opa, mailpit
└── CLAUDE.md
```

Cada módulo em `apps/api/src/modules/<nome>/` contém `*.controller.ts`, `*.service.ts`, `*.repository.ts` e a pasta `dto/`. Os módulos se comunicam pelos services exportados, nunca pelo repository de outro módulo.

## Convenções

- Toda documentação e todos os comentários no código devem ser escritos em português do Brasil. Nomes de código, identificadores e termos técnicos continuam em inglês.
- Camadas: controller → service → repository. Controllers não contêm regra de negócio.
- Valide toda entrada com schemas Zod de `packages/shared`.
- Toda consulta sobre dados de município filtra por `municipality_id`. As verificações de propriedade e de município acontecem no service.
- Os papéis por rota são aplicados pelo Envoy e pelo OPA. A API ainda verifica o JWT.
- Consultas PostGIS ficam apenas em arquivos de repository, como SQL puro.
- A importação do CNPJ usa streaming. Nunca carregue um arquivo de origem inteiro na memória.
- Mantenha segredos fora do repositório. Use `.env.example` para os nomes das variáveis.

## ADRs

- Seguem o MADR, em português do Brasil. Regras em `.claude/rules/adr.md`.
- Mantenha cada ADR com menos de 600 palavras (1200 para temas muito complexos), com diagramas Mermaid.
