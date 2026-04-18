import { API } from "@/lib/api";

// ─── Auth ───────────────────────────────────────────────────────────────────

export const signIn = async (usernameOrEmail: string, password: string) => {
  const res = await API.post("/public/api/auth/login", { usernameOrEmail, password });
  // res.data = { success, message, data: "token_string" }
  const accessToken = res.data?.data as string;
  return { accessToken };
};

export const signUp = async (data: {
  profilePict?: File;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  birthDate: string;
  phone: string;
}) => {
  const formData = new FormData();
  if (data.profilePict) formData.append("profilePict", data.profilePict);
  formData.append("username", data.username);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("firstName", data.firstName);
  if (data.lastName) formData.append("lastName", data.lastName);
  formData.append("birthDate", data.birthDate);
  formData.append("phone", data.phone);

  // Contract: POST /auth/register — 201, returns user data (no accessToken)
  const res = await API.post("/public/api/auth/register", formData);
  return res.data; 
};

export const refreshToken = async () => {
  const res = await API.post("/auth/refresh");
  return { newAccessToken: res.data?.data as string };
};

export const logout = async () => {
  const res = await API.post("/auth/logout");
  return res.data;
};

// ─── Email Verification ─────────────────────────────────────────────────────

export const sendEmailVerification = async (email: string) => {
  const res = await API.post("/public/api/emailVerifications/send-verification", { email });
   console.log(res);
  return res.data;
};

export const verifyEmail = async (token: string) => {
  const res = await API.get("/public/api/emailVerifications/verify", { params: { token } });
   console.log(res);
  return res.data;
};

// ─── Phone OTP ───────────────────────────────────────────────────────────────

export const sendPhoneOtp = async (phone: string) => {
  const res = await API.post("/otp/phone/send", { phone });
  return res.data;
};

export const verifyPhoneOtp = async (phone: string, otp: number) => {
  const res = await API.get("/otp/phone/verify", { params: { phone, otp } });
  return res.data;
};

// ─── Forgot / Reset Password ───────────────────────────────────────────────
// Contract has no reset-password endpoint yet — stub + UI added for when backend ships it

export const requestPasswordReset = async (_email: string) => {
  // Will call backend POST /auth/forgot-password when available
  // Currently returns a mock to allow UI development
  return { success: true, message: "Link reset sandi telah dikirim ke email", data: null };
};

export const resetPassword = async (_token: string, _newPassword: string) => {
  // Will call backend POST /auth/reset-password when available
  return { success: true, message: "Sandi berhasil direset", data: null };
};