/**
 * @deprecated Use hooks from @/hooks/api/use-auth instead
 * This file is kept for backward compatibility
 */

import { apiClient } from "./api/client";

type AccountStatus = "ACTIVE" | "SUSPENDED" | "BANNED" | "DEACTIVATED";

interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
    status: AccountStatus;
  };
}

interface RegisterResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
    status: AccountStatus;
  };
}

interface SessionResponse {
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
    status: AccountStatus;
  };
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/api/auth/login", {
      email,
      password,
    });
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>("/api/auth/register", data);
  },

  async checkSession(): Promise<SessionResponse> {
    return apiClient.get<SessionResponse>("/api/auth/session");
  },
};
