import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { completeUserProfile } from "@/lib/services/user.service";
import { AxiosError } from "axios";

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

function parseError(err: unknown): string {
  const axiosErr = err as AxiosError<{ errors?: string }>;
  const data = axiosErr.response?.data;
  if (typeof data?.errors === "string" && data.errors) return data.errors;
  return "Terjadi kesalahan";
}

export default function CompleteProfilePage() {
  const navigate = useNavigate();

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBirthDateError("");
    setServerError("");

    if (!day || !month || !year) {
      setBirthDateError("Tanggal lahir wajib diisi lengkap");
      return;
    }

    const birthDateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dob = new Date(birthDateStr);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (dob > today || age < 15) {
      setBirthDateError("Umur minimal 15 tahun");
      return;
    }

    setLoading(true);
    try {
      await completeUserProfile({ birthDate: birthDateStr });
      navigate("/r", { replace: true });
    } catch (err: any) {
      setServerError(parseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            className="w-20 mx-auto mb-4"
            src="/assets/logo.png"
            alt="logo"
          />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Lengkapi Profil Kamu
          </h1>
          <p className="text-muted-foreground">
            Masukkan tanggal lahir
          </p>
        </div>

        {serverError && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-600 mb-6">
            {serverError}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
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
                  setBirthDateError("");
                }}
                placeholder="DD"
                min={1}
                max={31}
                className={`w-full bg-transparent text-sm px-4 py-2 rounded-2xl border h-[50px] focus:outline-none transition-colors focus-within:border-[#16A34A] focus-within:bg-[#A0F2BE]/60 ${birthDateError ? "border-red-500" : "border-border"}`}
              />
              <div className="relative">
                <select
                  value={month}
                  onChange={(e) => {
                    setMonth(e.target.value);
                    setBirthDateError("");
                  }}
                  className={`w-full bg-transparent text-sm px-4 py-2 rounded-2xl border h-[50px] focus:outline-none transition-colors focus-within:border-[#16A34A] focus-within:bg-[#A0F2BE]/60 appearance-none pr-8 cursor-pointer ${birthDateError ? "border-red-500" : "border-border"}`}
                >
                  <option value="" disabled className="text-muted-foreground">
                    Bulan
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
                  setBirthDateError("");
                }}
                placeholder="YYYY"
                min={1900}
                max={new Date().getFullYear()}
                className={`w-full bg-transparent text-sm px-4 py-2 rounded-2xl border h-[50px] focus:outline-none transition-colors focus-within:border-[#16A34A] focus-within:bg-[#A0F2BE]/60 ${birthDateError ? "border-red-500" : "border-border"}`}
              />
            </div>
            {birthDateError && (
              <p className="text-xs text-red-500 mt-1 ml-1">
                {birthDateError}
              </p>
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
