import { API } from "@/lib/api";

// Job Categories
export const getJobCategories = async () => {
  const res = await API.get("/api/jobCategories");
  return res.data;
};

export const getJobCategory = async (id: string) => {
  const res = await API.get(`/api/jobCategories/${id}`);
  return res.data;
};

// Skills
export const getSkills = async () => {
  const res = await API.get("/api/jobCategories/skills");
  return res.data;
};

export const getSkill = async (skillId: string) => {
  const res = await API.get(`/api/jobCategories/skills/${skillId}`);
  return res.data;
};

// User Skills
export const getUserSkills = async () => {
  const res = await API.get("/api/skills/userSkills");
  return res.data;
};

export const createUserSkill = async (data: {
  level: string;
  skillId?: string;
  customSkillName?: string;
  customSkillDesc?: string;
  portofolioUrl?: string;
  certificationUrl?: string;
}) => {
  const res = await API.post("/api/skills/userSkills", data);
  return res.data;
};

export const updateUserSkill = async (userSkillId: string, data: Record<string, any>) => {
  const res = await API.patch(`/api/skills/userSkills/${userSkillId}`, data);
  return res.data;
};

export const deleteUserSkill = async (userSkillId: string) => {
  const res = await API.delete(`/api/skills/userSkills/${userSkillId}`);
  return res.data;
};