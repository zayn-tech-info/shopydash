import axios from "axios";

const mode = import.meta.env.MODE;
// VITE_API_URL overrides default so production build can point to localhost or staging
const defaultBaseURL =
  mode === "development" ? "http://localhost:8000" : "https://api.shopydash.com";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});