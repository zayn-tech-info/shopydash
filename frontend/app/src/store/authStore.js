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
    console.log("Recieved Data: ", data);
    try {
      const res = await api.post("/api/v1/auth/login", data);
      console.log("API response: ", res);
      const payload = res?.data?.data ?? res?.data ?? res;

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
      console.log("API response: ", res);

      const payload = res?.data?.data ?? res?.data ?? res;
      set({ authUser: payload, isCheckingAuth: false, error: null });
    } catch (err) {
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
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "An unknown error occurred";
      console.error("Logout error:", err, serverMessage);
      set({ error: serverMessage });
    } finally {
      set({ authUser: null, role: "client", email: "", password: "" });
    }
  },
}));
