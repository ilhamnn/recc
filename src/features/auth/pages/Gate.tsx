import { useState, useEffect } from "react";
import { AuthPage } from "@/features/auth/pages/sign-in-up";
import { useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { completeUserProfile } from "@/lib/services/user.service";

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

const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));

const GatePage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { token, isHydrated, setAuth } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [signInError, setSignInError] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [profileData, setProfileData] = useState({
    day: "",
    month: "",
    year: "",
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
    {},
  );
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileServerError, setProfileServerError] = useState("");

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const isBirthDateVerified = searchParams.get("isBirthDateVerified");
    const isPhoneVerified = searchParams.get("isPhoneVerified");

    if (accessToken) {
      setAuth({}, accessToken);

      // Google email auto-verified → tidak perlu cek isEmailVerified
      if (isBirthDateVerified === "false") {
        setShowProfileModal(true);
      } else if (isPhoneVerified === "false") {
        navigate("/login/verify-phone", { replace: true });
      } else {
        navigate("/r", { replace: true });
      }
    }
  }, [searchParams, setAuth, navigate]);

  // Contract login: { success, message, data: { accessToken, isEmailVerified, isPhoneVerified, isBirthDateVerified } }
  const handleSignIn = async (
    event: React.FormEvent<HTMLFormElement>,
    _setFieldError: (field: string, msg: string) => void,
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const usernamOrEmail = formData.get("email") as string;
    const password = formData.get("password") as string;

    setIsAuthenticating(true);
    setSignInError("");

    try {
      const res = await login(usernamOrEmail, password);
      const { data } = res || {};
      const {
        accessToken,
        isEmailVerified,
        isPhoneVerified,
        isBirthDateVerified,
      } = data || {};

      // Simpan token
      setAuth({ email: usernamOrEmail }, accessToken);

      // Cek verify flow — mulai dari email → phone → birth date
      if (isEmailVerified === false) {
        navigate(
          `/login/verify-email?email=${encodeURIComponent(usernamOrEmail)}`,
          { replace: true },
        );
      } else if (isPhoneVerified === false) {
        navigate("/login/verify-phone", { replace: true });
      } else if (isBirthDateVerified === false) {
        navigate("/login/complete-profile", { replace: true });
      } else {
        navigate("/r", { replace: true });
      }
    } catch (err: any) {
      setSignInError(err?.message || "Email, username, atau password salah");
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Contract register: { success, message, data: { id, username, email, isEmailVerified: false, isPhoneVerfied: false, ... } }
  // Register TIDAK return accessToken → user harus verifikasi email dulu, baru login
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
      await register(payload);

      // Register tidak return token → redirect ke verify-email
      setSignUpSuccess("Registrasi berhasil! Silakan verifikasi email kamu.");
      navigate(
        `/login/verify-email?email=${encodeURIComponent(rawData.email as string)}`,
        { replace: true },
      );
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

  // ─── Profile completion modal (Google OAuth — birth date only) ─────────────
  const setFieldError = (field: string, msg: string) =>
    setProfileErrors((prev) => ({ ...prev, [field]: msg }));
  const clearFieldError = (field: string) =>
    setProfileErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileServerError("");
    const newErrors: Record<string, string> = {};
    let hasError = false;

    if (!profileData.day || !profileData.month || !profileData.year) {
      newErrors.birthDate = "Tanggal lahir wajib diisi lengkap";
      hasError = true;
    } else {
      const bd = `${profileData.year}-${String(profileData.month).padStart(2, "0")}-${String(profileData.day).padStart(2, "0")}`;
      const dob = new Date(bd);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (dob > today || age < 15) {
        newErrors.birthDate = "Umur minimal 15 tahun";
        hasError = true;
      }
    }

    if (hasError) {
      setProfileErrors(newErrors);
      return;
    }

    setProfileSubmitting(true);
    try {
      const birthDate = `${profileData.year}-${String(profileData.month).padStart(2, "0")}-${String(profileData.day).padStart(2, "0")}`;
      await completeUserProfile({ birthDate });
      navigate("/login/verify-phone", { replace: true });
    } catch (err: any) {
      setProfileServerError(err?.message || "Gagal menyimpan profil.");
    } finally {
      setProfileSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-foreground overflow-x-hidden">
      {showProfileModal ? (
        <div className="min-h-dvh flex items-center justify-center p-8">
          <div className="w-full max-w-md bg-background rounded-2xl border border-border shadow-xl p-8">
            <div className="text-center mb-6">
              <img
                className="w-16 mx-auto mb-3"
                src="/assets/logo.png"
                alt="logo"
              />
              <h2 className="text-2xl font-bold text-foreground">
                Lengkapi Profil Kamu
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Masukkan tanggal lahir sebelum mulai.
              </p>
            </div>

            {profileServerError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-600 mb-4">
                {profileServerError}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleProfileSubmit}>
              {/* Birth date */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                  Tanggal Lahir
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={profileData.day}
                    onChange={(e) => {
                      setProfileData((p) => ({ ...p, day: e.target.value }));
                      clearFieldError("birthDate");
                    }}
                    placeholder="DD"
                    min={1}
                    max={31}
                    className={`w-full bg-transparent text-sm px-3 py-2 rounded-2xl border h-[50px] focus:outline-none transition-colors focus-within:border-[#16A34A] focus-within:bg-[#A0F2BE]/60 ${
                      profileErrors.birthDate
                        ? "border-red-500"
                        : "border-border"
                    }`}
                  />
                  <div className="relative">
                    <select
                      value={profileData.month}
                      onChange={(e) => {
                        setProfileData((p) => ({
                          ...p,
                          month: e.target.value,
                        }));
                        clearFieldError("birthDate");
                      }}
                      className={`w-full bg-transparent text-sm px-3 py-2 rounded-2xl border h-[50px] focus:outline-none transition-colors focus-within:border-[#16A34A] focus-within:bg-[#A0F2BE]/60 appearance-none pr-7 cursor-pointer ${
                        profileErrors.birthDate
                          ? "border-red-500"
                          : "border-border"
                      }`}
                    >
                      <option
                        value=""
                        disabled
                        className="text-muted-foreground"
                      >
                        Mo
                      </option>
                      {MONTHS_SHORT.map((m, i) => (
                        <option key={m} value={i + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <input
                    type="number"
                    value={profileData.year}
                    onChange={(e) => {
                      setProfileData((p) => ({ ...p, year: e.target.value }));
                      clearFieldError("birthDate");
                    }}
                    placeholder="YYYY"
                    min={1900}
                    max={new Date().getFullYear()}
                    className={`w-full bg-transparent text-sm px-3 py-2 rounded-2xl border h-[50px] focus:outline-none transition-colors focus-within:border-[#16A34A] focus-within:bg-[#A0F2BE]/60 ${
                      profileErrors.birthDate
                        ? "border-red-500"
                        : "border-border"
                    }`}
                  />
                </div>
                {profileErrors.birthDate && (
                  <p className="text-xs text-red-500 mt-1 ml-1">
                    {profileErrors.birthDate}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={profileSubmitting}
                className="w-full rounded-2xl bg-[#16A34A] py-4 font-medium text-white hover:bg-[#1DB555]/90 transition-colors disabled:opacity-50"
              >
                {profileSubmitting ? "Menyimpan..." : "Simpan & Lanjutkan"}
              </button>
            </form>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default GatePage;
