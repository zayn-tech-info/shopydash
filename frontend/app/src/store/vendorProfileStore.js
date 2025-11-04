import { create } from "zustand";
import { api } from "../lib/axios";
import { initialProfileData } from "../constants";

export const useVendorProfileStore = create((set, get) => ({
  isCreatingProfile: false,
  error: null,
  vendorProfile: null,
  updatedVendorProfile: null,
  isGettingVendorProfile: false,
  isUpdatingVendorProfile: false,
  profileData: { ...initialProfileData },
  vendorProfileData: null,
  setProfile: (vendorProfile) => {
    if (!vendorProfile)
      return set({
        vendorProfile: null,
        profileData: { ...initialProfileData },
      });

    const profileData = {
      businessName: vendorProfile.businessName || "",
      storeUsername: vendorProfile.storeUsername || "",
      storeDescription: vendorProfile.storeDescription || "",
      businessCategory: vendorProfile.businessCategory || "",
      phoneNumber: vendorProfile.phoneNumber || "",
      whatsAppNumber: vendorProfile.whatsAppNumber || "",
      email: vendorProfile.email || "",
      profileImage: vendorProfile.profileImage || "",
      coverImage: vendorProfile.coverImage || "",
      address: vendorProfile.address || "",
      city: vendorProfile.city || "",
      state: vendorProfile.state || "",
      country: vendorProfile.country || "",
      accountNumber: vendorProfile.accountNumber || "",
      paymentMethods: Array.isArray(vendorProfile.paymentMethods)
        ? vendorProfile.paymentMethods
        : [],
      instagram: vendorProfile.socialLinks?.instagram || "",
      facebook: vendorProfile.socialLinks?.facebook || "",
      twitter: vendorProfile.socialLinks?.twitter || "",
    };

    set({ vendorProfileData: profileData });
  },

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
      set({
        updatedVendorProfile: payload.vendorProfile,
        vendorProfile: payload.vendorProfile || undefined,
        profileData: {
          businessName: payload.vendorProfile?.businessName || "",
          storeUsername: payload.vendorProfile?.storeUsername || "",
          storeDescription: payload.vendorProfile?.storeDescription || "",
          businessCategory: payload.vendorProfile?.businessCategory || "",
          phoneNumber: payload.vendorProfile?.phoneNumber || "",
          whatsAppNumber: payload.vendorProfile?.whatsAppNumber || "",
          email: payload.vendorProfile?.email || "",
          profileImage: payload.vendorProfile?.profileImage || "",
          coverImage: payload.vendorProfile?.coverImage || "",
          gallery: Array.isArray(payload.vendorProfile?.gallery)
            ? payload.vendorProfile.gallery.join(",")
            : payload.vendorProfile?.gallery || "",
          address: payload.vendorProfile?.address || "",
          city: payload.vendorProfile?.city || "",
          state: payload.vendorProfile?.state || "",
          country: payload.vendorProfile?.country || "",
          accountNumber: payload.vendorProfile?.accountNumber || "",
          paymentMethods: Array.isArray(payload.vendorProfile?.paymentMethods)
            ? payload.vendorProfile.paymentMethods
            : [],
          instagram: payload.vendorProfile?.socialLinks?.instagram || "",
          facebook: payload.vendorProfile?.socialLinks?.facebook || "",
          twitter: payload.vendorProfile?.socialLinks?.twitter || "",
        },
        isUpdatingVendorProfile: false,
        error: null,
      });
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
