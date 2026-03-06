import { create } from "zustand";
import api from "../api/axios";

const useAuthStore = create((set) => ({
  admin: null,
  loading: false,
  initializing: true,
  error: null,

  clearError: () => set({ error: null }),

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const res = await api.post("/auth/login", { email, password });
      const token = res.data.token;
      const user = res.data.data?.user || res.data.user;

      if (user?.role !== "admin") {
        set({ loading: false, error: "Access denied. Admin only." });
        await api.post("/auth/logout").catch(() => {});
        return false;
      }

      if (token) {
        localStorage.setItem("admin_token", token);
      }

      set({ admin: user, loading: false, error: null });
      return true;
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      set({ loading: false, error: message });
      return false;
    }
  },

  checkAuth: async () => {
    set({ error: null });
    try {
      const res = await api.get("/auth/check");
      // checkAuth returns flat user object: { ...userData, token }
      const user = res.data.data?.user || res.data.user || res.data;

      if (!user?._id || user?.role !== "admin") {
        set({ admin: null, initializing: false, error: null });
        return false;
      }

      // Refresh the stored token if a new one was returned
      if (res.data.token) {
        localStorage.setItem("admin_token", res.data.token);
      }

      set({ admin: user, initializing: false, error: null });
      return true;
    } catch {
      set({ admin: null, initializing: false, error: null });
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Logout even on error
    }
    localStorage.removeItem("admin_token");
    set({ admin: null, loading: false, error: null });
  },
}));

export default useAuthStore;
