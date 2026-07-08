import { AppStrings } from "@shared/app-strings";
import { describe, expect, it } from "vitest";

describe("AppStrings", () => {
  it("exposes shared brand copy", () => {
    expect(AppStrings.brand.name).toBe("Dev Starter");
    expect(AppStrings.metadata.appTitle).toBe("Dev Starter");
  });

  it("exposes home marketing copy", () => {
    expect(AppStrings.home.headline).toBe(
      "Ship production apps from one repo.",
    );
    expect(AppStrings.home.highlights).toHaveLength(4);
    expect(AppStrings.home.stackItems).toContain("Next.js 16");
  });

  it("builds interpolated seed and session copy", () => {
    expect(AppStrings.seededAdminAccount("admin@example.com")).toBe(
      "Seeded admin account: admin@example.com",
    );
    expect(AppStrings.signedInAs("user@example.com")).toBe(
      "Signed in as user@example.com",
    );
  });
});
