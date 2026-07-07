import { AppError, AppErrors } from "@shared/app-errors";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import type { SessionPayload } from "@/lib/auth/constants";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function validateEmail(email: string) {
  const normalized = normalizeEmail(email);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    throw AppErrors.create(AppErrors.invalidEmailAddress);
  }

  return normalized;
}

function validatePassword(password: string) {
  if (password.length < 8) {
    throw AppErrors.create(AppErrors.passwordTooShort);
  }
}

export async function signUpUser(input: {
  email: string;
  password: string;
}): Promise<SessionPayload> {
  const email = validateEmail(input.email);
  validatePassword(input.password);

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existingUser) {
    throw AppErrors.create(AppErrors.emailAlreadyRegistered);
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(input.password),
      role: "USER",
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  return {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
}

export async function signInUser(input: {
  email: string;
  password: string;
}): Promise<SessionPayload> {
  const email = validateEmail(input.email);
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      passwordHash: true,
    },
  });

  if (!user) {
    throw AppErrors.create(AppErrors.invalidCredentials);
  }

  const passwordMatches = await verifyPassword(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw AppErrors.create(AppErrors.invalidCredentials);
  }

  return {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
}

export { AppError };
