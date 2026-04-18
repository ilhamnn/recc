import { API } from "@/lib/api";

// User services
export const getCurrentUser = async () => {
  const res = await API.get("/api/users/current");
  return res.data; // { success, message, data: { id, username, email, profilePictUrl, name, isEmailVerified, isPhoneVerified } }
};

export const getProfile = async () => {
  const res = await API.get("/api/users/profile");
  return res.data; // full profile with locations, stats, reviews
};

export const getUserReviews = async (params?: { rating?: number; as?: string; page?: number; size?: number }) => {
  const res = await API.get("/api/users/reviews", { params });
  return res.data;
};

export const updateUser = async (data: FormData) => {
  const res = await API.patch("/api/users/current", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};