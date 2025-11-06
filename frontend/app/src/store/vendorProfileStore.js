import { create } from "zustand";
import { api } from "../lib/axios";
import { initialProfileData } from "../constants";

const profileData = {
  businessName: "",
  storeUsername: "",
  storeDescription: "",
  businessCategory: "",
  phoneNumber: "",
  whatsAppNumber: "",
  email: "",
  profileImage: "",
  coverImage: "",
  gallery: "",
  address: "",
  city: "",
  state: "",
  country: "",
  schoolName: "",
  zipCode: "",
  accountNumber: "",
  paymentMethods: [],
  instagram: "",
  facebook: "",
  twitter: "",
};

export const useVendorProfileStore = create((set, get) => ({
  ...profileData,
  isCreatingProfile: false,
  error: null,
  vendorProfile: null,
  updatedVendorProfile: null,
  isGettingVendorProfile: false,
  isUpdatingVendorProfile: false,
  vendorProfileData: null,

  setProfileField: (field, value) => {
    set((state) => ({ profileData: { ...state.profileData, [field]: value } }));
  },

  resetProfileData: () => set({ profileData: { ...initialProfileData } }),

  reset: () =>
    set({
      profileData: { ...initialProfileData },
      error: null,
    }),

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

  getVendorProfile: async () => {
    try {
      set({ isGettingVendorProfile: true, error: null });

      const res = await api.get(`/api/v1/vendorProfile/me`);
      console.log("API response", res);

      const payload = res?.data?.data ?? res?.data ?? res;

      return payload;
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
   
      return payload;
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
