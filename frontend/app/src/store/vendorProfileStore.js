import { create } from "zustand";
import { api } from "../lib/axios";

const initialProfileData = {
  storeDescription: "",
  businessCategory: "",
  coverImage: "",
  address: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
  accountNumber: "",
  paymentMethods: [],
  instagram: "",
  facebook: "",
  twitter: "",
};

export const useVendorProfileStore = create((set, get) => ({
  profileData: { ...initialProfileData },
  vendorProfile: null,
  isCreatingProfile: false,
  updatedVendorProfile: null,
  isUpdatingVendorProfile: false,
  isGettingVendorProfile: false,
  error: null,

  setProfileField: (field, value) => {
    set((state) => ({ profileData: { ...state.profileData, [field]: value } }));
  },

  resetProfileData: () => set({ profileData: { ...initialProfileData } }),

  createVendorProfile: async (data) => {
    set({ isCreatingProfile: true, error: null });
    try {
      const res = await api.post(
        "/api/v1/vendorProfile/createVendorProfile",
        data
      );
      console.log("API response", res);
      const payload = res?.data?.data ?? res?.data ?? res;

      set({
        vendorProfile: payload.vendorProfile,
        isCreatingProfile: false,
        error: null,
      });
      return payload;
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

  getProfile: async (username) => {
    try {
      set({ isGettingVendorProfile: true, error: null });

      const res = await api.get(`/api/v1/profile/${username}`);
      console.log("API response", res);
      const payload = res?.data?.data ?? res?.data ?? res;
      const profile = payload?.vendorProfile ?? payload;
      set({
        vendorProfile: profile,
        isGettingVendorProfile: false,
        error: null,
      });

      return profile;
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ??
        err?.response?.data ??
        err?.message ??
        "An unknown error occurred";
      console.error("get vendor profile error:", err);
      set({ error: serverMessage, isGettingVendorProfile: false });
      throw serverMessage;
    }
  },

  updateVendorProfile: async (data) => {
    set({ isUpdatingVendorProfile: true, error: null });
    try {
      const res = await api.patch(
        `/api/v1/vendorProfile/updateVendorProfile`,
        data
      );
      console.log("API response", res);
      const payload = res?.data?.data ?? res?.data ?? res;

      const profile = payload?.vendorProfile ?? payload;

      try {
        await get().getVendorProfile();
      } catch (e) {
        set({ vendorProfile: profile });
      }

      set({ isUpdatingVendorProfile: false, error: null });

      return profile;
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ??
        err?.response?.data ??
        err?.message ??
        "An unknown error occurred";
      console.error("update vendor profile error:", err);
      set({ error: serverMessage, isUpdatingVendorProfile: false });

      throw serverMessage;
    }
  },
}));
