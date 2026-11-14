// Health check usado pelo gateway e pelo CI para confirmar que a API está no ar.
import { Controller, Get } from "@nestjs/common";
import type { HealthResponse } from "@caninde/shared";

@Controller("health")
export class AppController {
  @Get()
  health(): HealthResponse {
    return { status: "ok", service: "caninde-api" };
  }
}
