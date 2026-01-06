import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Check,
  ChevronDown,
  BadgeCheck,
  Loader,
} from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import LocationSelector from "./LocationSelector";
import { VerificationModal } from "../components/VerificationModal";
import { api } from "../lib/axios";

import { useAuthStore } from "../store/authStore";
import { toast } from "react-hot-toast";

export function SignupForm({
  onSubmit,
  fullName,
  setField,
  isClient,
  username,
  email,
  schoolId,
  phoneNumber,
  whatsAppNumber,
  schoolName,
  businessName,
  showPassword,
  password,
  toggleShowPassword,
  isSigningUp,
  error,
  city,
  state,
  country,
  schoolArea,
}) {
  const { googleAuthenticate } = useAuthStore();
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);

  const handleVerifyClick = async () => {
    if (!email) {
      toast.error("Please enter email first");
      return;
    }
    setIsSendingCode(true);
    try {
      await api.post("/api/v1/auth/send-otp", { email });
      setIsVerificationModalOpen(true);
      toast.success("Verification code sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send code");
    } finally {
      setIsSendingCode(false);
    }
  };

  const onVerified = () => {
    setIsEmailVerified(true);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await googleAuthenticate(tokenResponse.access_token);
        if (res.success) {
          if (!res.profileComplete) {
            toast.success("Please complete your profile");
            const { reloadApp } = await import("../utils/navigation");
            reloadApp("/complete-user-registration", true);
          } else {
            toast.success("Logged in successfully!");
            const { reloadApp } = await import("../utils/navigation");
            reloadApp("/", true);
          }
        }
      } catch (err) {
        toast.error(err.message || "Google Login Failed");
      }
    },
    onError: () => toast.error("Google Login Failed"),
  });

  return (
    <div className="w-full">
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        email={email}
        onVerified={onVerified}
      />
      <form onSubmit={onSubmit} noValidate className="px-8 pt-6 pb-8">
        <button
          type="button"
          onClick={() => googleLogin()}
          className="w-full h-12 bg-white border border-n-3/10 hover:bg-n-2/10 text-n-8 rounded-xl font-code text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-3 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign up with Google
        </button>

        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-n-3/10"></div>
          </div>
          <div className="relative bg-white px-4 text-xs text-n-4 uppercase tracking-wider font-bold">
            Or continue with
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {isClient ? (
            <>
              {}
              <div className="md:col-span-2">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setField("username", e.target.value)}
                  placeholder="e.g. johndoe123"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                  required
                />
              </div>

              <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setField("email", e.target.value);
                    setIsEmailVerified(false);
                  }}
                  placeholder="e.g. john@uni.edu"
                  className={`w-full h-12 px-4 rounded-xl bg-n-2/10 border ${
                    isEmailVerified ? "border-green-500" : "border-transparent"
                  } focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50`}
                  autoComplete="email"
                  required
                />
                <div className="absolute top-1/2 right-2 -translate-y-1/2">
                  {isEmailVerified ? (
                    <span className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-lg text-xs font-bold uppercase">
                      <BadgeCheck className="w-4 h-4" /> Verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleVerifyClick}
                      disabled={isSendingCode || !email}
                      className="bg-n-8 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase hover:bg-n-7 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSendingCode && (
                        <Loader className="w-3 h-3 animate-spin" />
                      )}
                      Verify
                    </button>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setField("phoneNumber", e.target.value)}
                  placeholder="e.g. +234 801..."
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setField("city", e.target.value)}
                  placeholder="e.g. Lagos"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setField("state", e.target.value)}
                  placeholder="e.g. Lagos"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setField("country", e.target.value)}
                  placeholder="e.g. Nigeria"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <LocationSelector
                  schoolName={schoolName}
                  setSchoolName={(val) => setField("schoolName", val)}
                  selectedArea={schoolArea}
                  setSelectedArea={(val) => setField("schoolArea", val)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  value={schoolId}
                  onChange={(e) => setField("schoolId", e.target.value)}
                  placeholder="e.g. 20221234"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={whatsAppNumber}
                  onChange={(e) => setField("whatsAppNumber", e.target.value)}
                  placeholder="e.g. +234 801..."
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setField("password", e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full h-12 pl-4 pr-12 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-n-4 hover:text-n-6 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="md:col-span-2">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Full name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setField("businessName", e.target.value)}
                  placeholder="e.g. Shopydash Shop"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setField("username", e.target.value)}
                  placeholder="e.g. johndoe123"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setField("email", e.target.value);
                      setIsEmailVerified(false);
                    }}
                    placeholder="e.g. vendor@shop.com"
                    className={`w-full h-12 px-4 rounded-xl bg-n-2/10 border ${
                      isEmailVerified
                        ? "border-green-500"
                        : "border-transparent"
                    } focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50`}
                    autoComplete="email"
                    required
                  />
                  <div className="absolute top-1/2 right-2 -translate-y-1/2">
                    {isEmailVerified ? (
                      <span className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-lg text-xs font-bold uppercase">
                        <BadgeCheck className="w-4 h-4" /> Verified
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleVerifyClick}
                        disabled={isSendingCode || !email}
                        className="bg-n-8 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase hover:bg-n-7 transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {isSendingCode && (
                          <Loader className="w-3 h-3 animate-spin" />
                        )}
                        Verify
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setField("password", e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full h-12 pl-4 pr-12 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-n-4 hover:text-n-6 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setField("phoneNumber", e.target.value)}
                  placeholder="e.g. +234 801..."
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setField("city", e.target.value)}
                  placeholder="e.g. Lagos"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setField("state", e.target.value)}
                  placeholder="e.g. Lagos"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                  required
                />
              </div>

              <div className="md:col-span-1">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setField("country", e.target.value)}
                  placeholder="e.g. Nigeria"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <LocationSelector
                  schoolName={schoolName}
                  setSchoolName={(val) => setField("schoolName", val)}
                  selectedArea={schoolArea}
                  setSelectedArea={(val) => setField("schoolArea", val)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  value={schoolId}
                  onChange={(e) => setField("schoolId", e.target.value)}
                  placeholder="e.g. 20221334"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={whatsAppNumber}
                  onChange={(e) => setField("whatsAppNumber", e.target.value)}
                  placeholder="e.g. +234 801..."
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                />
              </div>
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={isSigningUp || !isEmailVerified}
          className={[
            "mt-8 w-full h-12 bg-primary-3 hover:bg-primary-4 text-white rounded-xl font-code text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-primary-3/20 hover:shadow-primary-3/40 hover:-translate-y-0.5",
            isSigningUp || !isEmailVerified
              ? "opacity-70 cursor-not-allowed"
              : "cursor-pointer",
          ].join(" ")}
        >
          {isSigningUp
            ? "Creating your account..."
            : "Create your Shopydash account"}
        </button>

        {error && (
          <p className="mt-4 text-center text-sm text-primary-3 font-medium">
            {error}
          </p>
        )}

        <p className="mt-8 text-center text-sm text-n-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-n-8 hover:text-primary-3 transition-colors"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

function CustomDropdown({ options, value, onChange, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes((value || "").toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full h-12 px-4 pr-12 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50`}
        />
        <ChevronDown
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-n-4 transition-transform duration-200 pointer-events-none ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-n-3/10 max-h-60 overflow-y-auto overflow-x-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
          {filteredOptions.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-n-6 hover:bg-primary-3/5 hover:text-primary-3 transition-colors flex items-center justify-between group"
            >
              <span className="truncate pr-4">{option}</span>
              {value === option && (
                <Check className="w-4 h-4 text-primary-3 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
      {isOpen && filteredOptions.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-n-3/10 py-4 px-4 text-center text-sm text-n-4 animate-in fade-in zoom-in-95 duration-200">
          No schools found
        </div>
      )}
    </div>
  );
}
