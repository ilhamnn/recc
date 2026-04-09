import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function ProtectedRoute() {
  const { token } = useAuthStore();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}
