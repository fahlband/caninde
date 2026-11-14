# Caninde

Plataforma que conecta consumidores a empresas de serviços locais de um município. O piloto do MVP é São Cristóvão/SE.

As empresas aparecem na busca somente depois de confirmarem o próprio perfil (opt-in, LGPD). O consumidor busca por texto, linguagem natural ou voz, sem login.

## Documentação

- [`CLAUDE.md`](CLAUDE.md): stack, estrutura do monorepo e convenções do projeto.
- [`docs/adr/`](docs/adr/): decisões de arquitetura aceitas. Leia antes de mudar stack, autenticação ou gateway.

## Pré-requisitos

- [Node.js 22](https://nodejs.org/) (versão indicada em `.nvmrc`)
- [pnpm 12](https://pnpm.io/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) em execução

## Início rápido

**1. Instalar as dependências**

```bash
git clone https://github.com/fahlband/caninde.git
cd caninde
pnpm install
```

**2. Subir a infraestrutura local**

Na primeira vez, use `--build` para construir a imagem do PostgreSQL com PostGIS:

```bash
docker compose up -d --build
```

| Serviço         | Endereço              | Observação                                         |
| --------------- | --------------------- | -------------------------------------------------- |
| Gateway (Envoy) | http://localhost:8000 | Entrada única da API                               |
| Keycloak        | http://localhost:8080 | Admin: `admin` / `admin` (somente desenvolvimento) |
| Mailpit         | http://localhost:8025 | Caixa de e-mails local (recuperação de senha)      |
| PostgreSQL      | `localhost:5432`      | Banco `caninde`, usuário `caninde`                 |

**3. Rodar a API e o frontend**

Em terminais separados:

```bash
pnpm --filter @caninde/api dev   # API em http://localhost:3001
pnpm --filter @caninde/web dev   # frontend em http://localhost:3000
```

**4. Verificar**

```bash
curl http://localhost:3001/api/v1/health   # direto na API
curl http://localhost:8000/api/v1/health   # pelo gateway
```

Para chamar rotas protegidas pelo gateway, obtenha um token do Keycloak e envie-o no cabeçalho `Authorization: Bearer <token>`:

```bash
curl -s -X POST http://localhost:8080/realms/caninde/protocol/openid-connect/token \
  -d grant_type=password -d client_id=caninde-api \
  -d username=admin@caninde.local -d password=admin123
```

| Usuário                    | Senha           | Papel            |
| -------------------------- | --------------- | ---------------- |
| `admin@caninde.local`      | `admin123`      | `platform_admin` |
| `consumidor@caninde.local` | `consumidor123` | `consumidor`     |

> A API ainda não lê o `.env` automaticamente. O `.env.example` lista as variáveis que serão usadas pelo módulo de autenticação.

## Comandos

| Comando                             | O que faz                                        |
| ----------------------------------- | ------------------------------------------------ |
| `pnpm dev`                          | Roda API e frontend em paralelo                  |
| `pnpm build`                        | Compila todos os pacotes                         |
| `pnpm test`                         | Testes unitários da API                          |
| `pnpm test:policies`                | Testes das políticas OPA (exige o binário `opa`) |
| `pnpm lint`                         | ESLint em todos os pacotes                       |
| `pnpm typecheck`                    | Verificação de tipos em todos os pacotes         |
| `pnpm format` / `pnpm format:check` | Formata ou verifica com Prettier                 |

Sem o binário `opa` instalado, rode os testes de políticas pelo container:

```bash
docker run --rm -v "$PWD/infra/opa:/policies:ro" --entrypoint /opa \
  openpolicyagent/opa:1.22.3-envoy-static test /policies -v
```

Para parar o ambiente local: `docker compose down`. Use `docker compose down -v` para apagar também o banco.

## Contribuindo

- Escreva documentação e comentários em português do Brasil.
- Rode `pnpm lint`, `pnpm typecheck` e `pnpm test` antes de abrir um PR.
- A `main` é protegida: toda mudança entra por PR, com pelo menos 1 aprovação.
- Mensagens de commit e títulos de PR seguem [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`tipo(escopo): descrição`, por exemplo `feat(search): adiciona busca por voz`). O hook `commit-msg` valida localmente após o `pnpm install`, e o workflow `Conventional Commits` valida no PR.
- Preencha o template de PR (`.github/pull_request_template.md`).
- Mudanças de arquitetura pedem um novo ADR em `docs/adr/`.
- Todo PR é revisado pelo responsável definido em [`.github/CODEOWNERS`](.github/CODEOWNERS).
