import { create } from "zustand";
import { api } from "../lib/axios";

 
const initialProfileData = {
  businessName: "",
  storeUsername: "",
  storeDescription: "",
  businessCategory: "",
  phoneNumber: "",
  whatsAppNummber: "",
  email: "",
  coverImage: "",
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

export const useVendorProfileStore = create((set) => ({
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
 
      set({ vendorProfile: payload, isCreatingProfile: false, error: null });
      return payload;
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ??
        err?.response?.data ??
        err?.message ??
        "An unknown error occurred";
      console.error("create vendor profile error:", err);
      set({ error: serverMessage, isCreatingProfile: false });
    }
  },

  // Fetch vendor profile. If `username` is provided, fetch public store profile
  // at /store/:storeUsername. Otherwise fetch the authenticated vendor's profile
  // at /me.
  getVendorProfile: async (username) => {
    try {
      set({ isGettingVendorProfile: true, error: null });

      const url = username
        ? `/api/v1/vendorProfile/store/${encodeURIComponent(username)}`
        : `/api/v1/vendorProfile/me`;

      const res = await api.get(url);
      console.log("API response", res);

      const payload = res?.data?.data ?? res?.data ?? res;

      // populate store with the fetched profile
      set({
        vendorProfile: payload,
        isGettingVendorProfile: false,
        error: null,
      });

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
