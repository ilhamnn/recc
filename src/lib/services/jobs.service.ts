import { API } from "@/lib/api";

// Jobs
export const getJobs = async (params?: { page?: number; size?: number }) => {
  const res = await API.get("/api/jobs", { params });
  return res.data;
};

export const searchJobs = async (params?: {
  categoryId?: string[];
  title?: string;
  level?: string[];
  status?: string;
  provinceId?: string;
  cityId?: string;
  districtId?: string;
  subdistrictId?: string;
  page?: number;
  size?: number;
}) => {
  const res = await API.get("/api/jobs/search", { params });
  return res.data;
};

export const getProviderJobs = async (params?: { page?: number; size?: number }) => {
  const res = await API.get("/api/jobs/provider", { params });
  return res.data;
};

export const getJobDetail = async (jobId: string) => {
  const res = await API.get(`/api/jobs/${jobId}`);
  return res.data;
};

export const createJob = async (data: Record<string, any>) => {
  const res = await API.post("/api/jobs", data);
  return res.data;
};

export const updateJob = async (jobId: string, data: Record<string, any>) => {
  const res = await API.patch(`/api/jobs/${jobId}`, data);
  return res.data;
};

export const deleteJob = async (jobId: string) => {
  const res = await API.delete(`/api/jobs/${jobId}`);
  return res.data;
};

// Job Applications
export const createJobApplication = async (jobId: string, coverLetter?: string) => {
  const res = await API.post(`/api/jobs/${jobId}/jobApplications`, { coverLetter });
  return res.data;
};

export const getMyApplications = async (params?: { status?: string; name?: string; page?: number; size?: number }) => {
  const res = await API.get("/api/jobApplications", { params });
  return res.data;
};

export const getJobApplications = async (jobId: string, params?: { status?: string; name?: string; page?: number; size?: number }) => {
  const res = await API.get(`/api/jobs/${jobId}/jobApplications`, { params });
  return res.data;
};

export const getJobApplicationDetail = async (applicationId: string) => {
  const res = await API.get(`/api/jobApplications/${applicationId}`);
  return res.data;
};

export const updateJobApplicationStatus = async (applicationId: string, data: { status: string; jobMessage?: string; rejectedGlobalMessage?: string }) => {
  const res = await API.patch(`/api/jobApplications/${applicationId}/status`, data);
  return res.data;
};

// Bookmarks
export const addBookmark = async (jobId: string) => {
  const res = await API.post(`/api/jobs/${jobId}/bookmarks`);
  return res.data;
};

export const getBookmarks = async (params?: { page?: number; size?: number }) => {
  const res = await API.get("/api/bookmarks", { params });
  return res.data;
};

export const deleteBookmark = async (bookmarkId: string) => {
  const res = await API.delete(`/api/bookmarks/${bookmarkId}`);
  return res.data;
};