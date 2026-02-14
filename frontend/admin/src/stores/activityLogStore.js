import { create } from "zustand";
import api from "../api/axios";

const useActivityLogStore = create((set) => ({
  logs: [],
  pagination: null,
  loading: false,
  error: null,

  fetchLogs: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/admin/activity-logs", { params });
      set({
        logs: res.data.data.logs,
        pagination: res.data.data.pagination,
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Failed to fetch activity logs",
      });
    }
  },
}));

export default useActivityLogStore;
