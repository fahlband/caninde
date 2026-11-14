<!--
O título do PR deve seguir Conventional Commits, por exemplo:
  feat(search): adiciona busca por voz
  fix(import): corrige leitura de CNPJ com zeros à esquerda
Tipos aceitos: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.
-->

## O que muda

<!-- Resuma a mudança e o motivo. -->

## Issue relacionada

Closes #

## Como testar

<!-- Passos para validar a mudança localmente. -->

## Checklist

- [ ] `pnpm lint`, `pnpm typecheck` e `pnpm test` passam localmente
- [ ] Testes cobrem o comportamento novo ou corrigido
- [ ] Documentação e comentários em português do Brasil
- [ ] Sem segredos no código; variáveis novas estão em `.env.example`
- [ ] Mudança de arquitetura acompanha um ADR em `docs/adr/` (se aplicável)
