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
      const msg = err.response?.data?.message || "Login gagal";
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
      return await authService.signUp(payload);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Register gagal";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading, error };
};