// Contratos compartilhados entre API e frontend. Schemas Zod são a fonte de verdade.
import { z } from "zod";

export const healthResponseSchema = z.object({
  status: z.literal("ok"),
  service: z.string(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
