import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const isBirthDateCompleted = searchParams.get("isBirthDateCompleted");
    const isPhoneCompleted = searchParams.get("isPhoneCompleted");

    if (!accessToken) {
      navigate("/login", { replace: true });
      return;
    }

    setAuth({}, accessToken);

    // Contract (line 257): redirect params dari backend sudah berisi isBirthDateCompleted & isPhoneCompleted
    // isBirthDateCompleted = user.birthDate ? true : false
    // isPhoneCompleted = user.isPhoneVerified === true && user.phoneVerifiedAt ? true : false
    if (isBirthDateCompleted === "false") {
      navigate("/login/complete-profile", { replace: true });
    } else if (isPhoneCompleted === "false") {
      navigate("/login/verify-phone", { replace: true });
    } else {
      navigate("/r", { replace: true });
    }
  }, [searchParams, setAuth, navigate]);

  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#16A34A] border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Memproses login...</p>
      </div>
    </div>
  );
}