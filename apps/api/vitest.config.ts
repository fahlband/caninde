// Testes unitários (*.spec.ts) e de integração com Testcontainers (*.int-spec.ts).
import { defineConfig } from "vitest/config";

// Construir a imagem do PostgreSQL e subir o contêiner leva mais que o timeout padrão.
const CONTAINER_TIMEOUT_MS = 300_000;

export default defineConfig({
  test: {
    include: ["src/**/*.spec.ts", "test/**/*.spec.ts", "test/**/*.int-spec.ts"],
    hookTimeout: CONTAINER_TIMEOUT_MS,
    testTimeout: 60_000,
  },
});
