import { AuthPage } from "@/components/sign-in-up";
import { useNavigate } from "react-router-dom";

const SignInPageDemo = () => {
  // const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);
  //   const data = Object.fromEntries(formData.entries());
  //   console.log("Sign In submitted:", data);
  //   alert(`Sign In Submitted! Check the browser console for form data.`);
  // };
  const DUMMY_USER = {
    username: "a",
    password: "1",
  };

  const navigate = useNavigate();

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const username = formData.get("email");
    const password = formData.get("password");

    if (username === DUMMY_USER.username && password === DUMMY_USER.password) {
      localStorage.setItem("isLoggedIn", "true");

      navigate("/landing", { replace: true });
    }
  };

  const handleSignUp = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log("Sign Up submitted:", data);
    alert(`Sign Up Submitted! Check the browser console for form data.`);
  };

  const handleGoogleSignIn = () => {
    console.log("Continue with Google clicked");
    alert("Continue with Google clicked");
  };

  const handleGoogleSignUp = () => {
    console.log("Sign up with Google clicked");
    alert("Sign up with Google clicked");
  };

  const handleResetPassword = () => {
    alert("Reset Password clicked");
  };

  const handleCreateAccount = () => {
    console.log("Create Account clicked");
  };

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      <AuthPage
        heroImageSrc="assets/dummyhero.jpg"
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onGoogleSignIn={handleGoogleSignIn}
        onGoogleSignUp={handleGoogleSignUp}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
    </div>
  );
};

export default SignInPageDemo;
