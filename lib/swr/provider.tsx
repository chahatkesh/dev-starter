"use client";

/**
 * SWR Provider Component
 * Wraps the application with SWRConfig for global data fetching configuration
 */

import type { ReactNode } from "react";
import { SWRConfig } from "swr";
import { swrConfig } from "./config";

interface SwrProviderProps {
  children: ReactNode;
  fallback?: Record<string, unknown>;
}

export function SwrProvider({ children, fallback = {} }: SwrProviderProps) {
  return <SWRConfig value={{ ...swrConfig, fallback }}>{children}</SWRConfig>;
}
