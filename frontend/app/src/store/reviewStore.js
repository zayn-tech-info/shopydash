import { create } from "zustand";
import { api } from "../lib/axios";

export const useReviewStore = create((set) => ({
  isLoading: false,
  error: null,

  reviews: [],

  createReview: async (reviewData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/api/v1/reviews", reviewData);
      set({ isLoading: false });
      return res.data;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Something went wrong";
      set({ error: errorMsg, isLoading: false });
      throw errorMsg;
    }
  },

  getVendorReviews: async (vendorId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/api/v1/reviews/${vendorId}`);
      console.log(res)
      set({ reviews: res.data.data, isLoading: false });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Something went wrong";
      set({ error: errorMsg, isLoading: false });
    }
  },
}));
