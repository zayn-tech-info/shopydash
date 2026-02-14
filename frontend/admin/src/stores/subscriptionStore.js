import { create } from "zustand";
import api from "../api/axios";

const useSubscriptionStore = create((set) => ({
  subscriptions: [],
  stats: null,
  pagination: null,
  loading: false,
  error: null,

  fetchSubscriptions: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/admin/subscriptions", { params });
      set({
        subscriptions: res.data.data.subscriptions,
        pagination: res.data.data.pagination,
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Failed to fetch subscriptions",
      });
    }
  },

  fetchSubscriptionStats: async () => {
    try {
      const res = await api.get("/admin/subscriptions/stats");
      set({ stats: res.data.data });
    } catch (err) {
      console.error("Failed to fetch subscription stats:", err);
    }
  },

  activateSubscription: async (id, plan, durationDays) => {
    const res = await api.patch(`/admin/subscriptions/${id}/activate`, {
      plan,
      durationDays,
    });
    return res.data;
  },

  cancelSubscription: async (id) => {
    const res = await api.patch(`/admin/subscriptions/${id}/cancel`);
    return res.data;
  },
}));

export default useSubscriptionStore;
