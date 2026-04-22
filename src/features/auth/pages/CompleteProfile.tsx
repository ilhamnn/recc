import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { completeUserProfile } from "@/lib/services/user.service";
import { useAuthStore } from "@/features/auth/store/auth.store";

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

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const [phone, setPhone] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidPhone = (v: string) => /^(\+62|62|0)[0-9]{9,13}$/.test(v);

  const setError = (field: string, msg: string) =>
    setErrors((prev) => ({ ...prev, [field]: msg }));
  const clearError = (field: string) =>
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError("");
    const newErrors: Record<string, string> = {};
    let hasError = false;

    if (!phone) {
      newErrors.phone = "Nomor telepon wajib diisi";
      hasError = true;
    } else if (!isValidPhone(phone)) {
      newErrors.phone = "Format: +62xxxxxxxxx (contoh: +6281234567890)";
      hasError = true;
    }

    if (!day || !month || !year) {
      newErrors.birthDate = "Tanggal lahir wajib diisi lengkap";
      hasError = true;
    } else {
      const birthDateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dob = new Date(birthDateStr);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (dob > today || age < 15) {
        newErrors.birthDate = "Umur minimal 15 tahun";
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const birthDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      await completeUserProfile({ birthDate, phone }, token!);
      navigate("/r", { replace: true });
    } catch (err: any) {
      setServerError(err?.message || "Gagal menyimpan profil. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img className="w-20 mx-auto mb-4" src="/assets/logo.png" alt="logo" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Lengkapi Profil Kamu
          </h1>
          <p className="text-muted-foreground">
            Hi! Sebelum mulai, masukkan tanggal lahir dan nomor telepon kamu dulu ya.
          </p>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-600 mb-6">
            {serverError}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                clearError("phone");
              }}
              placeholder="+62xxxxxxxxx"
              className={`w-full bg-transparent text-sm px-4 py-2 rounded-2xl border h-[50px] focus:outline-none transition-colors focus-within:border-[#16A34A] focus-within:bg-[#A0F2BE]/60 ${
                errors.phone ? "border-red-500" : "border-border"
              }`}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1 ml-1">{errors.phone}</p>
            )}
          </div>

          {/* Birth date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
              Tanggal Lahir
            </label>
            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                value={day}
                onChange={(e) => {
                  setDay(e.target.value);
                  clearError("birthDate");
                }}
                placeholder="Day"
                min={1}
                max={31}
                className={`w-full bg-transparent text-sm px-4 py-2 rounded-2xl border h-[50px] focus:outline-none transition-colors focus-within:border-[#16A34A] focus-within:bg-[#A0F2BE]/60 ${
                  errors.birthDate ? "border-red-500" : "border-border"
                }`}
              />
              <div className="relative">
                <select
                  value={month}
                  onChange={(e) => {
                    setMonth(e.target.value);
                    clearError("birthDate");
                  }}
                  className={`w-full bg-transparent text-sm px-4 py-2 rounded-2xl border h-[50px] focus:outline-none transition-colors focus-within:border-[#16A34A] focus-within:bg-[#A0F2BE]/60 appearance-none pr-8 cursor-pointer ${
                    errors.birthDate ? "border-red-500" : "border-border"
                  }`}
                >
                  <option value="" disabled className="text-muted-foreground">
                    Month
                  </option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 text-muted-foreground" />
              </div>
              <input
                type="number"
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  clearError("birthDate");
                }}
                placeholder="Year"
                min={1900}
                max={new Date().getFullYear()}
                className={`w-full bg-transparent text-sm px-4 py-2 rounded-2xl border h-[50px] focus:outline-none transition-colors focus-within:border-[#16A34A] focus-within:bg-[#A0F2BE]/60 ${
                  errors.birthDate ? "border-red-500" : "border-border"
                }`}
              />
            </div>
            {errors.birthDate && (
              <p className="text-xs text-red-500 mt-1 ml-1">{errors.birthDate}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#16A34A] py-4 font-medium text-white hover:bg-[#1DB555]/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan & Lanjutkan"}
          </button>
        </form>
      </div>
    </div>
  );
}