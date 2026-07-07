import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { getRequiredEnv } from "@/lib/env";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  type SessionPayload,
  type SessionRole,
} from "@/lib/auth/constants";

function getAuthSecret() {
  return new TextEncoder().encode(getRequiredEnv("AUTH_SECRET"));
}

function toSessionPayload(
  payload: Record<string, unknown>,
): SessionPayload | null {
  if (
    typeof payload.sub !== "string" ||
    typeof payload.email !== "string" ||
    (payload.role !== "USER" && payload.role !== "ADMIN")
  ) {
    return null;
  }

  return {
    userId: payload.sub,
    email: payload.email,
    role: payload.role,
  };
}

export async function createSessionToken(session: SessionPayload) {
  return new SignJWT({
    email: session.email,
    role: session.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.userId)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(getAuthSecret());
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getAuthSecret(), {
      algorithms: ["HS256"],
    });

    return toSessionPayload(payload);
  } catch {
    return null;
  }
}

export async function setSessionCookie(session: SessionPayload) {
  const cookieStore = await cookies();
  const token = await createSessionToken(session);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export function toSessionRole(role: string): SessionRole | null {
  if (role === "USER" || role === "ADMIN") {
    return role;
  }

  return null;
}
