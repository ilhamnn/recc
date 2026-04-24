import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/features/auth/store/auth.store";

const BASE_URL = import.meta.env.VITE_API_URL;

export const API = axios.create({
  baseURL: BASE_URL,
});

const PUBLIC_AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/public/api/auth/login",
  "/public/api/auth/register",
  "/public/api/auth/refresh",
  "/public/api/emailVerifications/send-verification",
  "/emailVerifications/send-verification",
  "/emailVerifications/verify",
  "/public/api/auth/google",
  "/auth/google/callback",
];

API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const data = err.response?.data as any;

    let errorMessage = err.message;

    if (data) {
      if (typeof data.errors === "string" && data.errors) {
        // "Username already exists"
        errorMessage = data.errors;
        console.log("1:", data)
      } else if (Array.isArray(data.errors) && data.errors.length > 0) {
        // [{ path: "username", message: "..." }, ...]
        console.log("2:",data)
        errorMessage = data.errors.map((e: { path: string; message: string }) => e.message).join(", ");
      } else if (typeof data.message === "string" && data.message) {
        // fallback ke message
        errorMessage = data.message;
        console.log("3:",data)
      }
    }

    err.message = errorMessage;
    return Promise.reject(err);
  }
);