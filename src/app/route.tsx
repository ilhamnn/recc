import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "@/pages/landing/Landing";
import ProtectedRoute from "@/features/auth/components/ProtectedRoute";

import LoginPage from "@/features/auth/pages/Gate";
import RegisterPage from "@/features/auth/pages/Gate"; // same component, backend handles mode via redirectPath
import VerifyEmailPage from "@/features/auth/pages/VerifyEmail";
import CompleteProfilePage from "@/features/auth/pages/CompleteProfile";
import PenerimaPage from "@/features/auth/pages/Penerima";
import PemberiPage from "@/features/auth/pages/Pemberi";

import MainLayout from "./layouts/MainLAy";
import AuthLayout from "./layouts/AuthLAy";

export default function AppRoutes() {
  return (
    <Routes>
      {/* AUTH (tanpa navbar) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login/verify-email" element={<VerifyEmailPage />} />
        <Route path="/login/complete-profile" element={<CompleteProfilePage />} />
      </Route>

      {/* MAIN (dengan navbar) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/r" element={<PenerimaPage />} />
          <Route path="/g" element={<PemberiPage />} />
        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
