import { AuthPage } from "@/features/auth/pages/sign-in-up";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store/auth.store";

const SignInPageDemo = () => {
  const navigate = useNavigate();
  const { login, register, error } = useAuth();
  const { user, setAuth } = useAuthStore();

  if (user) return <Navigate to="/r" replace />;

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const usernamOrEmail = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log("Input:", { usernamOrEmail, password }); // cek input kekirim

    try {
      const res = await login(usernamOrEmail, password);
      console.log("Full response:", res); // cek structure response
      console.log("res.data:", res.data); // cek isinya
      console.log("token:", res.data?.accessToken); // cek tokennya ada ga

      const token = res.data?.accessToken;
      const user = res.data;
      setAuth(user, token);
      navigate("/r", { replace: true });
    } catch (err) {
      console.log("Error:", err); // cek error-nya apa
    }
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    // Format birthDate YYYY-MM-DD
    const birthDate = `${rawData.year}-${String(rawData.month).padStart(
      2,
      "0",
    )}-${String(rawData.day).padStart(2, "0")}`;

    const payload = {
      firstName: rawData.firstname,
      lastName: rawData.lastname,
      username: rawData.username,
      email: rawData.email,
      password: rawData.password,
      phone: rawData.phone,
      birthDate,
    };

    try {
      const res = await register(payload);
      const token = res.data?.accessToken;
      const user = res.data;
      setAuth(user, token);
      navigate("/r", { replace: true });
    } catch {}
  };

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <AuthPage
        heroImageSrc="assets/dummyhero.jpg"
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onGoogleSignIn={() => alert("Google Sign In")}
        onGoogleSignUp={() => alert("Google Sign Up")}
        onResetPassword={() => alert("Reset Password")}
        onCreateAccount={() => {}}
      />
    </div>
  );
};

export default SignInPageDemo;
