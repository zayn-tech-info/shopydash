import { create } from "zustand";
import { api } from "../lib/axios";

export const useAuthStore = create((set) => ({
  role: "client",
  email: "",
  password: "",
  showPassword: false,
  isLogginIn: false,

  setRole: (role) => set({ role }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  toggleShowPassword: () => set((s) => ({ showPassword: !s.showPassword })),
  resetloginField: () => set({ email: "", password: "" }),

  login: async (data) => {
    set({ isLogginIn: true, error: null });
    console.log("Recieved Data: ", data);
    try {
      const res = await api.post("/api/v1/auth/login", data);

      console.log("API response", res);
      const payload = res?.data?.data ?? res?.data ?? res;
      set({ userData: payload, isLogginIn: false, error: null });

      set({ userData: res?.data });
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ??
        err?.response?.data ??
        err?.message ??
        "An unknown error occurred";
      console.error("Signup error:", err);
      set({ error: serverMessage, isLogginIn: false });

      throw serverMessage;
    }
  },
}));
