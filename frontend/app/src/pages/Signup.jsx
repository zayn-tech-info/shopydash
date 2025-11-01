import logoUrl from "../assets/images/vendora_logo.png";
import { useMemo, useState } from "react";
import { useSignupStore } from "../store/signupStore";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { useAuthStore } from "../store/authStore";
import { GraduationCap, Store, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export function Signup() {
  const { createVendorProfile } = useVendorProfileStore();
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

  /*   const isSubmitDisabled = useMemo(() => {
    if (isClient) {
      return (
        !username ||
        !fullName ||
        !email ||
        !password ||
        !phoneNumber ||
        !schoolName
      );
    }

    return (
      !username ||
      !fullName ||
      !email ||
      !password ||
      !phoneNumber ||
      !businessName
    );
  }, [
    username,
    fullName,
    email,
    password,
    phoneNumber,
    schoolName,
    businessName,
    isClient,
  ]);
 */
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
      // ensure client auth state is refreshed from server (cookie/token)
      try {
        await checkAuth();
      } catch (e) {
        // ignore - we'll still attempt to create profile
      }

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

          <form onSubmit={onSubmit} noValidate className="px-8 pt-6 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  placeholder={isClient ? "e.g. John Doe" : "e.g. Vendora Shop"}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setField("username", e.target.value)}
                  placeholder="e.g. johndoe123"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder={
                    isClient ? "e.g. john@uni.edu" : "e.g. vendor@shop.com"
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Student ID
                </label>
                <input
                  type="text"
                  value={schoolId}
                  onChange={(e) => setField("schoolId", e.target.value)}
                  placeholder={isClient ? "e.g. 20221234" : "e.g.  20221334"}
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setField("phoneNumber", e.target.value)}
                  placeholder="e.g. +234 801 234 5678"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={whatsAppNumber}
                  onChange={(e) => setField("whatsAppNumber", e.target.value)}
                  placeholder="e.g. +234 801 234 5678"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  School Name
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setField("schoolName", e.target.value)}
                  placeholder="e.g. University of Lagos"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setField("businessName", e.target.value)}
                  placeholder="e.g. Vendora Shop"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                </div>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setField("password", e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 pr-10 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-200"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSigningUp}
              className={[
                "mt-6 w-full rounded-lg bg-[#F97316] py-2.5 text-white text-sm font-semibold shadow-sm transition-colors",
                "hover:bg-[#ea580c] focus:outline-none focus:ring-2 focus:ring-orange-300",
                isSigningUp
                  ? "opacity-70 cursor-not-allowed"
                  : "cursor-pointer",
              ].join(" ")}
            >
              {isSigningUp
                ? "Creating your account..."
                : "Create your Vendora account"}
            </button>

            {error && (
              <p className="mt-3 text-center text-sm text-red-600">{error}</p>
            )}

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-orange-600 hover:text-orange-700"
              >
                Log in
              </Link>
            </p>
          </form>

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
