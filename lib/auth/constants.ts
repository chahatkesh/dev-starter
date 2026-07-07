export const SESSION_COOKIE_NAME = "session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export type SessionRole = "USER" | "ADMIN";

export type SessionPayload = {
  userId: string;
  email: string;
  role: SessionRole;
};

export function getPostLoginPath(role: SessionRole) {
  return role === "ADMIN" ? "/admin" : "/app";
}
