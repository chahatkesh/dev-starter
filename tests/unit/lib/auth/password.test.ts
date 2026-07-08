import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

describe("password helpers", () => {
  it("hashes and verifies passwords", async () => {
    const passwordHash = await hashPassword("test-password-123");

    expect(passwordHash).not.toBe("test-password-123");
    await expect(
      verifyPassword("test-password-123", passwordHash),
    ).resolves.toBe(true);
    await expect(verifyPassword("wrong-password", passwordHash)).resolves.toBe(
      false,
    );
  });
});
