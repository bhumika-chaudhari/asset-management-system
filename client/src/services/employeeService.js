import api from "@/lib/axios";

export const getEmployees = async (params) => {
  const { data } = await api.get("/employees", {
    params,
  });

  return data;
};

export const getEmployeeById = async (id) => {
  const { data } = await api.get(`/employees/${id}`);
  return data;
};

export const createEmployee = async (employee) => {
  const { data } = await api.post("/employees", employee);
  return data;
};

export const updateEmployee = async (id, employee) => {
  const { data } = await api.put(`/employees/${id}`, employee);
  return data;
};

export const deleteEmployee = async (id) => {
  const { data } = await api.delete(`/employees/${id}`);
  return data;
};