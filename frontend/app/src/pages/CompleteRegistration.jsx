import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
import {
  GraduationCap,
  Store,
  Eye,
  EyeOff,
  X,
  ArrowLeftRight,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import LocationSelector from "../components/LocationSelector";
import { preferredCategories } from "../constants";

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];
const nigerianPhoneRegex = /^(?:\+234|234|0)[789][01]\d{8}$/;

export default function CompleteRegistration() {
  const navigate = useNavigate();
  const { authUser, completeRegistration } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("client");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [selectedArea, setSelectedArea] = useState("");
  const [gender, setGender] = useState("");
  const [preferredCategory, setPreferredCategory] = useState([]);
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState([]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRoleInfo, setShowRoleInfo] = useState(false);
  const [hasShownRoleInfo, setHasShownRoleInfo] = useState(false);

  const isClient = role === "client";
  const showPasswordInput = authUser?.isGoogleAuth && !authUser?.password;

  useEffect(() => {
    if (authUser) {
      if (authUser.role) setRole(authUser.role);
      if (authUser.fullName) setFullName(authUser.fullName);
      if (authUser.phoneNumber) setPhoneNumber(authUser.phoneNumber);
      if (authUser.schoolEmail) setSchoolEmail(authUser.schoolEmail);
      if (authUser.schoolName) setSchoolName(authUser.schoolName);
      if (authUser.businessName) setBusinessName(authUser.businessName);
      if (authUser.city) setCity(authUser.city);
      if (authUser.state) setState(authUser.state);
      if (authUser.country) setCountry(authUser.country || "Nigeria");
      if (authUser.schoolArea) setSelectedArea(authUser.schoolArea);
      if (authUser.gender) setGender(authUser.gender);
    }
  }, [authUser]);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    // Clear the other role's step-2 fields so the form matches the selected role
    if (newRole === "client") {
      setBusinessName("");
      setBusinessCategory([]);
    } else {
      setPreferredCategory([]);
      setGender("");
    }
    if (!hasShownRoleInfo) {
      setShowRoleInfo(true);
      setHasShownRoleInfo(true);
    }
  };

  const toggleCategory = (list, setter, item) => {
    setter((prev) =>
      prev.includes(item) ? prev.filter((c) => c !== item) : [...prev, item]
    );
  };

  const validateStep1 = () => {
    if (!fullName?.trim()) return (toast.error("Full name is required"), false);
    if (!phoneNumber?.trim()) return (toast.error("Phone number is required"), false);
    const clean = phoneNumber.replace(/[\s-]/g, "");
    if (!nigerianPhoneRegex.test(clean)) {
      return (
        toast.error(
          "Please enter a valid Nigerian WhatsApp number (e.g. 08012345678 or +2348012345678)"
        ),
        false
      );
    }
    if (!city?.trim()) return (toast.error("City is required"), false);
    if (!state?.trim()) return (toast.error("State is required"), false);
    if (!country?.trim()) return (toast.error("Country is required"), false);
    if (!selectedArea?.trim()) return (toast.error("Town / Area is required"), false);
    return true;
  };

  const validateStep2 = () => {
    if (role === "vendor" && !businessName?.trim()) {
      return (toast.error("Business name is required for vendors"), false);
    }
    if (showPasswordInput && password?.length > 0 && password.length < 8) {
      return (toast.error("Password must be at least 8 characters"), false);
    }
    return true;
  };

  const onNext = () => {
    if (!validateStep1()) return;
    setStep(2);
  };

  const onBack = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      onNext();
      return;
    }
    if (!validateStep1() || !validateStep2()) return;

    setLoading(true);
    try {
      await completeRegistration({
        role,
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        schoolEmail: schoolEmail.trim() || undefined,
        schoolName: schoolName.trim() || undefined,
        businessName: role === "vendor" ? businessName.trim() : undefined,
        city: city.trim(),
        state: state.trim(),
        country: country.trim(),
        schoolArea: selectedArea.trim(),
        area: selectedArea.trim(),
        gender: gender || undefined,
        preferredCategory: isClient ? preferredCategory : undefined,
        businessCategory: !isClient ? businessCategory : undefined,
        password: showPasswordInput && password ? password : undefined,
      });

      localStorage.removeItem("signupRole");
      toast.success("You're all set! Welcome to Shopydash.");
      const { reloadApp } = await import("../utils/navigation");
      reloadApp("/", true);
    } catch (error) {
      toast.error(error.message || "Failed to complete setup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-n-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl shadow-n-3/10 rounded-3xl border border-white/50 overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center">
            <h1 className="h4 text-n-8 mb-2">
              {step === 1 ? "Let us know more about you" : "Almost there"}
            </h1>
            <p className="body-2 text-n-4">
              {step === 1
                ? "We'll use this to personalize your experience."
                : "Add a few details based on how you'll use Shopydash."}
            </p>
            <div className="flex justify-center gap-2 mt-3">
              <span
                className={`h-1.5 rounded-full w-8 transition-colors ${
                  step >= 1 ? "bg-primary-3" : "bg-n-3/30"
                }`}
              />
              <span
                className={`h-1.5 rounded-full w-8 transition-colors ${
                  step >= 2 ? "bg-primary-3" : "bg-n-3/30"
                }`}
              />
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step === 1) onNext();
              // Step 2: only explicit "Finish setup" click completes (via button onClick)
            }}
            className="px-8 pb-8"
          >
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="mb-5">
                  <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-3">
                    I am a
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label
                      className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        role === "client"
                          ? "border-primary-3 bg-primary-3/5"
                          : "border-n-3/10 hover:border-n-4/30 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="client"
                        checked={role === "client"}
                        onChange={() => handleRoleChange("client")}
                        className="sr-only"
                      />
                      <GraduationCap
                        className={`w-5 h-5 mr-2 ${
                          role === "client" ? "text-primary-3" : "text-n-4"
                        }`}
                      />
                      <span
                        className={`font-bold ${
                          role === "client" ? "text-n-8" : "text-n-5"
                        }`}
                      >
                        Buyer
                      </span>
                    </label>
                    <label
                      className={`flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        role === "vendor"
                          ? "border-primary-3 bg-primary-3/5"
                          : "border-n-3/10 hover:border-n-4/30 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="vendor"
                        checked={role === "vendor"}
                        onChange={() => handleRoleChange("vendor")}
                        className="sr-only"
                      />
                      <Store
                        className={`w-5 h-5 mr-2 ${
                          role === "vendor" ? "text-primary-3" : "text-n-4"
                        }`}
                      />
                      <span
                        className={`font-bold ${
                          role === "vendor" ? "text-n-8" : "text-n-5"
                        }`}
                      >
                        Vendor
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                    required
                  />
                </div>

                <div>
                  <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                    WhatsApp number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +234 801 234 5678 (Nigerian number)"
                    className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                    required
                  />
                  <p className="text-xs text-n-4 mt-1">
                    We'll use this for order updates. Must be a Nigerian number.
                  </p>
                </div>

                <div>
                  <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                    School email <span className="normal-case font-normal">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={schoolEmail}
                    onChange={(e) => setSchoolEmail(e.target.value)}
                    placeholder="e.g. you@school.edu.ng"
                    className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                  />
                  <p className="text-xs text-n-4 mt-1">
                    You can add or update this later in Settings → Privacy.
                  </p>
                </div>

                <LocationSelector
                  schoolName={schoolName}
                  setSchoolName={setSchoolName}
                  selectedArea={selectedArea}
                  setSelectedArea={setSelectedArea}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Lagos"
                      className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. Lagos"
                      className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. Nigeria"
                      className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {isClient ? (
                  <>
                    <div>
                      <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                      >
                        <option value="">Select gender</option>
                        {GENDER_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-3">
                        Items I'm interested in buying
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                        {preferredCategories.map((cat) => (
                          <label
                            key={cat}
                            className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all text-sm ${
                              preferredCategory.includes(cat)
                                ? "border-primary-3 bg-primary-3/5"
                                : "border-n-3/10 hover:border-n-4/30"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={preferredCategory.includes(cat)}
                              onChange={() =>
                                toggleCategory(
                                  preferredCategory,
                                  setPreferredCategory,
                                  cat
                                )
                              }
                              className="sr-only"
                            />
                            <span className="truncate">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                        Business name
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Campus Essentials Store"
                        className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                        required
                      />
                      {authUser?.businessName && (
                        <p className="text-xs text-n-4 mt-1">
                          You can change this later in Settings.
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-3">
                        Items I sell
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                        {preferredCategories.map((cat) => (
                          <label
                            key={cat}
                            className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all text-sm ${
                              businessCategory.includes(cat)
                                ? "border-primary-3 bg-primary-3/5"
                                : "border-n-3/10 hover:border-n-4/30"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={businessCategory.includes(cat)}
                              onChange={() =>
                                toggleCategory(
                                  businessCategory,
                                  setBusinessCategory,
                                  cat
                                )
                              }
                              className="sr-only"
                            />
                            <span className="truncate">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {showPasswordInput && (
                  <div>
                    <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                      Set a password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 8 characters, with upper, lower, number & symbol"
                        className="w-full h-12 px-4 pr-12 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-n-4 hover:text-n-6"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              {step === 2 && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center justify-center gap-2 h-12 px-6 rounded-xl border border-n-3/10 text-n-6 font-code text-sm font-bold uppercase tracking-wider hover:bg-n-2/10 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
              )}
              {step === 1 ? (
                <button
                  type="button"
                  onClick={onNext}
                  className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-primary-3 hover:bg-primary-4 text-white font-code text-sm font-bold uppercase tracking-wider transition-all"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  onClick={(e) => handleSubmit(e)}
                  className={[
                    "flex-1 h-12 bg-primary-3 hover:bg-primary-4 text-white rounded-xl font-code text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-primary-3/20",
                    loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
                  ].join(" ")}
                >
                  {loading ? "Finishing..." : "Finish setup"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {showRoleInfo &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-n-8/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-xl animate-in zoom-in-95 duration-200 relative">
              <button
                onClick={() => setShowRoleInfo(false)}
                className="absolute top-4 right-4 p-2 hover:bg-n-2 rounded-full transition-colors text-n-5"
              >
                <X size={20} />
              </button>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-3/10 rounded-full flex items-center justify-center text-primary-3 mb-6">
                  <ArrowLeftRight size={32} />
                </div>
                <h3 className="text-2xl font-bold text-n-8 mb-2">
                  Switching roles
                </h3>
                <p className="text-n-4 mb-4">
                  You can switch between Buyer and Vendor anytime from Settings →
                  Account.
                </p>
                <button
                  onClick={() => setShowRoleInfo(false)}
                  className="w-full py-3.5 bg-primary-3 text-white rounded-xl font-bold hover:bg-primary-3/90 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
