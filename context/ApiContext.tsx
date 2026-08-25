"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  useState,
} from "react";
import axios, { isCancel } from "axios";
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

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
  const [serverError, setServerError] = useState<string | null>(null);

  /**
   * Create Axios instance only once.
   */
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: apiUrl,
      headers: { "Content-Type": "application/json" },
    });

    /**
     * Request interceptor — attach JWT token from Cognito.
     */
    instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        if (token) {
          config.headers.set("Authorization", `Bearer ${token}`);
        }
      } catch (err) {
        console.warn("No active Cognito session.");
      }
      return config;
    });

    /**
     * Response interceptor
     * - Silently ignores AbortController cancellations (React StrictMode cleanup)
     * - On 401 — token missing/expired — redirect to login
     */
    instance.interceptors.response.use(
      (response) => {
        setServerError(null);
        return response;
      },
      (error) => {
        if (isCancel(error) || error?.name === "AbortError") {
          return Promise.reject(error);
        }

        if (error.code === 'ERR_NETWORK' || !error.response || error.response?.status === 500 || error.response?.status === 503) {
          setServerError("Server is not up or functioning properly. Please check the backend.");
        }

        if (error.response?.status === 401 && typeof window !== "undefined") {
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
      {serverError && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4">
          <div className="rounded-2xl bg-white p-8 shadow-2xl max-w-md w-full text-center space-y-4 border-t-4 border-red-500">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 font-poppins">Connection Error</h2>
            <p className="text-gray-600 font-nunito">{serverError}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 w-full rounded-lg bg-[#622581] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#622581]/90"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}
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