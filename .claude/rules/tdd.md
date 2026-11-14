---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# Regras de TDD

Aplicam-se a todo código TypeScript do monorepo (`apps/api`, `apps/web` e `packages/shared`).

- Escreva o teste que falha (Red) antes de implementar o comportamento.
- Escreva o código mínimo para o teste passar (Green) e depois refatore (Refactor).
- Teste regras de negócio, casos de uso e services. Use Vitest, e Testcontainers quando precisar de banco real.
- Não escreva testes para DTOs, interfaces, tipos, schemas Zod estáticos, módulos NestJS vazios ou arquivos de configuração.
- Testes de componentes do frontend cobrem comportamento visível, não a marcação em si.
- Rode `pnpm test` antes de dar uma tarefa por concluída.
