import { create } from "zustand";
import { api } from "../lib/axios";

export const useVendorProfileStore = create((set) => ({
  isCreatingProfile: false,
  error: null,
  vendorProfile: null,
  isGettingVendorProfile: false,

  createVendorProfile: async (data) => {
    try {
      const res = await api.post(
        "/api/v1/vendorProfile/createVendorProfile",
        data
      );
      console.log("API response", res);
      const payload = res?.data?.data ?? res?.data ?? res;
      set({ userData: payload, isCreatingProfile: false, error: null });
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ??
        err?.response?.data ??
        err?.message ??
        "An unknown error occurred";
      console.error("create vendor profile error:", err);
      set({ error: serverMessage, isSigningUp: false });

      throw serverMessage;
    }
  },

  getVendorProfile: async (id) => {
    try {
      const res = await api.get(`/api/v1/vendorProfile/me`);
      console.log("API response", res);
      const payload = res?.data?.data ?? res?.data ?? res;
      set({ vendorProfile: payload.vendorProfile, isCreatingProfile: false, error: null });
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ??
        err?.response?.data ??
        err?.message ??
        "An unknown error occurred";
      console.error("create vendor profile error:", err);
      set({ error: serverMessage, isCreatingProfile: false });

      throw serverMessage;
    }
  },
}));
