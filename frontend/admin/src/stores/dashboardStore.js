import { create } from "zustand";
import api from "../api/axios";

const useDashboardStore = create((set) => ({
  stats: null,
  loading: false,
  error: null,

  fetchStats: async () => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/admin/stats");
      set({ stats: res.data.data, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Failed to fetch stats",
      });
    }
  },
}));

export default useDashboardStore;
