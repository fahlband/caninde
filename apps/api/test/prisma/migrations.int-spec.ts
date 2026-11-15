// Aplica as migrações em um PostgreSQL vazio e confirma que o PrismaService conecta.
import { Test } from "@nestjs/testing";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaModule } from "../../src/common/prisma.module.js";
import { PrismaService } from "../../src/common/prisma.service.js";
import {
  applyMigrations,
  startPostgisContainer,
  type TestDatabase,
} from "../support/postgres-container.js";

describe("migrações do Prisma", () => {
  let database: TestDatabase;

  beforeAll(async () => {
    database = await startPostgisContainer();
  });

  afterAll(async () => {
    await database?.container.stop();
  });

  it("aplica todas as migrações em banco vazio e ativa o PostGIS", async () => {
    applyMigrations(database.databaseUrl);

    const result = await database.container.exec([
      "psql",
      "-U",
      database.container.getUsername(),
      "-d",
      database.container.getDatabase(),
      "-tAc",
      "SELECT postgis_version();",
    ]);

    expect(result.exitCode).toBe(0);
    expect(result.output.trim()).toMatch(/^3\./);
  });

  it("PrismaService é injetado por um módulo e conecta no banco", async () => {
    process.env.DATABASE_URL = database.databaseUrl;
    const moduleRef = await Test.createTestingModule({ imports: [PrismaModule] }).compile();
    await moduleRef.init();

    const prisma = moduleRef.get(PrismaService);
    const rows = await prisma.$queryRaw<{ ok: number }[]>`SELECT 1 AS ok`;

    expect(rows).toEqual([{ ok: 1 }]);
    await moduleRef.close();
  });
});
