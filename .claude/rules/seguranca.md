---
paths:
  - "apps/api/src/**/*.controller.ts"
  - "apps/api/src/modules/auth/**/*.ts"
  - "apps/api/src/common/**/*.ts"
---

# Regras de Segurança

## Validação de entrada
- Valide **todos** os dados externos (body, query e params) na borda, com schemas Zod de `packages/shared`, antes de chamar qualquer service.
- Rejeite campos não previstos nos payloads: use `z.object({...}).strict()`.

## Identidade e autorização
- A identidade e os papéis vêm **somente** do JWT validado (`sub`, `realm_access.roles` ou equivalente do provedor). Nunca use `userId` do body, da query ou do params para decidir quem é o usuário.
- Cabeçalhos enviados pelo cliente que descrevam identidade, como `X-User-Id` ou `X-Roles`, são ignorados. Não use cabeçalhos do gateway para decisões de autorização.
- Antes de ler ou alterar um recurso, verifique se o usuário pode acessá-lo, incluindo o `municipality_id` (prevenção de IDOR). Faça essa checagem no service, não só no controller.
- Use o JWKS para validar tokens. Não aceite tokens sem `iss`, `aud` e `exp` válidos.

## Segredos e dados sensíveis
- **Nunca** escreva chaves de API, senhas, tokens ou strings de conexão no código. Use variáveis de ambiente e documente os nomes em `.env.example`.
- Nunca retorne hashes de senha, tokens internos, segredos ou CPF nas respostas da API. Use DTOs de saída que listem os campos permitidos.
- Não registre tokens, senhas ou dados pessoais em logs.
