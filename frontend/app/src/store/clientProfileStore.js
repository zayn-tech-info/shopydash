import { create } from "zustand";
import { api } from "../lib/axios";

const normalizeProfile = (incoming, previous = null) => {
  if (!incoming && !previous) return null;
  const merged = previous ? { ...previous, ...incoming } : { ...incoming };
  if (!merged) return null;

  if (!merged.userId && previous?.userId) {
    merged.userId = previous.userId;
  }

  if (!merged.userId) {
    const userField = merged.user;
    if (typeof userField === "string") {
      merged.userId = userField;
    } else if (userField && typeof userField === "object") {
      merged.userId = userField._id ?? userField.id ?? merged.userId;
    }
  }

  return merged;
};

const initialProfileData = {
  gender: "",
  address: "",
  city: "",
  state: "",
  country: "",
  preferredCategory: "",
  wishList: [],
};
export const useClientProfileStore = create((set, get) => ({
  clientProfileData: { ...initialProfileData },
  updating: false,
  clientProfile: null,
  error: null,
  loading: false,

  setInputField: (field, value) => {
    set((state) => ({
      clientProfileData: { ...state.clientProfileData, [field]: value },
    }));
  },

  resetInputField: () => set({ clientProfileData: { ...initialProfileData } }),

  setClientProfileData: (data) =>
    set({ clientProfileData: { ...initialProfileData, ...data } }),

  getClientProfile: async (options = {}) => {
    const opts =
      typeof options === "boolean" ? { silent: options } : options || {};
    const silent = !!opts.silent;

    if (!silent) set({ loading: true });
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
      const normalized = normalizeProfile(profile, get().clientProfile);
      const nextState = {
        clientProfile: normalized,
        error: null,
      };
      if (!silent) nextState.loading = false;
      set(nextState);
      return profile;
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ??
        err?.response?.data ??
        err?.message ??
        "An unknown error occurred";
      console.error("create vendor profile error:", err);
      const errorState = { error: serverMessage };
      if (!silent) errorState.loading = false;
      set(errorState);
      throw err;
    }
  },

  updateClientProfile: async (payload) => {
    try {
      set({ updating: true, error: null });
      const res = await api.patch(
        "/api/v1/clientProfile/updateClientProfile",
        payload
      );
      const payloadRes = res?.data?.data ?? res?.data ?? res;
      let profile =
        payloadRes?.clientProfile ??
        payloadRes?.profile ??
        payloadRes?.client ??
        payloadRes;
      set((state) => {
        const normalized = normalizeProfile(profile, state.clientProfile);
        return {
          clientProfile: normalized,
          clientProfileData: { ...initialProfileData, ...normalized },
          updating: false,
          error: null,
        };
      });

      // silently refresh from server to ensure latest data is reflected everywhere
      get()
        .getClientProfile({ silent: true })
        .catch((refreshErr) =>
          console.error("Silent client profile refresh failed:", refreshErr)
        );

      return profile;
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ??
        error?.response?.data ??
        error?.message ??
        "An unknown error occurred";
      console.error("update client profile error:", error);
      set({ error: serverMessage, updating: false });
      throw error;
    }
  },
  createClientProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post(
        "/api/v1/clientProfile/createClientProfile",
        profileData
      );
      const payload = res?.data?.data ?? res?.data ?? res;
      const profile =
        payload?.clientProfile ??
        payload?.profile ??
        payload?.client ??
        payload;

      const normalized = normalizeProfile(profile, get().clientProfile);
      set({
        clientProfile: normalized,
        clientProfileData: { ...initialProfileData, ...normalized },
        loading: false,
        error: null,
      });
      return profile;
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ??
        err?.response?.data ??
        err?.message ??
        "An unknown error occurred";
      console.error("create client profile error:", err);
      set({ error: serverMessage, loading: false });
      throw err;
    }
  },
}));
