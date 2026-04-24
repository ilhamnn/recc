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
  requestPasswordReset,
  resetPassword,
} from "@/lib/services/auth.service";