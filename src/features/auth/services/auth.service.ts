import axios from "axios";
import { useAuthStore } from "@/features/auth/store/auth.store";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const signIn = async (usernameOrEmail: string, password: string) => {
  const res = await API.post("/public/api/auth/login", {
    usernameOrEmail,
    password,
  });
  return res;
};

export const signUp = async (data: Record<string, any>) => {
  const res = await API.post("/public/api/auth/register", data);
  return res;
};