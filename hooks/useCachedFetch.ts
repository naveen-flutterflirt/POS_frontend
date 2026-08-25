"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { isCancel } from "axios";
import { useApi } from "@/context/ApiContext";

interface UseCachedFetchOptions {
  /** localStorage cache key — must be unique per endpoint */
  cacheKey: string;
  /** How long (ms) the local cache is considered fresh. Default: 30 000 (30s) */
  staleTtl?: number;
}

interface UseCachedFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  /** true while showing stale cache data and background refresh is in flight */
  isRefreshing: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * useCachedFetch — Stale-While-Revalidate pattern
 *
 * On every mount / refresh:
 *  1. Read from localStorage immediately → show stale data (isRefreshing = true)
 *  2. Call the API (backend checks Redis first, then DB)
 *  3. Update UI and localStorage with fresh data
 *
 * If Redis is running on the backend the API response is typically <5 ms.
 * If Redis is down the backend falls back to DB transparently.
 */
export function useCachedFetch<T = any>(
  url: string,
  options: UseCachedFetchOptions
): UseCachedFetchResult<T> {
  const { get } = useApi();
  const { cacheKey, staleTtl = 30_000 } = options;

  const [data, setData] = useState<T | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const fetch = useCallback(async () => {
    // Abort any previous in-flight request
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    // Check if cached data is still fresh
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const { value, timestamp } = JSON.parse(raw) as {
          value: T;
          timestamp: number;
        };
        const age = Date.now() - timestamp;

        if (age < staleTtl) {
          // Fresh — show immediately, still revalidate in background
          setData(value);
          setIsLoading(false);
          setIsRefreshing(true);
        } else {
          // Stale — show while background fetch runs
          setData(value);
          setIsLoading(false);
          setIsRefreshing(true);
        }
      }
    } catch {
      // No cache — show loading
      setIsLoading(true);
    }

    try {
      const fresh = await get<T>(url, { signal: controller.signal });

      if (!controller.signal.aborted) {
        // Only update if we received actual data (guard against empty 304 body edge cases)
        if (fresh !== null && fresh !== undefined && fresh !== "") {
          setData(fresh);
          setError(null);

          try {
            localStorage.setItem(
              cacheKey,
              JSON.stringify({ value: fresh, timestamp: Date.now() })
            );
          } catch {
            // localStorage full or unavailable
          }
        }
      }
    } catch (err: any) {
      if (isCancel(err) || err?.name === "AbortError") return;
      console.error(`[useCachedFetch] ${url} error:`, err);
      setError(err?.response?.data?.message || "Failed to load data.");
      // Keep showing stale data if available
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [get, url, cacheKey, staleTtl]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(cacheKey);

      if (raw) {
        const { value } = JSON.parse(raw) as {
          value: T;
          timestamp: number;
        };

        setData(value);
        setIsLoading(false);
        setIsRefreshing(true);
      }
    } catch {
      // No valid cache
    }

    fetch();

    return () => controllerRef.current?.abort();
  }, [fetch, cacheKey]);

  return { data, isLoading, isRefreshing, error, refetch: fetch };
}
