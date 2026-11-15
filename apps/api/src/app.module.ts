// Módulo raiz. Módulos de domínio são importados aqui conforme forem criados.
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { PrismaModule } from "./common/prisma.module.js";

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
})
export class AppModule {}
