import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  completeUserProfile,
  sendPhoneOtp,
  verifyPhoneOtp,
} from "@/lib/services/user.service";

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

  // Steps
  const [step, setStep] = useState(1);

  // Phone step
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // Birthdate step
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [birthDateError, setBirthDateError] = useState("");
  const [birthLoading, setBirthLoading] = useState(false);

  const isValidPhone = (v: string) => /^(\+62|62|0)[0-9]{9,13}$/.test(v);

  const handleSendOtp = async () => {
    setPhoneError("");
    if (!phone) {
      setPhoneError("Nomor telepon wajib diisi");
      return;
    }
    if (!isValidPhone(phone)) {
      setPhoneError("Format: +62xxxxxxxxx");
      return;
    }

    setPhoneLoading(true);
    try {
      await sendPhoneOtp(phone.replace(/^0/, "+62"));
      setOtpSent(true);
    } catch (err: any) {
      setPhoneError(err?.message || "Gagal mengirim OTP");
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setOtpError("");
    if (!otp || otp.length < 6) {
      setOtpError("Masukkan OTP 6 digit");
      return;
    }

    setOtpLoading(true);
    try {
      await verifyPhoneOtp(phone.replace(/^0/, "+62"), otp);
      setOtpVerified(true);
      setStep(2);
    } catch (err: any) {
      setOtpError(err?.message || "OTP tidak valid");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleBirthSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    setBirthLoading(true);
    try {
      await completeUserProfile({ birthDate: birthDateStr });
      navigate("/r", { replace: true });
    } catch (err: any) {
      setServerError(err?.message || "Gagal menyimpan profil");
    } finally {
      setBirthLoading(false);
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
            {step === 1
              ? "Verifikasi nomor telepon terlebih dahulu"
              : "Masukkan tanggal lahir"}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${step >= 1 ? "bg-[#16A34A] text-white" : "bg-foreground/10 text-muted-foreground"}`}
          >
            1
          </div>
          <div
            className={`w-16 h-0.5 ${step >= 2 ? "bg-[#16A34A]" : "bg-foreground/10"}`}
          />
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${step >= 2 ? "bg-[#16A34A] text-white" : "bg-foreground/10 text-muted-foreground"}`}
          >
            2
          </div>
        </div>

        {serverError && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-600 mb-6">
            {serverError}
          </div>
        )}

        {/* Step 1: Phone + OTP */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                Nomor Telepon
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setPhoneError("");
                  }}
                  placeholder="+62xxxxxxxxx"
                  className={`flex-1 bg-transparent text-sm px-4 py-3 rounded-2xl border h-[50px] focus:outline-none transition-colors focus-within:border-[#16A34A] focus-within:bg-[#A0F2BE]/60 ${phoneError ? "border-red-500" : "border-border"}`}
                />
                <button
                  onClick={handleSendOtp}
                  disabled={phoneLoading || otpSent}
                  className="px-4 h-[50px] rounded-2xl bg-[#16A34A] text-white text-sm font-medium hover:bg-[#1DB555]/90 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {phoneLoading
                    ? "Mengirim..."
                    : otpSent
                      ? "Terkirim"
                      : "Kirim OTP"}
                </button>
              </div>
              {phoneError && (
                <p className="text-xs text-red-500 mt-1 ml-1">{phoneError}</p>
              )}
            </div>

            {otpSent && !otpVerified && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                  Kode OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setOtpError("");
                  }}
                  placeholder="Masukkan 6 digit OTP"
                  maxLength={6}
                  className={`w-full bg-transparent text-sm px-4 py-3 rounded-2xl border h-[50px] focus:outline-none transition-colors focus-within:border-[#16A34A] focus-within:bg-[#A0F2BE]/60 ${otpError ? "border-red-500" : "border-border"}`}
                />
                {otpError && (
                  <p className="text-xs text-red-500 mt-1 ml-1">{otpError}</p>
                )}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleSendOtp}
                    disabled={phoneLoading}
                    className="text-sm text-[#16A34A] hover:underline disabled:opacity-50"
                  >
                    Kirim Ulang OTP
                  </button>
                </div>
              </div>
            )}

            {otpSent && !otpVerified && (
              <button
                onClick={handleVerifyOtp}
                disabled={otpLoading || otp.length < 6}
                className="w-full rounded-2xl bg-[#16A34A] py-4 font-medium text-white hover:bg-[#1DB555]/90 transition-colors disabled:opacity-50"
              >
                {otpLoading ? "Memverifikasi..." : "Verifikasi OTP"}
              </button>
            )}

            {otpVerified && (
              <div className="rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-600 flex items-center gap-2">
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Nomor telepon terverifikasi
              </div>
            )}

            {otpVerified && (
              <button
                onClick={() => setStep(2)}
                className="w-full rounded-2xl bg-[#16A34A] py-4 font-medium text-white hover:bg-[#1DB555]/90 transition-colors"
              >
                Lanjut
              </button>
            )}
          </div>
        )}

        {/* Step 2: Birthdate */}
        {step === 2 && (
          <form className="space-y-5" onSubmit={handleBirthSubmit}>
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
              disabled={birthLoading}
              className="w-full rounded-2xl bg-[#16A34A] py-4 font-medium text-white hover:bg-[#1DB555]/90 transition-colors disabled:opacity-50"
            >
              {birthLoading ? "Menyimpan..." : "Simpan & Lanjutkan"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
