import api from "@/lib/axios";

export const getDashboardStats = async () => {
  const res = await api.get("/dashboard");
  return res.data;
};

export const getAssetStatusDistribution = async () => {
  const res = await api.get("/dashboard/asset-status");
  return res.data;
};

export const getAssetCategoryDistribution = async () => {
  const res = await api.get("/dashboard/asset-category");
  return res.data;
};