import { describe, expect, it } from "vitest";
import { AppStrings } from "@shared/app-strings";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns the production runtime contract shape", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      status: AppStrings.health.statusOk,
      service: AppStrings.brand.name,
      environment: "test",
    });
    expect(new Date(body.timestamp).toString()).not.toBe("Invalid Date");
  });
});
