import { create } from "zustand";
import { api } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useOrderStore = create((set, get) => ({
  orders: [],
  isLoading: true,
  isMarkingDelivered: false,

  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get("/api/v1/orders");
      set({ orders: res.data.data });
      console.log(res)
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      set({ isLoading: false });
    }
  },

  markOrderDelivered: async (orderId) => {
    set({ isMarkingDelivered: true });
    try {
      await api.put(`/api/v1/orders/${orderId}/deliver`);
      toast.success("Order confirmed! Funds released.");

      await get().fetchOrders();
    } catch (error) {
      console.error("Mark Delivered Error:", error);
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      set({ isMarkingDelivered: false });
    }
  },
}));
