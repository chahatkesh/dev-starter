import { cookies } from "next/headers";
import { db } from "@/lib/db";

const SESSION_COOKIE_NAME = "session_id";
const SESSION_DURATION_DAYS = 30;

export interface SessionData {
  id: string;
  userId: string;
  expiresAt: Date;
}

/**
 * Create a new session for a user
 */
export async function createSession(
  userId: string,
  ip?: string,
  userAgent?: string,
): Promise<SessionData> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS);

  const session = await db.session.create({
    data: {
      userId,
      ip,
      userAgent,
      expiresAt,
    },
  });

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  return {
    id: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt,
  };
}

/**
 * Get the current session from cookies
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return null;
  }

  const session = await db.session.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.expiresAt < new Date()) {
    // Session expired or doesn't exist
    await deleteSession(sessionId);
    return null;
  }

  return {
    id: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt,
  };
}

/**
 * Delete a session
 */
export async function deleteSession(sessionId?: string): Promise<void> {
  const cookieStore = await cookies();

  if (!sessionId) {
    sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  }

  if (sessionId) {
    await db.session
      .delete({
        where: { id: sessionId },
      })
      .catch(() => {
        // Session might not exist, ignore error
      });
  }

  // Clear cookie
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Get current user from session
 */
export async function getCurrentUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      status: true,
      emailVerified: true,
      lastLoginAt: true,
    },
  });

  if (!user || user.status !== "ACTIVE") {
    await deleteSession(session.id);
    return null;
  }

  return user;
}

/**
 * Clean up expired sessions (run periodically)
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await db.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });

  return result.count;
}
