import React, { useState } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";

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

interface FieldErrors {
  firstname?: string;
  lastname?: string;
  username?: string;
  email?: string;
  password?: string;
  phone?: string;
  birthDate?: string;
}

type ResetStep = "request" | "otp" | "set-password";

interface AuthPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  signInError?: string;
  signUpError?: string;
  signUpSuccess?: string;
  onSignIn?: (
    event: React.FormEvent<HTMLFormElement>,
    setFieldError: (field: string, msg: string) => void,
  ) => void;
  onSignUp?: (
    event: React.FormEvent<HTMLFormElement>,
    setFieldError: (field: string, msg: string) => void,
    setServerError: (msg: string) => void,
  ) => void;
  onGoogleSignIn?: () => void;
  onGoogleSignUp?: () => void;
  onResetPassword?: (email: string) => void;
  onVerifyOtp?: (email: string, otp: string) => void;
  onSetNewPassword?: (email: string, otp: string, newPassword: string) => void;
  onResetPasswordLink?: (email: string) => void;
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
  signInError,
  signUpError,
  signUpSuccess,
  onSignIn,
  onSignUp,
  onResetPassword,
  onVerifyOtp,
  onSetNewPassword,
  onGoogleSignIn,
  onGoogleSignUp,
  onResetPasswordLink,
}) => {
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState("");
  const [signupWarning, setSignupWarning] = useState(false);

  const isSignUp = mode === "signup";
  const isReset = mode === "reset";

  const setFieldError = (field: string, msg: string) => {
    setFieldErrors((prev) => ({ ...prev, [field]: msg }));
  };

  const clearFieldError = (field: string) => {
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const clearAllErrors = () => {
    setFieldErrors({});
    setServerError("");
  };

  const handleModeSwitch = (newMode: "signin" | "signup") => {
    clearAllErrors();
    setSignupWarning(false);
    setMode(newMode);
  };

  const fieldErrorClass = (field: string) =>
    fieldErrors[field] ? "border-red-500" : "";

  // Validation helpers
  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const isValidPassword = (v: string) =>
    v.length >= 8 &&
    /[A-Z]/.test(v) &&
    /[a-z]/.test(v) &&
    /[0-9]/.test(v) &&
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v);

  const isValidPhone = (v: string) => /^(\+62|62|0)[0-9]{9,13}$/.test(v);

  const isValidBirthDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);

  const handleSignInSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    clearAllErrors();
    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") as string)?.trim();
    const password = (fd.get("password") as string) || "";
    let hasError = false;

    if (!email) {
      setFieldError("email", "Email atau username wajib diisi");
      hasError = true;
    }
    if (!password) {
      setFieldError("password", "Password wajib diisi");
      hasError = true;
    }

    if (!hasError && onSignIn) {
      onSignIn(e, setFieldError);
    } else {
      e.preventDefault();
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    clearAllErrors();
    setSignupWarning(false);
    const fd = new FormData(e.currentTarget);
    const firstname = (fd.get("firstname") as string)?.trim();
    const lastname = (fd.get("lastname") as string)?.trim();
    const username = (fd.get("username") as string)?.trim();
    const email = (fd.get("email") as string)?.trim();
    const password = fd.get("password") as string;
    const phone = (fd.get("phone") as string)?.trim();
    const day = (fd.get("day") as string)?.trim();
    const month = (fd.get("month") as string)?.trim();
    const year = (fd.get("year") as string)?.trim();
    let hasError = false;

    if (!firstname) {
      setFieldError("firstname", "Nama depan wajib diisi");
      hasError = true;
    }
    if (!username) {
      setFieldError("username", "Username wajib diisi");
      hasError = true;
    }
    if (!email) {
      setFieldError("email", "Email wajib diisi");
      hasError = true;
    } else if (!isValidEmail(email)) {
      setFieldError("email", "Format email tidak valid");
      hasError = true;
    }
    if (!password) {
      setFieldError("password", "Password wajib diisi");
      hasError = true;
    } else {
      const errs: string[] = [];
      if (password.length < 8) errs.push("minimal 8 karakter");
      if (!/[A-Z]/.test(password)) errs.push("minimal 1 huruf besar");
      if (!/[a-z]/.test(password)) errs.push("minimal 1 huruf kecil");
      if (!/[0-9]/.test(password)) errs.push("minimal 1 angka");
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
        errs.push("minimal 1 karakter khusus (!@#$%^&* dll)");
      if (errs.length > 0) {
        setFieldError("password", `Password harus: ${errs.join(", ")}`);
        hasError = true;
      }
    }
    if (!phone) {
      setFieldError("phone", "Nomor telepon wajib diisi");
      hasError = true;
    } else if (!isValidPhone(phone)) {
      setFieldError(
        "phone",
        "Format nomor telepon harus +62xxxxxxxxx (contoh: +6281234567890)",
      );
      hasError = true;
    }
    if (!day || !month || !year) {
      setFieldError("birthDate", "Tanggal lahir wajib diisi lengkap");
      hasError = true;
    } else {
      const birthDateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      if (!isValidBirthDate(birthDateStr)) {
        setFieldError("birthDate", "Format tanggal lahir tidak valid");
        hasError = true;
      } else {
        const dob = new Date(birthDateStr);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        if (dob > today || age < 13) {
          setFieldError("birthDate", "Umur minimal 13 tahun");
          hasError = true;
        }
      }
    }

    if (!hasError && onSignUp) {
      onSignUp(e, setFieldError, setServerError);
    } else {
      e.preventDefault();
    }
  };

  return (
    <div className="min-h-dvh flex flex-col md:flex-row font-geist w-dvw overflow-hidden">
      <section className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8 ">
          <img className="w-45 mb-4 " src="assets/logo.png" alt="logo" />
          <div className="flex gap-1 bg-foreground/5 border border-border rounded-2xl p-1 mb-1 ">
            <button
              onClick={() => handleModeSwitch("signin")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                !isSignUp
                  ? "bg-[#16A34A] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => handleModeSwitch("signup")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                isSignUp
                  ? "bg-[#16A34A] text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Headisdasdasdasdng */}
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
                      Get back to jungle ?
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
              {/* Server error banner */}
              {signInError && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-600">
                  {signInError}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSignInSubmit}>
                <div>
                  <GlassInputWrapper>
                    <input
                      name="email"
                      type="text"
                      placeholder="email or username"
                      className={`${inputClass} ${fieldErrors.email ? "border-red-500" : ""}`}
                      onInput={() => clearFieldError("email")}
                    />
                  </GlassInputWrapper>
                  {fieldErrors.email && (
                    <p className="text-xs text-red-500 mt-1 ml-1">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <GlassInputWrapper>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="passcode"
                        className={`${inputClass} pr-12 ${fieldErrors.password ? "border-red-500" : ""}`}
                        onInput={() => clearFieldError("password")}
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
                  {fieldErrors.password && (
                    <p className="text-xs text-red-500 mt-1 ml-1">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

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
                      alert("Fitur reset password segera hadir");
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
              {/* Server error banner */}
              {(serverError || signUpError) && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-600">
                  {serverError || signUpError}
                </div>
              )}

              {/* Success banner */}
              {signUpSuccess && (
                <div className="rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-600">
                  {signUpSuccess}
                </div>
              )}

              {/* Warning banner */}
              {signupWarning && (
                <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/30 px-4 py-3 text-sm text-yellow-700 flex items-start gap-3">
                  <span className="flex-1">
                    <strong>Heads up!</strong> Make sure all information is filled
                    in correctly before submitting. Once registered, certain
                    details cannot be changed.
                  </span>
                  <button
                    type="button"
                    onClick={() => setSignupWarning(false)}
                    className="text-yellow-700 hover:text-yellow-900 shrink-0 font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}

              <form className="space-y-2.5" onSubmit={handleSignUpSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <GlassInputWrapper>
                      <input
                        name="firstname"
                        type="text"
                        placeholder="First name"
                        className={`${inputClass} ${fieldErrors.firstname ? "border-red-500" : ""}`}
                        onInput={() => clearFieldError("firstname")}
                        onFocus={() => setSignupWarning(true)}
                      />
                    </GlassInputWrapper>
                    {fieldErrors.firstname && (
                      <p className="text-xs text-red-500 mt-1 ml-1">
                        {fieldErrors.firstname}
                      </p>
                    )}
                  </div>
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
                <div>
                  <GlassInputWrapper>
                    <input
                      name="username"
                      type="text"
                      placeholder="Username"
                      className={`${inputClass} ${fieldErrors.username ? "border-red-500" : ""}`}
                      onInput={() => clearFieldError("username")}
                    />
                  </GlassInputWrapper>
                  {fieldErrors.username && (
                    <p className="text-xs text-red-500 mt-1 ml-1">
                      {fieldErrors.username}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <GlassInputWrapper>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="+62xxxxxxxxx"
                      className={`${inputClass} ${fieldErrors.phone ? "border-red-500" : ""}`}
                      onInput={() => clearFieldError("phone")}
                    />
                  </GlassInputWrapper>
                  {fieldErrors.phone && (
                    <p className="text-xs text-red-500 mt-1 ml-1">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>

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
                        className={`${inputClass} ${fieldErrors.birthDate ? "border-red-500" : ""}`}
                        onInput={() => clearFieldError("birthDate")}
                      />
                    </GlassInputWrapper>

                    {/* Month */}
                    <GlassInputWrapper>
                      <div className="relative">
                        <select
                          name="month"
                          defaultValue=""
                          className={`${inputClass} appearance-none pr-8 cursor-pointer ${fieldErrors.birthDate ? "border-red-500" : ""}`}
                          onChange={() => clearFieldError("birthDate")}
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
                        className={`${inputClass} ${fieldErrors.birthDate ? "border-red-500" : ""}`}
                        onInput={() => clearFieldError("birthDate")}
                      />
                    </GlassInputWrapper>
                  </div>
                  {fieldErrors.birthDate && (
                    <p className="text-xs text-red-500 mt-1 ml-1">
                      {fieldErrors.birthDate}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <GlassInputWrapper>
                    <input
                      name="email"
                      type="email"
                      placeholder="Email address"
                      className={`${inputClass} ${fieldErrors.email ? "border-red-500" : ""}`}
                      onInput={() => clearFieldError("email")}
                    />
                  </GlassInputWrapper>
                  {fieldErrors.email && (
                    <p className="text-xs text-red-500 mt-1 ml-1">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <GlassInputWrapper>
                    <div className="relative">
                      <input
                        name="password"
                        type={showSignUpPassword ? "text" : "password"}
                        placeholder="Password"
                        className={`${inputClass} pr-12 ${fieldErrors.password ? "border-red-500" : ""}`}
                        onInput={() => clearFieldError("password")}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowSignUpPassword(!showSignUpPassword)
                        }
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
                  {/* Password requirements hint */}
                  <p className="text-[10px] text-muted-foreground mt-1 ml-1 leading-relaxed">
                    Minimal 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka, 1
                    karakter khusus (!@#$%^&amp;* dll)
                  </p>
                  {fieldErrors.password && (
                    <p className="text-xs text-red-500 mt-1 ml-1">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

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
