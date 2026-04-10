import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  createSession,
  deleteSession,
  getCurrentUser,
} from "@/lib/auth/session";
import type { LoginInput, RegisterInput } from "@/lib/auth/validation";
import { db } from "@/lib/db";

/**
 * Register a new user
 */
export async function registerUser(
  input: RegisterInput,
  ip?: string,
  userAgent?: string,
) {
  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Hash password
  const passwordHash = await hashPassword(input.password);

  // Create user
  const user = await db.user.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      status: "ACTIVE",
    },
  });

  // Create session
  const session = await createSession(user.id, ip, userAgent);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    session,
  };
}

/**
 * Login user
 */
export async function loginUser(
  input: LoginInput,
  ip?: string,
  userAgent?: string,
) {
  // Find user
  const user = await db.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user || !user.passwordHash) {
    throw new Error("Invalid email or password");
  }

  // Check account status
  if (user.status !== "ACTIVE") {
    throw new Error("Account is suspended");
  }

  // Verify password
  const isValidPassword = await verifyPassword(
    input.password,
    user.passwordHash,
  );

  if (!isValidPassword) {
    throw new Error("Invalid email or password");
  }

  // Create session
  const session = await createSession(user.id, ip, userAgent);

  // Update last login time
  await db.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    session,
  };
}

/**
 * Logout user
 */
export async function logoutUser() {
  await deleteSession();
}

/**
 * Get current authenticated user
 */
export async function getCurrentAuthUser() {
  return getCurrentUser();
}

/**
 * Check if user is authenticated
 */
export async function isUserAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}
