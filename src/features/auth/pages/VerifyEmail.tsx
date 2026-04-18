import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  sendEmailVerification,
  verifyEmail,
} from "@/lib/services/auth.service";
import { Mail, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

const RESEND_COOLDOWN = 120; // seconds

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [status, setStatus] = useState<
    "idle" | "loading" | "verifying" | "success" | "error"
  >(token ? "verifying" : "idle");
  const [message, setMessage] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    timerRef.current = setInterval(() => {
      setResendCooldown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resendCooldown]);

  // Verify token when present
  useEffect(() => {
    if (token) {
      handleVerify();
    }
  }, [token]);

  const handleSendEmail = async () => {
    if (!email || resendCooldown > 0) return;
    setResendLoading(true);
    try {
      await sendEmailVerification(email);
      setMessage("Link verifikasi telah dikirim ke email.");
      setResendCooldown(RESEND_COOLDOWN);
    } catch (err: any) {
      const errorMsg = err?.message || "";
      // Handle 429 Too Many Requests
      if (err?.response?.status === 429 || errorMsg.includes("too many")) {
        setMessage(
          "Terlalu banyak permintaan. Silakan tunggu beberapa saat sebelum mencoba lagi.",
        );
      } else {
        setMessage(errorMsg || "Gagal mengirim link verifikasi.");
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerify = async () => {
    setStatus("verifying");
    try {
      await verifyEmail(token);
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Verifikasi gagal. Token mungkin kadaluarsa.");
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const maskedEmail = email ? email.replace(/(.{2}).+(@.+)/, "$1***$2") : "";

  if (status === "success") {
    return (
      <div className="min-h-dvh flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Email Verified!
            </h1>
            <p className="text-muted-foreground">
              Email kamu berhasil diverifikasi. Sekarang kamu bisa login.
            </p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="w-full rounded-2xl bg-[#16A34A] py-4 font-medium text-white hover:bg-[#1DB555]/90 transition-colors"
          >
            Masuk ke Login
          </button>
        </div>
      </div>
    );
  }

  if (status === "verifying") {
    return (
      <div className="min-h-dvh flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-[#16A34A]/10 flex items-center justify-center animate-pulse">
              <Mail className="w-8 h-8 text-[#16A34A]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Memverifikasi email...
          </h1>
          <p className="text-muted-foreground">Mohon tunggu sebentar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img className="w-20 mx-auto mb-4" src="assets/logo.png" alt="logo" />
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[#16A34A]/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-[#16A34A]" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Verifikasi Email
          </h1>
          <p className="text-muted-foreground">
            Kami telah mengirim link verifikasi ke{" "}
            <span className="text-foreground font-medium">{maskedEmail}</span>
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="rounded-xl bg-yellow-500/10 border border-yellow-500/30 px-4 py-3 text-sm text-yellow-700 mb-6">
            {message}
          </div>
        )}

        {status === "error" && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-600 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {/* Instructions */}
        <div className="rounded-2xl border border-border bg-foreground/5 p-6 mb-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            Buka email kamu dan klik tombol{" "}
            <strong className="text-foreground">Verifikasi Email</strong> dari
            kami. Link berlaku selama{" "}
            <strong className="text-foreground">2 jam</strong>.
          </p>
          <p className="text-sm text-muted-foreground">
            Tidak menerima email? Periksa folder <strong>Spam</strong> atau klik
            tombol di bawah untuk mengirim ulang.
          </p>
        </div>

        {/* Resend button */}
        <div className="space-y-3">
          <button
            onClick={handleSendEmail}
            disabled={resendCooldown > 0 || resendLoading}
            className="w-full rounded-2xl border border-border py-4 font-medium text-foreground hover:bg-secondary transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Mengirim...
              </>
            ) : resendCooldown > 0 ? (
              <>
                <RefreshCw className="w-4 h-4" />
                Kirim Ulang ({formatTime(resendCooldown)})
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Kirim Ulang Link Verifikasi
              </>
            )}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full rounded-2xl py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Kembali ke Login
          </button>
        </div>
      </div>
    </div>
  );
}
