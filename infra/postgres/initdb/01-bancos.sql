-- Roda só na criação do volume (primeiro `docker compose up`). Para aplicar em um volume
-- existente: `docker compose down -v` (apaga os dados locais).
--
-- keycloak: banco próprio, para que as tabelas do Keycloak não apareçam como drift
--   no `prisma migrate dev` do banco caninde.
-- caninde_shadow: banco temporário que o Prisma usa em `migrate dev` e `db:check`.
CREATE DATABASE keycloak;
CREATE DATABASE caninde_shadow;
