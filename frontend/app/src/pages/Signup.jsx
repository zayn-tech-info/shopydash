import { useState } from "react";
import logoUrl from "../assets/images/vendora_logo.png";
import { useSignupStore } from "../store/signupStore";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { useAuthStore } from "../store/authStore";
import { GraduationCap, Store, Eye, EyeOff } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { SignupForm } from "../components/SignupForm";

export function Signup() {
  const createVendorProfile = useVendorProfileStore(
    (state) => state.createVendorProfile
  );
  const [hasChosenRole, setHasChosenRole] = useState(false);
  const {
    role,
    showPassword,
    fullName,
    email,
    password,
    phoneNumber,
    schoolName,
    schoolEmail,
    schoolId,
    username,
    businessName,
    whatsAppNumber,
    profilePic,
    bio,
    logo,
    setRole,
    toggleShowPassword,
    setField,
    resetField,

    signup,
    isSigningUp,
    error,
  } = useSignupStore();

  const navigate = useNavigate();
  const { checkAuth } = useAuthStore();

  const isClient = role === "client";

  const validateForm = () => {
    const trimmed = {
      fullName: fullName?.trim() ?? "",
      email: email?.trim() ?? "",
      password: password?.trim() ?? "",
      phoneNumber: phoneNumber?.trim() ?? "",
      schoolName: schoolName?.trim() ?? "",
      username: username?.trim() ?? "",
      businessName: businessName?.trim() ?? "",
      whatsAppNumber: whatsAppNumber?.trim() ?? "",
      schoolEmail: schoolEmail?.trim() ?? "",
      schoolId: schoolId?.trim() ?? "",
    };

    if (!trimmed.fullName) return toast.error("Full name is required"), false;
    if (!trimmed.email) return toast.error("Email is required"), false;
    if (!trimmed.password) return toast.error("Password is required"), false;
    if (!trimmed.username) return toast.error("Username is required"), false;
    if (!trimmed.whatsAppNumber)
      return toast.error("WhatsApp number is required"), false;

    if (isClient) {
      if (!trimmed.schoolName)
        return toast.error("School name is required"), false;
    } else {
      if (!trimmed.businessName)
        return toast.error("Business name is required"), false;
    }

    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      role,
      username,
      fullName,
      email,
      password,
      phoneNumber,
      whatsAppNumber,
      schoolName,
      businessName: businessName || undefined,
      schoolId: schoolId ? Number(schoolId) : undefined,
      schoolEmail: schoolEmail || undefined,
      profilePic: profilePic || undefined,
      bio: bio || undefined,
      logo: logo || undefined,
    };

    const ok = validateForm();
    if (!ok) {
      return;
    }

    try {
      const result = await signup(payload);
      await checkAuth();
      toast.success("Account created successfully!");
      resetField();

      const { reloadApp } = await import("../utils/navigation");
      reloadApp("/", true);
    } catch (err) {
      const msg =
        typeof err === "string" ? err : err?.message ?? "Signup failed";
      toast.error(msg);
    }
  };

  const switchTo = (nextRole) => {
    setRole(nextRole);
    resetField();
  };

  return (
    <div className="min-h-screen bg-n-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary-3/5 blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-2/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        <div className="bg-white/80 md:backdrop-blur-xl shadow-2xl shadow-n-3/10 rounded-3xl border border-white/50 overflow-hidden">
          <div className="px-8 pt-10 text-center">
            <img
              src={logoUrl}
              alt="Vendora"
              className="mx-auto h-12 w-auto object-contain mb-4"
            />
            <h1 className="h4 text-n-8 mb-2">Create your account</h1>
            <p className="body-2 text-n-4">
              Join the campus marketplace to buy and sell with ease.
            </p>
          </div>

          <div className="mt-8 px-6">
            <div className="grid grid-cols-2 p-1 bg-n-2/10 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  switchTo("client");
                  setHasChosenRole(true);
                }}
                className={[
                  "flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300",
                  isClient && hasChosenRole
                    ? "bg-primary-3 text-white shadow-lg shadow-primary-3/25 scale-[1.02]"
                    : "bg-transparent text-n-4 hover:text-primary-3 hover:bg-white/50",
                ].join(" ")}
              >
                <GraduationCap
                  className={`w-4 h-4 ${
                    isClient && hasChosenRole ? "text-white" : "text-inherit"
                  }`}
                />
                Student
              </button>
              <button
                type="button"
                onClick={() => {
                  switchTo("vendor");
                  setHasChosenRole(true);
                }}
                className={[
                  "flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300",
                  !isClient && hasChosenRole
                    ? "bg-primary-3 text-white shadow-lg shadow-primary-3/25 scale-[1.02]"
                    : "bg-transparent text-n-4 hover:text-primary-3 hover:bg-white/50",
                ].join(" ")}
              >
                <Store
                  className={`w-4 h-4 ${
                    !isClient && hasChosenRole ? "text-white" : "text-inherit"
                  }`}
                />
                Vendor
              </button>
            </div>
          </div>

          {hasChosenRole && (
            <div className="mt-2 animate-in fade-in slide-in-from-top-4 duration-500">
              <SignupForm
                onSubmit={onSubmit}
                fullName={fullName}
                setField={setField}
                isClient={isClient}
                username={username}
                email={email}
                schoolId={schoolId}
                phoneNumber={phoneNumber}
                whatsAppNumber={whatsAppNumber}
                schoolName={schoolName}
                businessName={businessName}
                showPassword={showPassword}
                password={password}
                toggleShowPassword={toggleShowPassword}
                isSigningUp={isSigningUp}
                error={error}
              />
            </div>
          )}

          {/* Footer */}
          <div className="px-8 pb-8 mt-5">
            <p className="text-center text-xs text-n-4">
              By signing up, you agree to our{" "}
              <a
                className="font-bold text-n-6 hover:text-primary-3 transition-colors"
                href="#"
              >
                Terms of Use
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
