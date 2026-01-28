import { useState } from "react";
import logoUrl from "../assets/images/shopydash_logo.png";
import { useSignupStore } from "../store/signupStore";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { useAuthStore } from "../store/authStore";
import { GraduationCap, Store, Eye, EyeOff } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { SignupForm } from "../components/SignupForm";

export function Signup() {
  const createVendorProfile = useVendorProfileStore(
    (state) => state.createVendorProfile,
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
    city,
    state,
    country,
    schoolArea,
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
      username: username?.trim() ?? "",
    };

    if (!trimmed.fullName) return (toast.error("Full name is required"), false);
    if (!trimmed.email) return (toast.error("Email is required"), false);
    if (!trimmed.password) return (toast.error("Password is required"), false);
    if (!trimmed.username) return (toast.error("Username is required"), false);
    if (!trimmed.phoneNumber)
      return (toast.error("Phone number is required"), false);

    const cleanPhone = trimmed.phoneNumber.replace(/[\s-]/g, "");
    const nigerianPhoneRegex = /^(?:\+234|234|0)[789][01]\d{8}$/;
    if (!nigerianPhoneRegex.test(cleanPhone)) {
      return (
        toast.error(
          "Invalid phone number. Please use a valid Nigerian number (e.g., 08012345678 or +234...)",
        ),
        false
      );
    }

    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      username,
      fullName,
      email,
      password,
      phoneNumber,
    };

    const ok = validateForm();
    if (!ok) {
      return;
    }

    try {
      await signup(payload);

      toast.success("Account created! Please choose a plan.");

      await checkAuth();

      if (role === "vendor") {
        navigate("/pricing");
      } else {
        navigate("/");
      }
    } catch (err) {
      const msg =
        typeof err === "string" ? err : (err?.message ?? "Signup failed");
      toast.error(msg);
    }
  };

  const switchTo = (nextRole) => {
    setRole(nextRole);
    localStorage.setItem("signupRole", nextRole);
    resetField();
  };

  return (
    <div className="min-h-screen bg-n-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary-3/5 blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-2/5 blur-[100px]" />
      </div>

      <div className="w-full max-w-xl relative z-10">
        <div className="bg-white/80 md:backdrop-blur-xl shadow-2xl shadow-n-3/10 rounded-3xl border border-white/50 overflow-hidden">
          <div className="px-8 pt-10 text-center">
            <h1 className="h4 text-n-8 mb-2">Create your account</h1>
            <p className="body-2 text-n-4">
              Join the campus marketplace to buy and sell with ease.
            </p>
          </div>

          <div className="mt-2 animate-in fade-in slide-in-from-top-4 duration-500">
            <SignupForm
              onSubmit={onSubmit}
              fullName={fullName}
              setField={setField}
              isClient={true} // Default to generic view
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
              city={city}
              state={state}
              country={country}
              schoolArea={schoolArea}
            />
          </div>

          {}
        </div>
      </div>
    </div>
  );
}
