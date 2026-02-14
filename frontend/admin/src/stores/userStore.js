import { create } from "zustand";
import api from "../api/axios";

const useUserStore = create((set) => ({
  users: [],
  user: null,
  pagination: null,
  loading: false,
  error: null,

  fetchUsers: async (params = {}) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get("/admin/users", { params });
      set({
        users: res.data.data.users,
        pagination: res.data.data.pagination,
        loading: false,
      });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Failed to fetch users",
      });
    }
  },

  fetchUserDetail: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await api.get(`/admin/users/${id}`);
      set({ user: res.data.data, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Failed to fetch user",
      });
    }
  },

  toggleBanUser: async (id, ban, reason) => {
    const res = await api.patch(`/admin/users/${id}/ban`, { ban, reason });
    return res.data;
  },

  changeUserRole: async (id, role) => {
    const res = await api.patch(`/admin/users/${id}/role`, { role });
    return res.data;
  },
}));

export default useUserStore;
