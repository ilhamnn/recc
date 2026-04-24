import { useState, useEffect } from "react";
import { AuthPage } from "@/features/auth/pages/sign-in-up";
import { useNavigate, Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { completeUserProfile } from "@/lib/services/user.service";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));

const GatePage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { token, isHydrated, setAuth, fetchUser } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [signInError, setSignInError] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({ phone: "", day: "", month: "", year: "" });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [profileServerError, setProfileServerError] = useState("");

  // Handle Google OAuth callback — backend redirect ke:
  // /login?accessToken=...&isProfileComplete=... (signin)
  // /register?accessToken=...&isProfileComplete=... (signup)
  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const isProfileComplete = searchParams.get("isProfileComplete");

    if (accessToken) {
      setAuth({}, accessToken);
      if (isProfileComplete === "false") {
        fetchUser().then(() => setShowProfileModal(true));
      } else {
        fetchUser().then(() => navigate("/r", { replace: true }));
      }
    }
  }, [searchParams, setAuth, fetchUser, navigate]);

  if (token && !showProfileModal) return <Navigate to="/r" replace />;

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

  // ─── Profile completion modal ─────────────────────────────────────────────
  const isValidPhone = (v: string) => /^(\+62|62|0)[0-9]{9,13}$/.test(v);

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

    if (!profileData.phone) {
      newErrors.phone = "Nomor telepon wajib diisi";
      hasError = true;
    } else if (!isValidPhone(profileData.phone)) {
      newErrors.phone = "Format: +62xxxxxxxxx";
      hasError = true;
    }

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
      await completeUserProfile({ birthDate, phone: profileData.phone }, token!);
      navigate("/r", { replace: true });
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
              <img className="w-16 mx-auto mb-3" src="/assets/logo.png" alt="logo" />
              <h2 className="text-2xl font-bold text-foreground">Lengkapi Profil Kamu</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Masukkan nomor telepon dan tanggal lahir sebelum mulai.
              </p>
            </div>

            {profileServerError && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-600 mb-4">
                {profileServerError}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleProfileSubmit}>
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => {
                    setProfileData((p) => ({ ...p, phone: e.target.value }));
                    clearFieldError("phone");
                  }}
                  placeholder="+62xxxxxxxxx"
                  className={`w-full bg-transparent text-sm px-4 py-2 rounded-2xl border h-[50px] focus:outline-none transition-colors focus-within:border-[#16A34A] focus-within:bg-[#A0F2BE]/60 ${
                    profileErrors.phone ? "border-red-500" : "border-border"
                  }`}
                />
                {profileErrors.phone && (
                  <p className="text-xs text-red-500 mt-1 ml-1">{profileErrors.phone}</p>
                )}
              </div>

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
                      profileErrors.birthDate ? "border-red-500" : "border-border"
                    }`}
                  />
                  <div className="relative">
                    <select
                      value={profileData.month}
                      onChange={(e) => {
                        setProfileData((p) => ({ ...p, month: e.target.value }));
                        clearFieldError("birthDate");
                      }}
                      className={`w-full bg-transparent text-sm px-3 py-2 rounded-2xl border h-[50px] focus:outline-none transition-colors focus-within:border-[#16A34A] focus-within:bg-[#A0F2BE]/60 appearance-none pr-7 cursor-pointer ${
                        profileErrors.birthDate ? "border-red-500" : "border-border"
                      }`}
                    >
                      <option value="" disabled className="text-muted-foreground">Mo</option>
                      {MONTHS_SHORT.map((m, i) => (
                        <option key={m} value={i + 1}>{m}</option>
                      ))}
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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
                      profileErrors.birthDate ? "border-red-500" : "border-border"
                    }`}
                  />
                </div>
                {profileErrors.birthDate && (
                  <p className="text-xs text-red-500 mt-1 ml-1">{profileErrors.birthDate}</p>
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
