import { describe, expect, it } from "vitest";
import { AppController } from "./app.controller.js";

describe("AppController", () => {
  it("retorna status ok no health check", () => {
    const controller = new AppController();

    expect(controller.health()).toEqual({ status: "ok", service: "caninde-api" });
  });
});
