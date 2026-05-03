import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { useAuthStore } from "@/features/auth/store/auth.store";

const BASE_URL = import.meta.env.VITE_API_URL;

export const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest = err.config as AxiosRequestConfig & { _retry?: boolean };

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers!.Authorization = `Bearer ${token}`;
          return API(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await API.post("/public/api/auth/refresh");
        const newToken = res.data?.data?.newAccessToken as string;

        if (newToken) {
          const currentUser = useAuthStore.getState().user;
          useAuthStore.getState().setAuth(currentUser, newToken);

          originalRequest.headers!.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);
          return API(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Error non-401: format seperti biasa
    const data = err.response?.data as any;
    let errorMessage = err.message;

    if (data) {
      if (typeof data.errors === "string" && data.errors) {
        errorMessage = data.errors;
      } else if (Array.isArray(data.errors) && data.errors.length > 0) {
        errorMessage = data.errors.map((e: { path: string; message: string }) => e.message).join(", ");
      } else if (typeof data.message === "string" && data.message) {
        errorMessage = data.message;
      }
    }

    err.message = errorMessage;
    (err as any).apiErrors = typeof data?.errors === "string" ? data.errors : errorMessage;
    (err as any).apiMessage = typeof data?.message === "string" ? data.message : errorMessage;
    return Promise.reject(err);
  }
);