# CLAUDE.md

Orientações para o Claude Code ao trabalhar neste repositório.

## Projeto

Caninde é uma plataforma de busca que conecta consumidores a empresas de serviços locais de um município. O piloto do MVP é São Cristóvão/SE. Os dados das empresas vêm da base aberta de CNPJ da Receita Federal, filtrada por município. As empresas só aparecem na busca depois de confirmarem seu perfil (opt-in, LGPD).

Leia as decisões em `docs/adr/` antes de mudar arquitetura, stack, autenticação ou gateway. Os ADRs são aceitos e são a fonte de verdade.

## Stack

- TypeScript (modo estrito) no Node.js LTS, com workspaces pnpm
- Backend: NestJS, Prisma, Zod, `@nestjs/swagger`, pino
- Frontend: Next.js, Tailwind CSS, publicado na Vercel
- Banco de dados: PostgreSQL 16 com PostGIS; pgvector no pós-MVP
- Autenticação: Supabase Auth em produção, Keycloak localmente (tokens OIDC; a API depende apenas da configuração de issuer e JWKS)
- Gateway: Envoy (`jwt_authentication`) com OPA via `ext_authz`
- Testes: Vitest, Testcontainers, Playwright
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
│   ├── keycloak/realm.json   # realm local, importado na inicialização
│   ├── envoy/                # configuração do gateway
│   └── opa/                  # políticas Rego e seus testes
├── docs/
│   └── adr/                  # registros de decisões de arquitetura (MADR, pt-BR)
├── docker-compose.yml        # postgres, keycloak, envoy, opa, mailpit
├── pnpm-workspace.yaml
└── CLAUDE.md
```

Cada módulo em `apps/api/src/modules/<nome>/` contém seus próprios `*.controller.ts`, `*.service.ts`, `*.repository.ts` e a pasta `dto/`. Os módulos se comunicam pelos services exportados, nunca pelo repository de outro módulo.

## Convenções

- Toda documentação e todos os comentários no código devem ser escritos em português do Brasil. Nomes de código, identificadores e termos técnicos continuam em inglês.
- Camadas: controller → service → repository. Controllers não contêm regra de negócio.
- Valide toda entrada com schemas Zod de `packages/shared`.
- Toda consulta sobre dados de município filtra por `municipality_id`. As verificações de propriedade e de município acontecem no service.
- Os papéis por rota são aplicados pelo Envoy e pelo OPA. A API ainda verifica o JWT.
- Consultas PostGIS ficam apenas em arquivos de repository, como SQL puro.
- A importação do CNPJ usa streaming. Nunca carregue um arquivo de origem inteiro na memória.
- Mantenha segredos fora do repositório. Use `.env.example` para os nomes das variáveis.

## Comandos

Estes comandos são planejados e serão adicionados ao `package.json` quando o repositório for estruturado:

- `docker compose up -d`: sobe a infraestrutura local
- `pnpm dev`: executa API e web
- `pnpm test`: testes unitários e de integração
- `pnpm test:e2e`: testes Playwright
- `pnpm lint`: verificação com ESLint e Prettier

## Documentação

- Os ADRs seguem o MADR e são escritos em português do Brasil. Veja `.claude/rules/adr.md` para as regras.
- Mantenha os ADRs com menos de 600 palavras (1200 para temas muito complexos), com diagramas Mermaid.
