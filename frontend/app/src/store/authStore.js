import { create } from "zustand";
import { api } from "../lib/axios";

export const useAuthStore = create((set) => ({
  role: "client",
  email: "",
  schoolId: "",
  username: "",
  password: "",
  showPassword: false,
  isLogginIn: false,
  isCheckingAuth: false,
  authUser: null,

  setRole: (role) => set({ role }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  toggleShowPassword: () => set((s) => ({ showPassword: !s.showPassword })),
  resetloginField: () => set({ email: "", password: "" }),
  updateUser: (updates) =>
    set((state) => ({ authUser: { ...state.authUser, ...updates } })),

  login: async (data) => {
    set({ isLogginIn: true, error: null });
    try {
      const res = await api.post("/api/v1/auth/login", data);
      const payload = res?.data?.data ?? res?.data ?? res;

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      set({ authUser: payload, isLogginIn: false, error: null });
      return payload;
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "An unknown error occurred";
      console.error("Login error:", err);
      set({ error: serverMessage, isLogginIn: false });
      throw serverMessage;
    }
  },

  googleAuthenticate: async (token) => {
    set({ isLogginIn: true, error: null });
    try {
      const res = await api.post("/api/v1/auth/google", { token });
      const payload = res?.data?.data ?? res?.data ?? res;

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      const userData = payload.user || payload;
      const hasProfile =
        payload.hasProfile !== undefined ? payload.hasProfile : false;

      set({
        authUser: { ...userData, hasProfile },
        isLogginIn: false,
        error: null,
      });
      return {
        success: true,
        profileComplete: userData.profileComplete,
        hasProfile,
      };
    } catch (err) {
      set({ isLogginIn: false });
      const serverMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "An unknown error occurred";
      set({ error: serverMessage });
      throw serverMessage;
    }
  },

  completeRegistration: async (data) => {
    try {
      const res = await api.post("/api/v1/auth/complete-registration", data);
      const payload = res?.data?.data ?? res?.data ?? res;

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      const userData = payload.user || payload;
      const hasProfile =
        payload.hasProfile !== undefined ? payload.hasProfile : false;

      set({ authUser: { ...userData, hasProfile } });
      return payload;
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "Failed to complete registration";
      throw new Error(serverMessage);
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const res = await api.get("/api/v1/auth/check");
      const payload = res?.data?.data ?? res?.data ?? res;
      if (payload.token) {
        localStorage.setItem("token", payload.token);
      }
      set({ authUser: payload, isCheckingAuth: false, error: null });
    } catch (err) {
      if (err.response && err.response.status === 401) {
        set({ authUser: null, isCheckingAuth: false });
        // Don't remove token here yet, maybe session expired but let user try to login again or refresh?
        // actually if 401, token is invalid.
        localStorage.removeItem("token");
        return null;
      }
      const serverMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "An unknown error occurred";
      console.error("Check auth error:", err);
      set({ error: serverMessage, isCheckingAuth: false });
      throw serverMessage;
    }
  },
  logout: async () => {
    try {
      await api.post("/api/v1/auth/logout");
      localStorage.removeItem("token");
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "An unknown error occurred";
      console.error("Logout error:", err, serverMessage);
      set({ error: serverMessage });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true, error: null });
    try {
      const res = await api.patch("/api/v1/auth/update", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const payload = res?.data?.updatedUser ?? res?.data?.data ?? res?.data;

      set((state) => ({
        authUser: { ...state.authUser, ...payload },
        isUpdatingProfile: false,
        error: null,
      }));
      return payload;
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "Failed to update profile";
      set({ error: serverMessage, isUpdatingProfile: false });
      throw serverMessage;
    }
  },

  changePassword: async (data) => {
    set({ isUpdatingProfile: true, error: null });
    try {
      const res = await api.post("/api/v1/auth/change-password", data);
      set({ isUpdatingProfile: false, error: null });
      return res.data;
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "Failed to change password";
      set({ error: serverMessage, isUpdatingProfile: false });
      throw serverMessage;
    }
  },
}));
