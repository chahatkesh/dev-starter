/**
 * Authentication Types
 * Centralized type definitions matching Prisma schema
 */

import type { AccountStatus } from "@/packages/database/generated/prisma";

// Complete authenticated user
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  status: AccountStatus;
  emailVerified: boolean;
  lastLoginAt: Date | null;
}

// Simplified user for frontend/session
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}
