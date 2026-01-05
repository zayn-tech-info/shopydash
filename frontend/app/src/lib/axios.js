import axios from "axios";

const mode = import.meta.env.MODE;
export const api = axios.create({
  baseURL: "https://vendora-7457.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
