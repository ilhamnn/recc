import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function ProtectedRoute() {
  const { token, isHydrated } = useAuthStore();

  if (!isHydrated) return null;

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}