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
    }),

  signup: async (data) => {
    set({ isSigningUp: true, error: null });
    console.log("Recieved Data: ", data);
    try {
      const res = await api.post("/api/v1/auth/signup", data);

      console.log("API response", res);
      const payload = res?.data?.data ?? res?.data ?? res;
      set({ userData: payload, isSigningUp: false, error: null });

      set({ userData: res?.data });
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message ??
        err?.response?.data ??
        err?.message ??
        "An unknown error occurred";
      console.error("Signup error:", err);
      set({ error: serverMessage, isSigningUp: false });

      throw serverMessage;
    }
  },
}));
