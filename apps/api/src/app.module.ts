// Módulo raiz. Módulos de domínio são importados aqui conforme forem criados.
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller.js";

@Module({
  controllers: [AppController],
})
export class AppModule {}
