---
paths:
  - "apps/api/prisma/**/*"
  - "apps/api/src/modules/**/*.repository.ts"
  - "infra/postgres/**/*"
---

# Regras de Banco de Dados

Banco: PostgreSQL 16 com PostGIS. ORM: Prisma. Veja ADR-0001 e ADR-0002.

## Modelagem e migrations

- Toda tabela tem `id` (UUID), `created_at` e `updated_at`. Tabelas que representam usuários usam o `sub` do token como chave (ADR-0002).
- Nomes de tabelas e colunas em `snake_case` no banco, com `@@map` e `@map` no `schema.prisma`. O código TypeScript usa `camelCase`.
- Toda tabela de negócio tem `municipality_id`, exceto as globais, como a tabela de CNAEs. Papéis e `municipality_id` de usuários ficam em `profiles`, nunca em metadados editáveis pelo usuário.
- Crie índices explícitos (`@@index`) para chaves estrangeiras e para colunas usadas em `WHERE` ou `ORDER BY`. Os índices obrigatórios do HU-02.5 são `cnpj`, `cnae`, `municipality_id`, `bairro` e a coluna de localização, com índice GIST.
- Alterações de schema entram só por migration: `prisma migrate dev` no desenvolvimento local e `prisma migrate deploy` no CI e em staging.
- **Nunca** edite uma migration já criada ou aplicada. Crie uma nova.
- Não use `prisma db push` fora de um banco descartável de teste.

## Consultas PostGIS e SQL puro

- Consultas espaciais e de texto (`ST_DWithin`, `ST_Distance`, `unaccent`, `tsvector`) ficam **somente** em arquivos `*.repository.ts`, usando `$queryRaw` com template literal.
- **Nunca** monte SQL por concatenação ou interpolação de strings. Não use `$queryRawUnsafe` com valores vindos de fora.
- Toda consulta sobre dados de município inclui `municipality_id` no filtro, inclusive nas consultas raw.

## Transações

- Use `$transaction` sempre que uma operação alterar mais de uma tabela de forma dependente. Exemplo: reivindicar uma empresa e criar o perfil dela.
- Não faça chamadas externas (Claude, speech-to-text, Google Places) dentro de uma transação aberta.

## Queries e performance

- Evite queries dentro de loops (N+1). Use `where: { id: { in: ids } }` ou joins.
- Em listagens, use `select` com os campos necessários. Nunca retorne uma linha inteira com dados pessoais (sócios, e-mail, telefone) para um consumidor.
- Importação do CNPJ usa leitura em streaming e inserção em lotes (`createMany`). Nunca carregue o arquivo inteiro na memória.
- Registre tempo de consulta acima de 200 ms em log de nível `warn`, sem os valores dos parâmetros.
