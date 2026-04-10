"use client";

/**
 * Generic Mutation Hook
 * Type-safe wrapper for POST/PUT/PATCH/DELETE operations with optimistic updates
 */

import { useCallback, useState } from "react";
import { useSWRConfig } from "swr";
import { apiClient } from "@/lib/api/client";
import type { ApiError, HttpMethod } from "@/lib/api/types";

interface UseMutationOptions<TData, TVariables> {
  // URLs to revalidate after mutation
  revalidate?: string | string[];

  // Optimistic update function
  onMutate?: (variables: TVariables) => void;

  // Success callback
  onSuccess?: (data: TData, variables: TVariables) => void;

  // Error callback
  onError?: (error: ApiError, variables: TVariables) => void;

  // Always runs after mutation (success or error)
  onSettled?: (
    data: TData | undefined,
    error: ApiError | undefined,
    variables: TVariables,
  ) => void;
}

interface UseMutationResult<TData, TVariables> {
  trigger: (variables: TVariables) => Promise<TData>;
  data: TData | undefined;
  error: ApiError | undefined;
  isLoading: boolean;
  reset: () => void;
}

/**
 * Generic mutation hook for POST/PUT/PATCH/DELETE operations
 *
 * @example
 * const { trigger, isLoading, error } = useMutation<User, CreateUserData>(
 *   '/api/users',
 *   'POST',
 *   {
 *     onSuccess: (user) => console.log('Created:', user),
 *     revalidate: '/api/users',
 *   }
 * );
 *
 * await trigger({ name: 'John', email: 'john@example.com' });
 */
export function useMutation<TData = unknown, TVariables = unknown>(
  endpoint: string,
  method: Extract<HttpMethod, "POST" | "PUT" | "PATCH" | "DELETE"> = "POST",
  options?: UseMutationOptions<TData, TVariables>,
): UseMutationResult<TData, TVariables> {
  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<ApiError | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useSWRConfig();

  const trigger = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setIsLoading(true);
      setError(undefined);

      try {
        // Call onMutate for optimistic updates
        options?.onMutate?.(variables);

        // Make the API request
        const response = await (async () => {
          switch (method) {
            case "POST":
              return apiClient.post<TData>(endpoint, variables);
            case "PUT":
              return apiClient.put<TData>(endpoint, variables);
            case "PATCH":
              return apiClient.patch<TData>(endpoint, variables);
            case "DELETE":
              return apiClient.delete<TData>(endpoint);
            default:
              throw new Error(`Unsupported method: ${method}`);
          }
        })();

        setData(response);

        // Revalidate specified URLs
        if (options?.revalidate) {
          const urls = Array.isArray(options.revalidate)
            ? options.revalidate
            : [options.revalidate];

          for (const url of urls) {
            await mutate(url);
          }
        }

        // Call success callback
        options?.onSuccess?.(response, variables);
        options?.onSettled?.(response, undefined, variables);

        return response;
      } catch (err) {
        const apiError =
          err instanceof Error
            ? (err as ApiError)
            : new (await import("@/lib/api/types")).ApiError(
                "Unknown error",
                500,
              );

        setError(apiError);
        options?.onError?.(apiError, variables);
        options?.onSettled?.(undefined, apiError, variables);

        throw apiError;
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, method, options, mutate],
  );

  const reset = useCallback(() => {
    setData(undefined);
    setError(undefined);
  }, []);

  return {
    trigger,
    data,
    error,
    isLoading,
    reset,
  };
}
