/**
 * API Client
 * Centralized HTTP client with error handling and type safety
 */

import type { ApiResponse, HttpMethod, RequestConfig } from "./types";
import { ApiError } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_MAIN_APP_URL || "http://localhost:3000";

/**
 * Build URL with query parameters
 */
function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean>,
): string {
  const url = new URL(endpoint, API_BASE_URL);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, String(value));
    }
  }

  return url.toString();
}

/**
 * Handle API response and errors
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  if (!isJson) {
    throw new ApiError("Invalid response format", response.status);
  }

  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    const errorMessage = data.error || `HTTP ${response.status}`;
    throw new ApiError(errorMessage, response.status, data.details);
  }

  return data.data as T;
}

/**
 * Generic request function
 */
async function request<T>(
  endpoint: string,
  method: HttpMethod = "GET",
  config: RequestConfig = {},
): Promise<T> {
  const { params, timeout = 10000, ...fetchOptions } = config;
  const url = buildUrl(endpoint, params);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      signal: controller.signal,
      ...fetchOptions,
    });

    clearTimeout(timeoutId);
    return handleResponse<T>(response);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new ApiError("Request timeout", 408);
      }

      throw new ApiError(error.message, 0);
    }

    throw new ApiError("Unknown error occurred", 500);
  }
}

/**
 * API Client Methods
 */
export const apiClient = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, "GET", config),

  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, "POST", {
      ...config,
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, "PUT", {
      ...config,
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, "PATCH", {
      ...config,
      body: JSON.stringify(data),
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, "DELETE", config),
};

/**
 * SWR Fetcher
 * Compatible with SWR's fetcher pattern
 */
export const swrFetcher = <T>(url: string): Promise<T> => {
  return apiClient.get<T>(url);
};
