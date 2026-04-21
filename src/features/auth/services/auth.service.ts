import { API } from "@/lib/api";

export { API };

export {
  signIn,
  signUp,
  refreshToken,
  logout,
  signInWithGoogle,
  signUpWithGoogle,
  sendEmailVerification,
  verifyEmail,
  sendPhoneOtp,
  verifyPhoneOtp,
  requestPasswordReset,
  resetPassword,
} from "@/lib/services/auth.service";