import { create } from "zustand";
import api from "../api/axios";

const usePaymentStore = create((set) => ({
  transactions: [],
  stats: null,
  pagination: null,
  loading: false,
  error: null,

  fetchTransactions: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/admin/transactions", { params });
      set({
        transactions: res.data.data.transactions,
        pagination: res.data.data.pagination,
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Failed to fetch transactions",
      });
    }
  },

  fetchTransactionStats: async () => {
    try {
      const res = await api.get("/admin/transactions/stats");
      set({ stats: res.data.data });
    } catch (err) {
      console.error("Failed to fetch transaction stats:", err);
    }
  },
}));

export default usePaymentStore;
