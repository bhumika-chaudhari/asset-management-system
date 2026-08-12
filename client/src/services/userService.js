import api from "./authService"; // Reusing the axios instance with auth interceptor from authService or creating a new one if authService doesn't export `api`

import axios from "axios";

// Setup axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
