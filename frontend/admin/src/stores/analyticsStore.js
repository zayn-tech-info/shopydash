import { create } from "zustand";
import api from "../api/axios";

const useAnalyticsStore = create((set) => ({
  signups: [],
  orders: [],
  topVendors: [],
  revenue: [],
  loading: false,
  error: null,

  fetchSignups: async (days = 30) => {
    try {
      set({ loading: true });
      const res = await api.get("/admin/analytics/signups", {
        params: { days },
      });
      set({ signups: res.data.data, loading: false });
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message });
    }
  },

  fetchOrderAnalytics: async (days = 30) => {
    try {
      const res = await api.get("/admin/analytics/orders", {
        params: { days },
      });
      set({ orders: res.data.data });
    } catch (err) {
      console.error("Failed to fetch order analytics:", err);
    }
  },

  fetchTopVendors: async (limit = 10) => {
    try {
      const res = await api.get("/admin/analytics/top-vendors", {
        params: { limit },
      });
      set({ topVendors: res.data.data });
    } catch (err) {
      console.error("Failed to fetch top vendors:", err);
    }
  },

  fetchRevenue: async (days = 30) => {
    try {
      const res = await api.get("/admin/analytics/revenue", {
        params: { days },
      });
      set({ revenue: res.data.data });
    } catch (err) {
      console.error("Failed to fetch revenue analytics:", err);
    }
  },
}));

export default useAnalyticsStore;
