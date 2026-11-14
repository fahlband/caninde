# Regras para ADRs

Aplicam-se a todos os arquivos em `docs/adr/`.

- Escreva todo o conteúdo dos ADRs em português do Brasil (pt-BR). Nunca produza ADRs em outro idioma.
- Siga o formato MADR (veja `docs/adr/0000-template.md`).
- Mantenha cada ADR com menos de 600 palavras. Use o limite de 1200 palavras apenas para temas muito complexos, e registre o motivo no Contexto.
- Quanto menos palavras, melhor. Corte repetições, contexto desnecessário e ressalvas.
- Seja objetivo: declare a decisão, os direcionadores e os trade-offs. Sem linguagem de marketing.
- Use diagrama quando ele esclarecer estrutura ou fluxo. Diagramas DEVEM ser blocos de código Mermaid, nunca imagens.
- Numere os ADRs sequencialmente (`NNNN-titulo-em-kebab-case.md`). Nunca renumere nem apague um ADR aceito; substitua-o por um novo e atualize o status.
- Status válidos: `proposto`, `aceito`, `substituído por ADR-NNNN`.
