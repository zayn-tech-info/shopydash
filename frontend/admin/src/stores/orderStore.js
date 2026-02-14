import { create } from "zustand";
import api from "../api/axios";

const useOrderStore = create((set) => ({
  orders: [],
  order: null,
  pagination: null,
  loading: false,
  error: null,

  fetchOrders: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/admin/orders", { params });
      set({
        orders: res.data.data.orders,
        pagination: res.data.data.pagination,
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Failed to fetch orders",
      });
    }
  },

  fetchOrderDetail: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get(`/admin/orders/${id}`);
      set({ order: res.data.data.order, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Failed to fetch order",
      });
    }
  },

  updateOrderStatus: async (id, data) => {
    const res = await api.patch(`/admin/orders/${id}/status`, data);
    return res.data;
  },

  cancelOrder: async (id, reason) => {
    const res = await api.patch(`/admin/orders/${id}/cancel`, { reason });
    return res.data;
  },
}));

export default useOrderStore;
