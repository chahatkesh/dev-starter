"use client";

/**
 * Generic SWR Fetch Hook
 * Type-safe wrapper around useSWR with consistent API
 */

import { useState } from "react";
import useSWR, { type SWRConfiguration, type SWRResponse } from "swr";
import type { ApiError } from "@/lib/api/types";

interface UseFetchOptions<T> extends SWRConfiguration<T> {
  // Additional custom options can be added here
}

interface UseFetchResult<T> extends Omit<SWRResponse<T, ApiError>, "data"> {
  data: T | undefined;
  isLoading: boolean;
  isValidating: boolean;
}

/**
 * Generic fetch hook using SWR
 *
 * @example
 * const { data, error, isLoading } = useFetch<User>('/api/user');
 *
 * @example With options
 * const { data } = useFetch<User[]>('/api/users', {
 *   refreshInterval: 10000,
 *   revalidateOnFocus: false,
 * });
 */
export function useFetch<T>(
  url: string | null,
  options?: UseFetchOptions<T>,
): UseFetchResult<T> {
  const { data, error, isLoading, isValidating, mutate } = useSWR<T, ApiError>(
    url,
    options,
  );

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

/**
 * Paginated fetch hook with automatic pagination support
 *
 * @example
 * const { data, error, isLoading, page, setPage } = usePaginatedFetch<Item[]>(
 *   '/api/items',
 *   { pageSize: 10 }
 * );
 */
interface UsePaginatedFetchOptions<T> extends UseFetchOptions<T> {
  pageSize?: number;
  initialPage?: number;
}

export function usePaginatedFetch<T>(
  baseUrl: string,
  options?: UsePaginatedFetchOptions<T>,
) {
  const { pageSize = 10, initialPage = 1, ...swrOptions } = options || {};
  const [page, setPage] = useState(initialPage);

  const url = `${baseUrl}?page=${page}&limit=${pageSize}`;
  const result = useFetch<T>(url, swrOptions);

  return {
    ...result,
    page,
    setPage,
    pageSize,
  };
}
