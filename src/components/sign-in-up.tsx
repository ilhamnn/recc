import React, { useState } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";

// --- HELPER COMPONENTS (ICONS) ---

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 48 48"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z"
    />
  </svg>
);

// --- PROPS ---

interface AuthPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  onSignIn?: (event: React.FormEvent<HTMLFormElement>) => void;
  onSignUp?: (event: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignIn?: () => void;
  onGoogleSignUp?: () => void;
  onResetPassword?: () => void;
  onCreateAccount?: () => void;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-[#16A34A] focus-within:bg-[#A0F2BE]/60">
    {children}
  </div>
);

const inputClass =
  "w-full bg-transparent text-sm px-4 py-2 rounded-2xl focus:outline-none h-[50px]";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// --- MAIN COMPONENT ---

export const AuthPage: React.FC<AuthPageProps> = ({
  title,
  description,
  heroImageSrc,
  onSignIn,
  onSignUp,
  onGoogleSignIn,
  onGoogleSignUp,
  onResetPassword,
}) => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  const isSignUp = mode === "signup";

  return (
    <div className="min-h-dvh flex flex-col md:flex-row font-geist w-dvw overflow-hidden">
      {/* Left column */}
      <section className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8 ">
          {/* Logo */}
          <img className="w-45 mb-4 " src="src/assets/logo.png" alt="logo" />

          {/* Toggle tabs */}
          <div className="flex gap-1 bg-foreground/5 border border-border rounded-2xl p-1 mb-1 ">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                !isSignUp
                  ? "bg-[#16A34A] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                isSignUp
                  ? "bg-[#16A34A] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Heading */}
          <div className="mb-2 ">
            <h1 className="text-4xl md:text-4xl font-bold leading-tight mb-2 mt-2">
              {isSignUp
                ? (title ?? (
                    <span className="font-light text-foreground tracking-tighter">
                      Join the jungle
                    </span>
                  ))
                : (title ?? (
                    <span className="font-light text-foreground tracking-tighter">
                      Welcome to jungle
                    </span>
                  ))}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp
                ? (description ?? "Create your account and start earning")
                : (description ?? "Let's make money with us")}
            </p>
          </div>

          {/* ======================== SIGN IN FORM ======================== */}
          {!isSignUp && (
            <div className="flex flex-col gap-5 ">
              <form className="space-y-5" onSubmit={onSignIn}>
                <GlassInputWrapper>
                  <input
                    name="email"
                    type="email"
                    placeholder="email or username"
                    className={inputClass}
                  />
                </GlassInputWrapper>

                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="passcode"
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      className="custom-checkbox"
                    />
                    <span className="text-foreground/90">
                      Keep me signed in
                    </span>
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onResetPassword?.();
                    }}
                    className="hover:underline text-[#16A34A] transition-colors"
                  >
                    Reset password
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#16A34A] py-4 font-medium text-white hover:bg-[#1DB555]/90 transition-colors"
                >
                  Sign In
                </button>
              </form>

              <div className="relative flex items-center justify-center">
                <span className="w-full border-t border-border"></span>
                <span className="px-4 text-sm text-muted-foreground bg-background absolute">
                  Or continue with
                </span>
              </div>

              <button
                onClick={onGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors"
              >
                <GoogleIcon />
                Continue with Google
              </button>
            </div>
          )}

          {/* ======================== SIGN UP FORM ======================== */}
          {isSignUp && (
            <div className="flex flex-col gap-5">
              <form className="space-y-2.5" onSubmit={onSignUp}>
                <div className="grid grid-cols-2 gap-3">
                  <GlassInputWrapper>
                    <input
                      name="firstname"
                      type="text"
                      placeholder="First name"
                      className={inputClass}
                    />
                  </GlassInputWrapper>
                  <GlassInputWrapper>
                    <input
                      name="lastname"
                      type="text"
                      placeholder="Last name"
                      className={inputClass}
                    />
                  </GlassInputWrapper>
                </div>

                {/* Username */}
                <GlassInputWrapper>
                  <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    className={inputClass}
                  />
                </GlassInputWrapper>

                {/* Phone */}
                <GlassInputWrapper>
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    className={inputClass}
                  />
                </GlassInputWrapper>

                {/* Birthday */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2 ml-1">
                    Date of birth
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Day */}
                    <GlassInputWrapper>
                      <input
                        name="day"
                        type="number"
                        placeholder="Day"
                        min={1}
                        max={31}
                        className={inputClass}
                      />
                    </GlassInputWrapper>

                    {/* Month */}
                    <GlassInputWrapper>
                      <div className="relative">
                        <select
                          name="month"
                          defaultValue=""
                          className={`${inputClass} appearance-none pr-8 cursor-pointer`}
                        >
                          <option
                            value=""
                            disabled
                            className="text-muted-foreground"
                          >
                            Month
                          </option>
                          {MONTHS.map((m, i) => (
                            <option key={m} value={i + 1}>
                              {m}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                    </GlassInputWrapper>

                    {/* Year */}
                    <GlassInputWrapper>
                      <input
                        name="year"
                        type="number"
                        placeholder="Year"
                        min={1900}
                        max={new Date().getFullYear()}
                        className={inputClass}
                      />
                    </GlassInputWrapper>
                  </div>
                </div>

                {/* Email */}
                <GlassInputWrapper>
                  <input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    className={inputClass}
                  />
                </GlassInputWrapper>

                {/* Passcode */}
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      name="password"
                      type={showSignUpPassword ? "text" : "password"}
                      placeholder="Passcode"
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      className="absolute inset-y-0 right-3 flex items-center"
                    >
                      {showSignUpPassword ? (
                        <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>

                {/* Register button */}
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-[#16A34A] py-4 font-medium text-white hover:bg-[#1DB555]/90 transition-colors"
                >
                  Register
                </button>
              </form>

              <div className="relative flex items-center justify-center">
                <span className="w-full border-t border-border"></span>
                <span className="px-4 text-sm text-muted-foreground bg-background absolute">
                  Or sign up with
                </span>
              </div>

              <button
                onClick={onGoogleSignUp}
                className="w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors"
              >
                <GoogleIcon />
                Sign up with Google
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Right column: hero image */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative ">
          <div
            className="absolute inset-0 bg-cover bg-center "
            style={{ backgroundImage: `url(${heroImageSrc})` }}
          />
        </section>
      )}
    </div>
  );
};
