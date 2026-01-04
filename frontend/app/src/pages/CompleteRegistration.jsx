import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { GraduationCap, Store, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import LocationSelector from "../components/LocationSelector";

export default function CompleteRegistration() {
  const navigate = useNavigate();
  const { authUser, completeRegistration } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState(
    () => localStorage.getItem("signupRole") || "client"
  );

  // Removed premature cleanup to support StrictMode double-invocations
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  const [schoolId, setSchoolId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");

  const isClient = role === "client";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !username ||
      !phoneNumber ||
      !schoolName ||
      !whatsAppNumber ||
      !password ||
      !selectedArea ||
      !city ||
      !state ||
      !country
    ) {
      return toast.error(
        "Please fill in all required fields (City, State, Country included)"
      );
    }

    if (!isClient && !businessName) {
      return toast.error("Business name is required for vendors");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    setLoading(true);
    try {
      await completeRegistration({
        role,
        username,
        phoneNumber,
        schoolName,
        whatsAppNumber,
        businessName: isClient ? undefined : businessName,
        schoolId: schoolId ? Number(schoolId) : undefined,
        password,
        area: selectedArea,
        city,
        state,
        country,
      });

      localStorage.removeItem("signupRole");
      toast.success("Registration completed successfully!");
      const { reloadApp } = await import("../utils/navigation");
      reloadApp("/", true);
    } catch (error) {
      toast.error(error.message || "Failed to complete registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-n-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl shadow-n-3/10 rounded-3xl border border-white/50 overflow-hidden">
          <div className="px-8 pt-10 pb-6 text-center">
            <h1 className="h4 text-n-8 mb-2">Complete Your Registration</h1>
            <p className="body-2 text-n-4">
              Just a few more details to finish setting up your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8">
            <div className="mb-6">
              <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                I am a
              </label>
              <div className="grid grid-cols-2 p-1 bg-n-2/10 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole("client")}
                  className={[
                    "flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300",
                    isClient
                      ? "bg-white text-primary-3 shadow-sm"
                      : "text-n-4 hover:text-n-6 hover:bg-white/50",
                  ].join(" ")}
                >
                  <GraduationCap className="w-4 h-4" />
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("vendor")}
                  className={[
                    "flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold uppercase tracking-wider transition-all duration-300",
                    !isClient
                      ? "bg-white text-primary-3 shadow-sm"
                      : "text-n-4 hover:text-n-6 hover:bg-white/50",
                  ].join(" ")}
                >
                  <Store className="w-4 h-4" />
                  Vendor
                </button>
              </div>
            </div>

            {!isClient && (
              <div className="mb-5">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Shopydash Shop"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                  required={!isClient}
                />
              </div>
            )}

            <div className="mb-5">
              <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. johndoe123"
                className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                required
              />
            </div>

            <div className="mb-5">
              <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="e.g. +234 801..."
                className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
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

            <LocationSelector
              schoolName={schoolName}
              setSchoolName={setSchoolName}
              selectedArea={selectedArea}
              setSelectedArea={setSelectedArea}
            />

            <div className="mb-5">
              <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                Student ID (Optional)
              </label>
              <input
                type="text"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                placeholder="e.g. 20221234"
                className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
              />
            </div>

            <div className="mb-5">
              <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={whatsAppNumber}
                onChange={(e) => setWhatsAppNumber(e.target.value)}
                placeholder="e.g. +234 801..."
                className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50"
                required
              />
            </div>

            {}
            <div className="mb-5">
              <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full h-12 px-4 rounded-xl bg-n-2/10 border border-transparent focus:bg-white focus:border-primary-3 focus:ring-4 focus:ring-primary-3/10 transition-all outline-none text-n-8 placeholder:text-n-4/50 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-n-4 hover:text-n-6 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={[
                "mt-4 w-full h-12 bg-primary-3 hover:bg-primary-4 text-white rounded-xl font-code text-sm font-bold uppercase tracking-wider transition-all shadow-lg shadow-primary-3/20 hover:shadow-primary-3/40 hover:-translate-y-0.5",
                loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
            >
              {loading ? "Completing Registration..." : "Complete Registration"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
