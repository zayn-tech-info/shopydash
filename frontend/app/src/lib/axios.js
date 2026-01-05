import axios from "axios";

const mode = import.meta.env.MODE;
export const api = axios.create({
  /*      mode === "development"
      ? "http://localhost:8000"
      :  */
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
