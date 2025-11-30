import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useClientProfileStore } from "../store/clientProfileStore";
import { useAuthStore } from "../store/authStore";
import { InputField } from "../components/InputField";
import { schools, preferredCategories } from "../constants";
import { ChevronDown, Check } from "lucide-react";

export default function CreateClientProfile() {
  const navigate = useNavigate();
  const clientProfileData = useClientProfileStore(
    (state) => state.clientProfileData
  );
  const setInputField = useClientProfileStore((state) => state.setInputField);
  const resetInputField = useClientProfileStore(
    (state) => state.resetInputField
  );
  const createClientProfile = useClientProfileStore(
    (state) => state.createClientProfile
  );
  const { authUser, updateUser } = useAuthStore();
  const loading = useClientProfileStore((state) => state.loading);

  useEffect(() => {
    console.log(clientProfileData);
  }, [clientProfileData]);

  const handleInputChange = (field) => (e) => {
    setInputField(field, e.target.value);
  };

  function validate() {
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    try {
      await createClientProfile(clientProfileData);
      updateUser({ hasProfile: true });
      toast.success("Profile created");
      if (authUser?.role === "vendor") {
        navigate("/vendor/profile");
      } else {
        navigate("/profile");
      }
    } catch (e) {
      const errorMessage =
        e?.response?.data?.message || e?.message || "An error occurred";
      toast.error(errorMessage);
    }
  }

  return (
    <main className="min-h-screen py-12 bg-n-1 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary-3/5 blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-2/5 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl border border-n-3 p-8 md:p-12 relative z-10">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-n-8 mb-3">
            Complete your profile
          </h1>
          <p className="text-n-5 text-lg">
            Fill in the details below to complete your profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-n-8 border-b border-n-3 pb-2">
              Basic information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-n-6 mb-1.5 uppercase tracking-wide">
                  Preferred Category
                </label>
                <CustomDropdown
                  options={preferredCategories}
                  value={clientProfileData.preferredCategory}
                  onChange={(value) =>
                    setInputField("preferredCategory", value)
                  }
                  placeholder="Select a category"
                />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-bold text-n-8 border-b border-n-3 pb-2">
              Location
            </h2>
            <InputField
              label="Address"
              value={clientProfileData.address}
              onChange={handleInputChange("address")}
              placeholder="Street address"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                placeholder="City"
                value={clientProfileData.city}
                onChange={handleInputChange("city")}
              />
              <InputField
                placeholder="State"
                value={clientProfileData.state}
                onChange={handleInputChange("state")}
              />
              <InputField
                placeholder="Country"
                value={clientProfileData.country}
                onChange={handleInputChange("country")}
              />
            </div>
          </section>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-n-3">
            <button
              type="button"
              onClick={() => {
                resetInputField();
                navigate(-1);
              }}
              className="px-6 py-3 rounded-xl border border-n-3 text-n-6 font-medium hover:bg-n-2 hover:text-n-8 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-8 py-3 bg-primary-3 text-white rounded-xl font-bold hover:bg-primary-4 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-primary-3 min-w-[160px] flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-12 px-4 rounded-xl border bg-white text-left flex items-center justify-between transition-all duration-200 ${
          isOpen
            ? "border-primary-3 ring-2 ring-primary-3/20"
            : "border-n-3 hover:border-n-4"
        } ${value ? "text-n-8" : "text-n-4"}`}
      >
        <span className="truncate block mr-4">{value || placeholder}</span>
        <ChevronDown
          className={`w-5 h-5 text-n-4 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary-3" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-n-2 max-h-60 overflow-y-auto py-1">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-sm text-n-7 hover:bg-n-2 hover:text-primary-3 flex items-center justify-between transition-colors"
            >
              <span className="truncate pr-4">{option}</span>
              {value === option && (
                <Check className="w-4 h-4 text-primary-3 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
