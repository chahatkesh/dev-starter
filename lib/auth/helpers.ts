import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

const LANDING_APP_URL =
  process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3001";

/**
 * Server-side helper to require authentication
 * Use this in server components or server actions
 */
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`${LANDING_APP_URL}/login`);
  }

  return user;
}

/**
 * Server-side helper to get optional auth
 * Returns user if authenticated, null otherwise
 */
export async function getOptionalAuth() {
  return getCurrentUser();
}
