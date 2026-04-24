import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth, fetchUser } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const isProfileComplete = searchParams.get("isProfileComplete");
    const isEmailVerified = searchParams.get("isEmailVerified");

    if (!accessToken) {
      navigate("/login", { replace: true });
      return;
    }

    setAuth({}, accessToken);

    const target = new URLSearchParams();
    if (isProfileComplete === "false") {
      target.set("isEmailVerified", isEmailVerified ?? "false");
      fetchUser().then(() => navigate(`/login/complete-profile?${target}`, { replace: true }));
    } else {
      fetchUser().then(() => navigate("/r", { replace: true }));
    }
  }, [searchParams, setAuth, fetchUser, navigate]);

  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#16A34A] border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Memproses login...</p>
      </div>
    </div>
  );
}