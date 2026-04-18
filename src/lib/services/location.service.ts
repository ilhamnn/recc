import { API } from "@/lib/api";

// Provinces
export const getProvinces = async () => {
  const res = await API.get("/api/provinces");
  return res.data;
};

export const getProvince = async (id: string) => {
  const res = await API.get(`/api/provinces/${id}`);
  return res.data;
};

// Cities
export const getCities = async () => {
  const res = await API.get("/api/cities");
  return res.data;
};

export const getCitiesByProvince = async (provinceId: string) => {
  const res = await API.get(`/api/provinces/${provinceId}/cities`);
  return res.data;
};

// Districts
export const getDistricts = async () => {
  const res = await API.get("/api/districts");
  return res.data;
};

export const getDistrictsByCity = async (cityId: string) => {
  const res = await API.get(`/api/cities/${cityId}/districts`);
  return res.data;
};

// Subdistricts
export const getSubdistricts = async () => {
  const res = await API.get("/api/subdistricts");
  return res.data;
};

export const getSubdistrictsByDistrict = async (districtId: string) => {
  const res = await API.get(`/api/districts/${districtId}/subdistricts`);
  return res.data;
};

// Addresses
export const getAddresses = async () => {
  const res = await API.get("/api/addresses");
  return res.data;
};

export const getAddress = async (id: string) => {
  const res = await API.get(`/api/addresses/${id}`);
  return res.data;
};

export const createAddress = async (data: {
  subdistrictId: string;
  street?: string;
  postalCode?: string;
  benchmark?: string;
  markAs?: string;
  isPrimary?: boolean;
  lat?: number;
  lng?: number;
}) => {
  const res = await API.post("/api/addresses", data);
  return res.data;
};

export const updateAddress = async (addressId: string, data: Record<string, any>) => {
  const res = await API.patch(`/api/addresses/${addressId}`, data);
  return res.data;
};

export const deleteAddress = async (addressId: string) => {
  const res = await API.delete(`/api/addresses/${addressId}`);
  return res.data;
};