import { AppError, AppErrors } from "@shared/app-errors";
import { describe, expect, it } from "vitest";

describe("AppErrors", () => {
  it("creates typed app errors from definitions", () => {
    const error = AppErrors.create(AppErrors.invalidCredentials);

    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe("Invalid email or password.");
    expect(error.statusCode).toBe(401);
  });

  it("maps unknown errors to the internal server fallback", () => {
    const error = AppErrors.fromUnknown(new Error("boom"));

    expect(error.code).toBe(AppErrors.internalServerError.code);
    expect(error.statusCode).toBe(500);
  });
});
