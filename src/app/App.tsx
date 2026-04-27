import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "@/app/route";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function App() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const isBirthDateCompleted = searchParams.get("isBirthDateCompleted");
    const isPhoneCompleted = searchParams.get("isPhoneCompleted");

    if (!accessToken) return;

    setAuth({}, accessToken);

    // Contract (line 257): redirect params dari backend sudah berisi isBirthDateCompleted & isPhoneCompleted
    if (isBirthDateCompleted === "false") {
      navigate("/login/complete-profile", { replace: true });
    } else if (isPhoneCompleted === "false") {
      navigate("/login/verify-phone", { replace: true });
    } else {
      navigate("/r", { replace: true });
    }
  }, [searchParams, setAuth, navigate]);

  return <AppRoutes />;
}
