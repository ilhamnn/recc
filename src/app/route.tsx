import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/pages/landing/Landing";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

import LoginPage from "@/features/auth/pages/Gate";
import PenerimaPage from "@/features/auth/pages/Penerima";
import PemberiPage from "@/features/auth/pages/Pemberi";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/r" element={<PenerimaPage />} />
        <Route path="/g" element={<PemberiPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
