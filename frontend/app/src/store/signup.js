import { create } from "zustand";

export const useSignupStore = create((set) => ({
  role: "student",  
  showPassword: false,
  student: {
    fullName: "",
    emailOrId: "",
    password: "",
    phone: "", 
    schoolName: "",
  },
  vendor: {
    fullName: "", 
    email: "",
    password: "",
    whatsapp: "",
    schoolName: "",
  },
  setRole: (role) => set({ role }),
  toggleShowPassword: () => set((s) => ({ showPassword: !s.showPassword })),
  setStudentField: (key, value) =>
    set((s) => ({ student: { ...s.student, [key]: value } })),
  setVendorField: (key, value) =>
    set((s) => ({ vendor: { ...s.vendor, [key]: value } })),
  resetStudent: () =>
    set({
      student: {
        fullName: "",
        emailOrId: "",
        password: "",
        phone: "",
        schoolName: "",
      },
    }),
  resetVendor: () =>
    set({
      vendor: {
        fullName: "",
        email: "",
        password: "",
        whatsapp: "",
        schoolName: "",
      },
    }),
}));
