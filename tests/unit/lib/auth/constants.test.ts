import { describe, expect, it } from "vitest";
import { getPostLoginPath } from "@/lib/auth/constants";

describe("getPostLoginPath", () => {
  it("routes admins to /admin", () => {
    expect(getPostLoginPath("ADMIN")).toBe("/admin");
  });

  it("routes standard users to /app", () => {
    expect(getPostLoginPath("USER")).toBe("/app");
  });
});
