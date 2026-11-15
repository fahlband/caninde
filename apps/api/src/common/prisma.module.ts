// Módulo global: qualquer módulo de domínio injeta o PrismaService sem importá-lo.
import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service.js";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
