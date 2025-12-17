import { create } from "zustand";
import { api } from "../lib/axios";
import toast from "react-hot-toast";

export const useSubscriptionStore = create((set) => ({
  initializingPlan: null,

  initializePayment: async (planSlug) => {
    set({ initializingPlan: planSlug });
    try {
      const res = await api.post("/api/v1/payment/initialize", {
        planSlug,
      });

      if (res.data.success && res.data.authorization_url) {
        toast.success("Redirecting to payment gateway...");
        // Redirect to Paystack
        window.location.href = res.data.authorization_url;
      } else {
        toast.error("Failed to initialize payment.");
      }
    } catch (error) {
      console.error("Payment Init Error:", error);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      set({ initializingPlan: null });
    }
  },
}));
