/**
 * SWR Global Configuration
 * Default settings for all SWR hooks across the application
 */

import type { SWRConfiguration } from "swr";
import { swrFetcher } from "@/lib/api/client";

export const swrConfig: SWRConfiguration = {
  // Default fetcher for all SWR hooks
  fetcher: swrFetcher,

  // Revalidation settings
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  revalidateIfStale: true,

  // Deduping interval (don't make duplicate requests within 2 seconds)
  dedupingInterval: 2000,

  // Cache settings
  focusThrottleInterval: 5000,

  // Error retry
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  shouldRetryOnError: true,

  // Loading delay (show loading state after 300ms)
  loadingTimeout: 3000,
};
