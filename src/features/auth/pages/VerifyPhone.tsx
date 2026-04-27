import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { sendPhoneOtp, verifyPhoneOtp } from "@/lib/services/user.service";
import { AxiosError } from "axios";

function parseError(err: unknown): string {
  const axiosErr = err as AxiosError<{ errors?: string }>;
  const data = axiosErr.response?.data;
  if (typeof data?.errors === "string" && data.errors) return data.errors;
  return "Terjadi kesalahan";
}

const isValidPhone = (v: string) => /^(\+62|62|0)[0-9]{9,13}$/.test(v);

export default function VerifyPhonePage() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);

  const [otp, setOtp] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpExpiryCooldown, setOtpExpiryCooldown] = useState(0);
  const resendTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpExpiryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    resendTimerRef.current = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) {
          clearInterval(resendTimerRef.current!);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (resendTimerRef.current) clearInterval(resendTimerRef.current);
    };
  }, [resendCooldown]);

  useEffect(() => {
    if (otpExpiryCooldown <= 0) return;
    otpExpiryTimerRef.current = setInterval(() => {
      setOtpExpiryCooldown((c) => {
        if (c <= 1) {
          clearInterval(otpExpiryTimerRef.current!);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (otpExpiryTimerRef.current) clearInterval(otpExpiryTimerRef.current);
    };
  }, [otpExpiryCooldown]);

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
      const normalizedPhone = phone.replace(/^0/, "+62");
      const res = await sendPhoneOtp(normalizedPhone);
      setOtpSent(true);
      const expiresIn = (res as any)?.expiresIn ?? 300;
      setOtpExpiryCooldown(expiresIn);
      const retryAfter = (res as any)?.retryAfter ?? 120;
      setResendCooldown(retryAfter);
    } catch (err: any) {
      setPhoneError(parseError(err));
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleOtpInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setOtp(newDigits.join(""));
    setOtpError("");
    if (digit && index < 5) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const newDigits = Array(6)
      .fill("")
      .map((_, i) => pasted[i] ?? "");
    setOtpDigits(newDigits);
    setOtp(pasted);
    setOtpError("");
    const lastFilledIndex = Math.min(pasted.length - 1, 5);
    otpInputRefs.current[lastFilledIndex]?.focus();
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const handleVerifyOtp = async () => {
    setOtpError("");
    if (otp.length < 6) {
      setOtpError("Masukkan OTP 6 digit");
      return;
    }

    setOtpLoading(true);
    try {
      const normalizedPhone = phone.replace(/^0/, "+62");
      await verifyPhoneOtp(normalizedPhone, otp);
      setOtpVerified(true);
      if (resendTimerRef.current) clearInterval(resendTimerRef.current);
      if (otpExpiryTimerRef.current) clearInterval(otpExpiryTimerRef.current);
      setResendCooldown(0);
      setOtpExpiryCooldown(0);
      navigate("/r", { replace: true });
    } catch (err: any) {
      setOtpError(parseError(err));
    } finally {
      setOtpLoading(false);
    }
  };

  if (otpVerified) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
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
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Nomor Terverifikasi!
            </h1>
            <p className="text-muted-foreground">
              Nomor telepon kamu berhasil diverifikasi.
            </p>
          </div>
          <button
            onClick={() => navigate("/complete-profile", { replace: true })}
            className="w-full rounded-2xl bg-[#16A34A] py-4 font-medium text-white hover:bg-[#1DB555]/90 transition-colors"
          >
            Lanjutkan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img className="w-20 mx-auto mb-4" src="/assets/logo.png" alt="logo" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Verifikasi Nomor Telepon
          </h1>
          <p className="text-muted-foreground">
            {otpSent
              ? "Masukkan kode OTP yang dikirim ke nomor kamu"
              : "Masukkan nomor telepon untuk verifikasi"}
          </p>
        </div>

        {serverError && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-600 mb-6">
            {serverError}
          </div>
        )}

        {/* Phone input — hidden after OTP sent */}
        {!otpSent && (
          <div className="space-y-4 mb-4">
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
                  disabled={phoneLoading || (otpSent && resendCooldown > 0)}
                  className="px-4 h-[50px] rounded-2xl bg-[#16A34A] text-white text-sm font-medium hover:bg-[#1DB555]/90 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {phoneLoading
                    ? "Mengirim..."
                    : otpSent && resendCooldown > 0
                      ? `Tunggu ${formatTime(resendCooldown)}`
                      : otpSent
                        ? "Kirim Ulang"
                        : "Kirim OTP"}
                </button>
              </div>
              {phoneError && (
                <p className="text-xs text-red-500 mt-1 ml-1">{phoneError}</p>
              )}
            </div>
          </div>
        )}

        {/* OTP input */}
        {otpSent && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1">
                <label className="block text-sm font-medium text-foreground">
                  Kode OTP
                </label>
                {otpExpiryCooldown > 0 && (
                  <span className="text-xs text-muted-foreground">
                    Kadaluarsa {formatTime(otpExpiryCooldown)}
                  </span>
                )}
              </div>

              <div className="flex gap-3" onPaste={handleOtpPaste}>
                {otpDigits.map((_, i) => (
                  <div key={i} className="relative flex-1 flex items-end">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={otpDigits[i]}
                      maxLength={1}
                      onChange={(e) => handleOtpInput(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      ref={(el) => {
                        otpInputRefs.current[i] = el;
                      }}
                      className={`w-full text-center text-2xl font-bold bg-transparent outline-none pb-1 transition-colors ${
                        otpError
                          ? "border-b-2 border-red-500 text-red-500"
                          : "border-b-2 border-border focus:border-[#16A34A] text-foreground"
                      }`}
                      autoComplete="one-time-code"
                    />
                  </div>
                ))}
              </div>

              {otpError && (
                <p className="text-xs text-red-500 mt-1 ml-1">{otpError}</p>
              )}

              <div className="mt-3 flex justify-end">
                {resendCooldown === 0 ? (
                  <button
                    onClick={handleSendOtp}
                    disabled={phoneLoading}
                    className="text-sm text-[#16A34A] hover:underline disabled:opacity-50"
                  >
                    Kirim Ulang OTP
                  </button>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Kirim ulang dalam {formatTime(resendCooldown)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={otpLoading || otp.length < 6}
              className="w-full rounded-2xl bg-[#16A34A] py-4 font-medium text-white hover:bg-[#1DB555]/90 transition-colors disabled:opacity-50"
            >
              {otpLoading ? "Memverifikasi..." : "Verifikasi OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
