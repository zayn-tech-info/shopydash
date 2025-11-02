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

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       Cookies.remove("token");
//       console.log("Authentication failed, please login again");
//     }
//     return Promise.reject(error);
//   }
// );
