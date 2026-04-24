import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppRoutes from "@/app/route";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function App() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth, fetchUser } = useAuthStore();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const isProfileComplete = searchParams.get("isProfileComplete");

    if (!accessToken) return;

    setAuth({}, accessToken);

    if (isProfileComplete === "false") {
      fetchUser().then(() => navigate("/login/complete-profile", { replace: true }));
    } else {
      fetchUser().then(() => navigate("/r", { replace: true }));
    }
  }, [searchParams, setAuth, fetchUser, navigate]);

  return <AppRoutes />;
}
