"use client";

/**
 * Authentication Hooks
 * Domain-specific hooks for authentication operations
 */

import { useFetch } from "../use-fetch";
import { useMutation } from "../use-mutation";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface SessionResponse {
  user: User;
}

/**
 * Hook to check current session
 * Automatically revalidates on window focus
 *
 * @example
 * const { data: session, error, isLoading } = useSession();
 * if (session) {
 *   console.log('Logged in as:', session.user.email);
 * }
 */
export function useSession() {
  return useFetch<SessionResponse>("/api/auth/session", {
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });
}

/**
 * Hook to login user
 *
 * @example
 * const { trigger: login, isLoading } = useLogin({
 *   onSuccess: () => router.push('/dashboard'),
 * });
 *
 * await login({ email: 'user@example.com', password: 'pass' });
 */
export function useLogin(options?: {
  onSuccess?: (data: SessionResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation<SessionResponse, LoginCredentials>(
    "/api/auth/login",
    "POST",
    {
      revalidate: "/api/auth/session",
      ...options,
    },
  );
}

/**
 * Hook to register new user
 *
 * @example
 * const { trigger: register, isLoading, error } = useRegister({
 *   onSuccess: () => router.push('/welcome'),
 * });
 */
export function useRegister(options?: {
  onSuccess?: (data: SessionResponse) => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation<SessionResponse, RegisterData>(
    "/api/auth/register",
    "POST",
    {
      revalidate: "/api/auth/session",
      ...options,
    },
  );
}

/**
 * Hook to logout user
 *
 * @example
 * const { trigger: logout } = useLogout({
 *   onSuccess: () => router.push('/'),
 * });
 */
export function useLogout(options?: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}) {
  return useMutation<void, void>("/api/auth/logout", "POST", {
    revalidate: "/api/auth/session",
    ...options,
  });
}
