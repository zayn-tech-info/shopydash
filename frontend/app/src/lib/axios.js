import axios from "axios";

const mode = import.meta.env.MODE;
export const api = axios.create({
  baseURL:
    mode === "development"
      ? "http://localhost:8000"
      : "https://vendora-7457.onrender.com",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});
