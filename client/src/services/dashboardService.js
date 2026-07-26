import api from "@/lib/axios";

export const getDashboardStats = async () => {
  console.log("Base URL:", api.defaults.baseURL);

  const response = await api.get("/dashboard");

  return response.data;
};
export const getAssetCategoryDistribution = async () => {
  const res = await api.get("/dashboard/asset-category");
  return res.data;
};
export async function getAssetStatusDistribution() {
    const res = await api.get("/dashboard/asset-status");
    return res.data;
}