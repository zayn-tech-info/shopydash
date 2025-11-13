import { create } from "zustand";
import { api } from "../lib/axios";

const initialProfileData = {
  fullName: "",
  username: "",
  phoneNumber: "",
  gender: "",
  address: "",
  city: "",
  state: "",
  country: "",
  profileImage: "",
  preferredCategory: "",
  wishList: [],
};
export const useClientProfileStore = create((set) => ({
  clientProfileData: { ...initialProfileData },
  clientProfile: null,
  error: null,
  loading: false,

  setInputField: (field, value) => {
    set((state) => ({
      clientProfileData: { ...state.clientProfileData, [field]: value },
    }));
  },
  
  getClientProfile: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/api/v1/clientProfile/getClientProfile");
      const payload = res?.data?.data ?? res?.data ?? res;

      console.log("Client Profile API response:", res);
      console.log("Client Profile payload:", payload);

      let profile =
        payload?.clientProfile ??
        payload?.profile ??
        payload?.client ??
        payload;

      console.log("Resolved client profile:", profile);
      set({ clientProfile: profile, loading: false, error: null });
      return profile;
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ??
        err?.response?.data ??
        err?.message ??
        "An unknown error occurred";
      console.error("create vendor profile error:", err);
      set({ error: serverMessage, loading: false });
    }
  },
}));
