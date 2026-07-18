import api from "@/lib/axios";

export const getAllocations = async () => {
  const { data } = await api.get("/allocations");
  return data;
};

export const allocateAsset = async (allocation) => {
  const { data } = await api.post("/allocations", allocation);
  return data;
};

export const returnAsset = async (id) => {
  const { data } = await api.put(`/allocations/${id}/return`);
  return data;
};