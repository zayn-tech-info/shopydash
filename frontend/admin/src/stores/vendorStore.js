import { create } from "zustand";
import api from "../api/axios";

const useVendorStore = create((set) => ({
  vendors: [],
  vendor: null,
  pagination: null,
  loading: false,
  error: null,

  fetchVendors: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/admin/vendors", { params });
      set({
        vendors: res.data.data.vendors,
        pagination: res.data.data.pagination,
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Failed to fetch vendors",
      });
    }
  },

  fetchVendorDetail: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get(`/admin/vendors/${id}`);
      set({ vendor: res.data.data, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Failed to fetch vendor",
      });
    }
  },

  updateVendorStatus: async (id, status, reason) => {
    const res = await api.patch(`/admin/vendors/${id}/status`, {
      status,
      reason,
    });
    return res.data;
  },

  updateVendorKyc: async (id, kycStatus) => {
    const res = await api.patch(`/admin/vendors/${id}/kyc`, { kycStatus });
    return res.data;
  },

  updateVendorSubscription: async (id, plan, durationDays) => {
    const res = await api.patch(`/admin/vendors/${id}/subscription`, {
      plan,
      durationDays,
    });
    return res.data;
  },
}));

export default useVendorStore;
