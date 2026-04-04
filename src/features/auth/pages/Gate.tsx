import { AuthPage } from "@/features/auth/pages/sign-in-up";
import { useNavigate, Navigate } from "react-router-dom";

const SignInPageDemo = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (isLoggedIn) return <Navigate to="/r" replace />;

  const DUMMY_USER = { username: "a", password: "1" };

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("email");
    const password = formData.get("password");

    if (username === DUMMY_USER.username && password === DUMMY_USER.password) {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/r", { replace: true });
    }
  };

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Sign Up submitted:", data);
    localStorage.setItem("isLoggedIn", "true");
    navigate("/r", { replace: true });
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
