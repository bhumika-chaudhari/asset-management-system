import api from "@/lib/axios";

export const getMaintenance = async () => {
  const { data } = await api.get("/maintenance");
  return data;
};

export const addMaintenance = async (maintenance) => {
  const { data } = await api.post("/maintenance", maintenance);
  return data;
};

export const completeMaintenance = async (id) => {
  const { data } = await api.put(`/maintenance/${id}`);
  return data;
};