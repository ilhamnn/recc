import { useState } from "react";
import * as authService from "@/features/auth/services/auth.service";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (usernamOrEmail: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      return await authService.signIn(usernamOrEmail, password);
    } catch (err: any) {
      const data = err.response?.data;
      const msg = data?.errors || data?.message || "Login gagal";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: Record<string, any>) => {
    setError(null);
    setLoading(true);
    try {
      return await authService.signUp(payload as Parameters<typeof authService.signUp>[0]);
    } catch (err: any) {
      const data = err.response?.data;
      const msg = data?.errors || data?.message || "Register gagal";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
  };

  return { login, register, logout, loading, error };
};