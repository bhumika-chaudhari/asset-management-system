import api from "@/lib/axios";

export const getAuditLogs = async () => {
  const { data } = await api.get("/audit");
  return data;
};

export const verifyBlockchain = async () => {
  const { data } = await api.get("/audit/verify");
  return data;
};