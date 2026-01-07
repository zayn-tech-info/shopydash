import { create } from "zustand";
import { api } from "../lib/axios";
import { useAuthStore } from "./authStore";

const normalizeProfile = (incoming, previous = null) => {
  if (!incoming && !previous) return null;
  const merged = previous ? { ...previous, ...incoming } : { ...incoming };
  if (!merged) return null;

  if (
    (!merged.userId || typeof merged.userId === "string") &&
    previous?.userId &&
    typeof previous.userId === "object"
  ) {
    // Preserve populated userId from previous state if incoming has only ID string
    merged.userId = previous.userId;
  } else if (!merged.userId) {
    // If incoming has no user info at all, try to fish it from other fields
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

  area: "",
  country: "",
  preferredCategory: [],
  wishList: [],
  bio: "",
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

  getProfile: async (username, options = {}) => {
    const opts =
      typeof options === "boolean" ? { silent: options } : options || {};
    const silent = !!opts.silent;

    if (!silent) set({ loading: true });
    try {
      const res = await api.get(`/api/v1/profile/${username}`);
      const payload = res?.data?.data ?? res?.data ?? res;

      let profile =
        payload?.clientProfile ??
        payload?.profile ??
        payload?.client ??
        payload;
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
      const currentProfile = get().clientProfile;
      const username = currentProfile?.userId?.username;

      set({ updating: true, error: null });
      const res = await api.patch("/api/v1/clientProfile/", payload);
      const payloadRes = res?.data?.data ?? res?.data ?? res;
      let profile =
        payloadRes?.clientProfile ??
        payloadRes?.profile ??
        payloadRes?.client ??
        payloadRes;
      set((state) => {
        const normalized = normalizeProfile(profile, state.clientProfile);

        // Optimistically update userId fields if they were in the payload
        // This is needed because the response only contains the clientProfile doc,
        // and normalizeProfile restores the OLD populated userId.
        if (
          normalized.userId &&
          typeof normalized.userId === "object" &&
          (payload.fullName || payload.phoneNumber || payload.schoolArea)
        ) {
          normalized.userId = {
            ...normalized.userId,
            ...(payload.fullName && { fullName: payload.fullName }),
            ...(payload.phoneNumber && { phoneNumber: payload.phoneNumber }),
            ...(payload.schoolArea && { schoolArea: payload.schoolArea }),
          };
        }

        return {
          clientProfile: normalized,
          clientProfileData: { ...initialProfileData, ...normalized },
          updating: false,
          error: null,
        };
      });

      const authUser = useAuthStore.getState().authUser;
      if (authUser && profile?.userId?._id === authUser._id) {
        useAuthStore.getState().updateUser(profile.userId);
      }

      if (username) {
        get()
          .getProfile(username, { silent: true })
          .catch((refreshErr) =>
            console.error("Silent client profile refresh failed:", refreshErr)
          );
      }

      return profile;
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ??
        error?.response?.data ??
        "An unknown error occurred";
      console.error("update client profile error:", error);
      set({ error: serverMessage, updating: false });
      throw error;
    }
  },
  createClientProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/api/v1/clientProfile/", profileData);
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
