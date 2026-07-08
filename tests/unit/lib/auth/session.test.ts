import { afterEach, describe, expect, it } from "vitest";
import { createSessionToken, verifySessionToken } from "@/lib/auth/session";

const originalAuthSecret = process.env.AUTH_SECRET;

describe("session helpers", () => {
  afterEach(() => {
    process.env.AUTH_SECRET = originalAuthSecret;
  });

  it("creates and verifies a signed session token", async () => {
    process.env.AUTH_SECRET = "test-auth-secret-with-at-least-32-characters";

    const token = await createSessionToken({
      userId: "user_123",
      email: "user@example.com",
      role: "USER",
    });

    await expect(verifySessionToken(token)).resolves.toEqual({
      userId: "user_123",
      email: "user@example.com",
      role: "USER",
    });
  });

  it("rejects tampered session tokens", async () => {
    process.env.AUTH_SECRET = "test-auth-secret-with-at-least-32-characters";

    const token = await createSessionToken({
      userId: "user_123",
      email: "user@example.com",
      role: "USER",
    });

    await expect(verifySessionToken(`${token}tampered`)).resolves.toBeNull();
  });
});
