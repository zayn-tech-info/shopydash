import { create } from "zustand";
import { api } from "../lib/axios";

export const useSignupStore = create((set) => ({
  showPassword: false,
  isSigningUp: false,
  error: null,
  userData: null,

  role: "client",
  fullName: "",
  email: "",
  password: "",
  phoneNumber: "",
  schoolName: "",
  username: "",
  businessName: "",
  whatsAppNumber: "",
  schoolId: "",
  schoolEmail: "",
  profilePic: "",
  bio: "",
  logo: "",
  city: "",
  state: "",
  country: "",
  schoolArea: "",

  setRole: (role) => set({ role }),

  toggleShowPassword: () =>
    set((state) => ({ showPassword: !state.showPassword })),
  setField: (key, value) => set(() => ({ [key]: value })),
  resetField: () =>
    set({
      fullName: "",
      email: "",
      password: "",
      phoneNumber: "",
      schoolName: "",
      username: "",
      businessName: "",
      whatsAppNumber: "",
      schoolId: "",
      schoolEmail: "",
      profilePic: "",
      bio: "",
      logo: "",
      city: "",
      state: "",
      country: "",
      schoolArea: "",
    }),

  signup: async (data) => {
    set({ isSigningUp: true, error: null });
    try {
      const res = await api.post("/api/v1/auth/signup", data);

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      const payload = res?.data?.data ?? res?.data ?? res;
      set({ userData: payload, isSigningUp: false, error: null });
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err?.message ||
        "An unknown error occurred";
      console.error("Signup error:", err);
      set({ error: serverMessage, isSigningUp: false });

      throw serverMessage;
    }
  },
}));
