import api from "@/lib/axios";

export const getAssets = async (params) => {
  const { data } = await api.get("/assets", { params });
  return data;
};

export const createAsset = async (asset) => {
  const { data } = await api.post("/assets", asset);
  return data;
};

export const updateAsset = async (id, asset) => {
  const { data } = await api.put(`/assets/${id}`, asset);
  return data;
};

export const deleteAsset = async (id) => {
  const { data } = await api.delete(`/assets/${id}`);
  return data;
};

export const getAssetById = async (id) => {
  const { data } = await api.get(`/assets/${id}`);
  return data;
};