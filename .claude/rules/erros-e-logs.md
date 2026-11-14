---
paths:
  - "apps/api/src/modules/**/*.service.ts"
  - "apps/api/src/modules/**/*.controller.ts"
  - "apps/api/src/modules/**/*.repository.ts"
  - "apps/api/src/common/**/*.ts"
---

# Tratamento de Erros e Logs

## Exceções

- **Nunca** deixe um `catch` vazio, nem um `catch` que só faz `console.log`. Trate o erro, traduza-o ou relance-o com contexto.
- Lance erros de domínio de `apps/api/src/common/errors/`: `NotFoundError`, `ValidationError`, `UnauthorizedError`, `ForbiddenError` e `ConflictError`. Não lance `new Error()` genérico em regra de negócio.
- Traduza erros de bibliotecas externas na fronteira do repository. Exemplos: erros do Prisma (`P2002` vira `ConflictError`, `P2025` vira `NotFoundError`) e falhas de APIs de terceiros (Claude, serviço de voz, Google Places), que viram erros internos com contexto.
- Um `ExceptionFilter` global em `common/filters/` converte erros de domínio em respostas HTTP. Erros não tratados viram `500` genérico.

## Respostas HTTP

- Nunca exponha stack traces, queries SQL, nomes de tabelas ou mensagens internas nas respostas em produção.
- A resposta de erro segue um formato fixo: `{ code, message, requestId }`. `message` é texto seguro para o usuário, em português.

## Logs

- Use **pino** (ADR-0001 e CLAUDE.md). Não use `console.log` no código da aplicação.
- Inclua o contexto da operação, como `userId`, `municipalityId`, `companyId` ou `requestId`, mas **nunca** logue senhas, tokens, chaves de API, CPF, nomes de sócios, e-mails ou telefones.
- Configure a redação automática de campos sensíveis no logger (`authorization`, `password`, `token`, `cookie`) em `common/logger/`.
- Erros não tratados também vão para o Sentry (HU-03), sem dados pessoais e marcados com o ambiente.
- Em erros de sistema, registre nível `error` com a causa original. Em erros de domínio esperados, registre `warn` ou `info`, não `error`.
