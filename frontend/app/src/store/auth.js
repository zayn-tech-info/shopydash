import { create } from "zustand";

 
export const useAuthStore = create((set) => ({
  role: "student",  
  emailOrId: "",
  password: "",
  showPassword: false,
  setRole: (role) => set({ role }),
  setEmailOrId: (emailOrId) => set({ emailOrId }),
  setPassword: (password) => set({ password }),
  toggleShowPassword: () => set((s) => ({ showPassword: !s.showPassword })),
  reset: () => set({ emailOrId: "", password: "" }),
}));
