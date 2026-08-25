"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import axios, { isCancel } from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";

interface ApiContextType {
  api: AxiosInstance;

  get: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ) => Promise<T>;

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) => Promise<T>;

  put: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ) => Promise<T>;

  del: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ) => Promise<T>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: ReactNode }) {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  /**
   * Create Axios instance only once.
   */
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: apiUrl,
      headers: { "Content-Type": "application/json" },
    });

    /**
     * Request interceptor — attach JWT token from localStorage.
     * Synchronous read — no async Amplify calls, no race conditions.
     */
    instance.interceptors.request.use((config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("access_token");
        if (token) {
          config.headers = config.headers ?? {};
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
      return config;
    });

    /**
     * Response interceptor
     * - Silently ignores AbortController cancellations (React StrictMode cleanup)
     * - On 401 — token missing/expired — redirect to login
     */
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (isCancel(error) || error?.name === "AbortError") {
          return Promise.reject(error);
        }

        console.error(
          "API Error:",
          error.response?.status,
          error.response?.data || error.message
        );

        if (error.response?.status === 401 && typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          window.location.href = "/admin/login";
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [apiUrl]);

  /** GET */
  const get = useCallback(
    async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      const response = await axiosInstance.get<T>(url, config);
      return response.data;
    },
    [axiosInstance]
  );

  /** POST */
  const post = useCallback(
    async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
      const response = await axiosInstance.post<T>(url, data, config);
      return response.data;
    },
    [axiosInstance]
  );

  /** PUT */
  const put = useCallback(
    async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
      const response = await axiosInstance.put<T>(url, data, config);
      return response.data;
    },
    [axiosInstance]
  );

  /** DELETE */
  const del = useCallback(
    async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      const response = await axiosInstance.delete<T>(url, config);
      return response.data;
    },
    [axiosInstance]
  );

  const value = useMemo(
    () => ({ api: axiosInstance, get, post, put, del }),
    [axiosInstance, get, post, put, del]
  );

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
}