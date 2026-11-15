// Configuração do Prisma 7 (ADR-0001). A partir da versão 7, a URL do banco sai do
// schema.prisma e fica aqui; o Prisma também deixou de carregar o .env sozinho.
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "prisma/config";

// O .env fica na raiz do monorepo (veja .env.example). Em CI e produção as variáveis
// já vêm do ambiente, então o arquivo é opcional.
const rootEnvFile = resolve(__dirname, "../../.env");
if (existsSync(rootEnvFile)) {
  process.loadEnvFile(rootEnvFile);
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Leitura sem env() de prisma/config, que lança erro quando a variável falta:
    // `prisma generate` (no build e no Docker) não precisa de banco.
    url: process.env.DATABASE_URL,
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
});
