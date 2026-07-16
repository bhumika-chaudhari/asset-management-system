import api from "@/lib/axios";

export const getDashboardStats = async () => {
  console.log("Base URL:", api.defaults.baseURL);

  const response = await api.get("/dashboard");

  return response.data;
};