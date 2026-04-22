import { useState, useEffect } from "react";
import { AuthPage } from "@/features/auth/pages/sign-in-up";
import { useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store/auth.store";

const GatePage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { token, setAuth } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [signInError, setSignInError] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState("");

  // Handle Google OAuth callback — backend redirect ke:
  // /login?accessToken=...&isProfileComplete=... (signin)
  // /register?accessToken=...&isProfileComplete=... (signup)
  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const isProfileComplete = searchParams.get("isProfileComplete");

    if (accessToken) {
      if (isProfileComplete === "false") {
        setAuth({}, accessToken);
        navigate("/login/complete-profile", { replace: true });
      } else {
        setAuth({}, accessToken);
        navigate("/r", { replace: true });
      }
    }
  }, [searchParams, setAuth, navigate]);

  if (token) return <Navigate to="/r" replace />;

  const handleSignIn = async (
    event: React.FormEvent<HTMLFormElement>,
    _setFieldError: (field: string, msg: string) => void,
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const usernamOrEmail = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { accessToken } = await login(usernamOrEmail, password);
      setAuth({ email: usernamOrEmail }, accessToken);
      navigate("/r", { replace: true });
    } catch (err: any) {
      setSignInError(
        err?.message || "Email, username, atau password salah",
      );
    }
  };

  const handleSignUp = async (
    event: React.FormEvent<HTMLFormElement>,
    _setFieldError: (field: string, msg: string) => void,
    _setServerError: (msg: string) => void,
  ) => {
    event.preventDefault();
    setSignUpError("");
    setSignUpSuccess("");
    const formData = new FormData(event.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    const payload = {
      username: rawData.username as string,
      email: rawData.email as string,
      password: rawData.password as string,
      firstName: rawData.firstname as string,
      lastName: (rawData.lastname as string) || undefined,
      birthDate: `${rawData.year}-${String(rawData.month).padStart(2, "0")}-${String(rawData.day).padStart(2, "0")}`,
      phone: rawData.phone as string,
    };

    try {
      const res = await register(payload);
      const user = res;
      const token = res?.accessToken;
      if (token) {
        setAuth(user, token);
        navigate("/r", { replace: true });
      } else {
        navigate(`/login/verify-email?email=${encodeURIComponent(rawData.email as string)}`, { replace: true });
      }
    } catch (err: any) {
      setSignUpError(err?.message || "Registrasi gagal. Silakan coba lagi.");
    }
  };

  const handleGoogleSignIn = () => {
    import("@/lib/services/auth.service").then(({ signInWithGoogle }) => {
      signInWithGoogle();
    });
  };

  const handleGoogleSignUp = () => {
    import("@/lib/services/auth.service").then(({ signUpWithGoogle }) => {
      signUpWithGoogle();
    });
  };

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <AuthPage
        heroImageSrc="assets/dummyhero.jpg"
        signInError={signInError}
        signUpError={signUpError}
        signUpSuccess={signUpSuccess}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onGoogleSignIn={handleGoogleSignIn}
        onGoogleSignUp={handleGoogleSignUp}
      />
    </div>
  );
};

export default GatePage;
