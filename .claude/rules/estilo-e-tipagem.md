---
paths:
  - "apps/**/*.ts"
  - "apps/**/*.tsx"
  - "packages/**/*.ts"
---

# Estilo de Código e Tipagem

## Tipagem estrita

- **Proibido** `any`, `@ts-ignore` e `@ts-expect-error`. Quando o tipo não for conhecido, use `unknown` com type guards. O ESLint (`typescript-eslint`) já reprova `any` e comentários de supressão; não os contorne.
- Defina o tipo de retorno explícito em toda função pública e em todo método de service.
- Tipos de entrada e saída de API saem dos schemas Zod de `packages/shared` (`z.infer`). Não duplique a mesma forma à mão.
- Prefira `satisfies` a anotações amplas quando quiser validar um literal sem perder o tipo inferido.

## Estrutura e legibilidade

- Prefira **early returns** para evitar `if/else` aninhados.
- Limite funções a 30–40 linhas. Extraia lógica complexa para funções auxiliares com nomes claros.
- Evite números mágicos e strings soltas. Extraia para constantes ou enums descritivos, por exemplo códigos CNAE, limites de upload e nomes de papéis.
- Módulos NestJS seguem a estrutura de `CLAUDE.md`. Não coloque lógica de negócio em controllers.
- Formatação segue o Prettier do repositório (`.prettierrc.json`). Não discuta estilo fora do que ele define.

## Nomenclatura

- Variáveis e funções booleanas começam com `is`, `has`, `can` ou `should` (ex.: `isConfirmed`, `hasVerifiedOwner`).
- Funções usam verbos que descrevem a ação exata (ex.: `calculateSearchScore` em vez de `processData`).
- Código em inglês (identificadores). Comentários e documentação em português do Brasil, como manda `CLAUDE.md`.
- Nomes de tabelas, colunas e rotas seguem a convenção do schema: `snake_case` no banco, `kebab-case` nas rotas, `camelCase` no TypeScript.
