// Sobe um PostgreSQL 16 com PostGIS descartável para testes de integração.
// A imagem é construída a partir de infra/postgres, a mesma do docker compose,
// porque a imagem postgis/postgis não tem build arm64 para a versão 16.
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { GenericContainer } from "testcontainers";

// O Vitest roda com o diretório da API como cwd (pnpm --filter @caninde/api test).
const API_ROOT = process.cwd();
const POSTGRES_DOCKERFILE_DIR = resolve(API_ROOT, "../../infra/postgres");
const TEST_IMAGE_NAME = "caninde-postgres-test:latest";
const PRISMA_BIN = resolve(API_ROOT, "node_modules/.bin/prisma");

export interface TestDatabase {
  container: StartedPostgreSqlContainer;
  databaseUrl: string;
}

export async function startPostgisContainer(): Promise<TestDatabase> {
  await GenericContainer.fromDockerfile(POSTGRES_DOCKERFILE_DIR).build(TEST_IMAGE_NAME, {
    deleteOnExit: false,
  });
  const container = await new PostgreSqlContainer(TEST_IMAGE_NAME).start();
  return { container, databaseUrl: container.getConnectionUri() };
}

// Aplica as migrações versionadas com o mesmo comando usado em CI e produção.
export function applyMigrations(databaseUrl: string): string {
  return execFileSync(PRISMA_BIN, ["migrate", "deploy"], {
    cwd: API_ROOT,
    env: { ...process.env, DATABASE_URL: databaseUrl },
    encoding: "utf8",
  });
}
