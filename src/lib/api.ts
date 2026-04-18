import axios from "axios";
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
];

API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  const isPublic = PUBLIC_AUTH_PATHS.some((p) => config.url?.includes(p));
  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});