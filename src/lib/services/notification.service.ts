import { API } from "@/lib/api";

// Notifications
export const getNotifications = async (params?: { isRead?: boolean; type?: string; page?: number; size?: number }) => {
  const res = await API.get("/api/notifications", { params });
  return res.data;
};

export const markNotificationRead = async (notificationId: string) => {
  const res = await API.put(`/api/notifications/${notificationId}`);
  return res.data;
};

export const markAllNotificationsRead = async () => {
  const res = await API.put("/api/notifications");
  return res.data;
};

export const deleteNotification = async (notificationId: string) => {
  const res = await API.delete(`/api/notifications/${notificationId}`);
  return res.data;
};

// Reviews
export const createReview = async (applicationId: string, data: { comment: string; rating: number }) => {
  const res = await API.post(`/api/jobApplications/${applicationId}/reviews`, data);
  return res.data;
};

export const replyReview = async (reviewId: string, replyComment: string) => {
  const res = await API.post(`/api/reviews/${reviewId}/reply`, { replyComment });
  return res.data;
};

export const updateReview = async (reviewId: string, data: { comment?: string; rating?: number }) => {
  const res = await API.patch(`/api/reviews/${reviewId}`, data);
  return res.data;
};

export const updateReviewReply = async (reviewId: string, replyComment: string) => {
  const res = await API.patch(`/api/reviews/${reviewId}/reply`, { replyComment });
  return res.data;
};

export const deleteReview = async (reviewId: string) => {
  const res = await API.delete(`/api/reviews/${reviewId}`);
  return res.data;
};

export const deleteReviewReply = async (reviewId: string) => {
  const res = await API.delete(`/api/reviews/${reviewId}/reply`);
  return res.data;
};