// src/components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoute() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}
