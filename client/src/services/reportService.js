import api from "@/lib/axios";

// Dashboard Analytics
export const getDashboardReport = async () => {
  const { data } = await api.get("/reports/dashboard");
  return data;
};

// Allocation Report
export const getAllocationReport = async () => {
  const { data } = await api.get("/reports/allocations");
  return data;
};

// Employee Asset Report
export const getEmployeeAssetReport = async () => {
  const { data } = await api.get("/reports/employees");
  return data;
};

// Maintenance Report
export const getMaintenanceReport = async () => {
  const { data } = await api.get("/reports/maintenance");
  return data;
};