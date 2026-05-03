import { API } from "@/lib/api";
import { data } from "react-router-dom";

export const getCurrentUser = async () => {
  const res = await API.get("/api/users/current");
  return res.data;
};

export const getProfile = async () => {
  const res = await API.get("/api/users/profile");
  console.log(res.data);
  return res.data;
};

// ─── Reviews ──────────────────────────────────────────────────────────────
// Contract: GET /api/reviews          → reviews milik sendiri (16.3.1)
// Contract: GET /api/users/:userId/reviews → reviews user lain (16.3.2)

export const getMyReviews = async (params?: {
  rating?: number;
  as?: string;
  page?: number;
  size?: number;
}) => {
  const res = await API.get("/api/reviews", { params });
  return res.data;
};

export const getUserReviews = async (
  userId: string,
  params?: { rating?: number; as?: string; page?: number; size?: number },
) => {
  const res = await API.get(`/api/users/${userId}/reviews`, { params });
  return res.data;
};

export const updateUser = async (data: FormData) => {
  const res = await API.patch("/api/users", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const completeUserProfile = async (data: {
  username?: string;
  birthDate?: string;
  firstName?: string;
  lastName?: string;
}) => {
  const res = await API.patch("/api/users", data);
  return res.data;
};

export const sendPhoneOtp = async (phone: string) => {
  const res = await API.post("/api/otp/phone/send", { phone });
  return res.data;
};

export const verifyPhoneOtp = async (phone: string, otp: string) => {
  const res = await API.post("/api/otp/phone/verify", { phone, otp });
  console.log(res);
  return res.data;
};
