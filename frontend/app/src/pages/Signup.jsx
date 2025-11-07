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
      await createVendorProfile();
      toast.success("Account created successfully!");
      resetField();
      navigate("/");
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
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-orange-100 overflow-hidden">
          <div className="px-8 pt-8 text-center">
            <img
              src={logoUrl}
              alt="Vendora"
              className="mx-auto md:h-20 h-16 w-auto object-contain"
            />
            <h1 className="mt-4 text-xl font-semibold text-gray-900">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Join the campus marketplace to buy and sell with ease.
            </p>
          </div>

          <div className="mt-8 px-2">
            <div className="mx-6 grid grid-cols-2 rounded-full bg-orange-50 p-1">
              <button
                type="button"
                onClick={() => switchTo("client")}
                className={[
                  "flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-colors",
                  isClient
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-orange-700",
                ].join(" ")}
                aria-pressed={isClient}
              >
                <GraduationCap className="w-4 h-4" aria-hidden="true" />
                Student Buyer
              </button>
              <button
                type="button"
                onClick={() => switchTo("vendor")}
                className={[
                  "flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition-colors",
                  !isClient
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-orange-700",
                ].join(" ")}
                aria-pressed={!isClient}
              >
                <Store className="w-4 h-4" aria-hidden="true" />
                Vendor
              </button>
            </div>
          </div>

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
          {/* Footer */}
          <div className="px-8 pb-6">
            <p className="text-center text-xs text-gray-500">
              By signing up, you agree to our{" "}
              <a className="underline hover:text-gray-700" href="#">
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
