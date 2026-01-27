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
  const [role, setRole] = useState("client");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isClient = role === "client";

  useEffect(() => {
    if (authUser) {
      if (authUser.role) setRole(authUser.role);
      if (authUser.username) setUsername(authUser.username);
      if (authUser.phoneNumber) setPhoneNumber(authUser.phoneNumber);
      if (authUser.whatsAppNumber) setWhatsAppNumber(authUser.whatsAppNumber);
      if (authUser.businessName) setBusinessName(authUser.businessName);
      if (authUser.city) setCity(authUser.city);
      if (authUser.state) setState(authUser.state);
      if (authUser.country) setCountry(authUser.country);
      if (authUser.schoolName) setSchoolName(authUser.schoolName);
      if (authUser.schoolArea) setSelectedArea(authUser.schoolArea);
      if (authUser.schoolId) setSchoolId(authUser.schoolId);
    }
  }, [authUser]);

  const showPasswordInput = !authUser?.password && !authUser?.isGoogleAuth;

  const showUsernameInput = !authUser?.username;
  const showPhoneInput = !authUser?.phoneNumber;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !selectedArea ||
      !city ||
      !state ||
      !country ||
      !whatsAppNumber ||
      (!authUser?.role && !role)
    ) {
      return toast.error(
        "Please fill in all required fields (City, State, Country, WhatsApp included)",
      );
    }

    if (role === "client") {
      if (!schoolName) return toast.error("School Name is required");
    }

    if (role === "vendor" && !businessName) {
      return toast.error("Business name is required for vendors");
    }

    const nigerianPhoneRegex = /^(?:\+234|234|0)[789][01]\d{8}$/;

    if (showPhoneInput && !nigerianPhoneRegex.test(phoneNumber)) {
      return toast.error(
        "Invalid Phone Number. Please use a valid Nigerian number.",
      );
    }

    if (!nigerianPhoneRegex.test(whatsAppNumber)) {
      return toast.error(
        "Invalid WhatsApp Number. Please use a valid Nigerian number.",
      );
    }

    if (showPasswordInput && password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }

    setLoading(true);
    try {
      await completeRegistration({
        role: authUser?.role || role,
        username: authUser?.username || username,
        phoneNumber: authUser?.phoneNumber || phoneNumber,
        schoolName,
        whatsAppNumber,
        businessName: role === "client" ? undefined : businessName,
        schoolId: schoolId ? Number(schoolId) : undefined,
        password: password || undefined,
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
            <h1 className="h4 text-n-8 mb-2">Complete Your Profile</h1>
            <p className="body-2 text-n-4">
              Tell us a bit more about you to finish setting up.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8">
            <div className="mb-6">
              <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-3">
                I am a
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label
                  className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
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
                    onChange={() => setRole("client")}
                    className="w-5 h-5 text-primary-3 border-n-4 focus:ring-primary-3"
                  />
                  <div className="ml-4 flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        role === "client"
                          ? "bg-primary-3 text-white"
                          : "bg-n-2 text-n-4"
                      }`}
                    >
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <span
                      className={`font-bold ${
                        role === "client" ? "text-n-8" : "text-n-5"
                      }`}
                    >
                      Student
                    </span>
                  </div>
                </label>

                <label
                  className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
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
                    onChange={() => setRole("vendor")}
                    className="w-5 h-5 text-primary-3 border-n-4 focus:ring-primary-3"
                  />
                  <div className="ml-4 flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        role === "vendor"
                          ? "bg-primary-3 text-white"
                          : "bg-n-2 text-n-4"
                      }`}
                    >
                      <Store className="w-5 h-5" />
                    </div>
                    <span
                      className={`font-bold ${
                        role === "vendor" ? "text-n-8" : "text-n-5"
                      }`}
                    >
                      Vendor
                    </span>
                  </div>
                </label>
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

            {showUsernameInput && (
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
            )}

            {showPhoneInput && (
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
            )}

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

            {showPasswordInput && (
              <div className="mb-5">
                <label className="block font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-2">
                  Create Password
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
            )}

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
