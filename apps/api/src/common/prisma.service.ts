// Conexão única com o PostgreSQL, compartilhada por todos os módulos (ADR-0001).
// O Prisma 7 conecta por driver adapter; usamos o adapter oficial do node-postgres.
import { Injectable, type OnModuleDestroy, type OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

function readDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL não definida. Veja .env.example.");
  }
  return url;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({ adapter: new PrismaPg({ connectionString: readDatabaseUrl() }) });
  }

  // Com driver adapter, $connect não abre conexão de fato. A consulta garante que a API
  // falhe na inicialização quando o banco estiver fora do ar, e não na primeira requisição.
  async onModuleInit(): Promise<void> {
    await this.$connect();
    await this.$queryRaw`SELECT 1`;
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
