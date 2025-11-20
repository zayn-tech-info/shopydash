import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader } from "../components/Loader";
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
    if (!clientProfileData.fullName || !clientProfileData.fullName.trim())
      return "Full name is required";
    if (!clientProfileData.username || !clientProfileData.username.trim())
      return "Username is required";
    if (!clientProfileData.phoneNumber || !clientProfileData.phoneNumber.trim())
      return "Phone number is required";
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
      const msg =
        e?.response?.data?.message || e.message || "Failed to create profile";
      toast.error(msg);
    }
  }

  return (
    <main className="py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-4">Complete your profile</h1>
        <p className="text-sm text-n-7 mb-6">
          Fill in the details below to complete your profile.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-medium">Basic information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                onChange={handleInputChange("fullName")}
                label="Full Name"
                value={clientProfileData.fullName}
              />
              <InputField
                label="Username"
                value={clientProfileData.username}
                onChange={handleInputChange("username")}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  School Name
                </label>
                <CustomDropdown
                  options={schools}
                  value={clientProfileData.schoolName}
                  onChange={(value) => setInputField("schoolName", value)}
                  placeholder="Select your school"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                label="Phone number"
                value={clientProfileData.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Location</h2>
            <InputField
              label="Address"
              value={clientProfileData.address}
              onChange={handleInputChange("address")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                resetInputField();
                navigate(-1);
              }}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white bg-primary-3 rounded min-w-[140px] flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
        className={`w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-3 focus:border-transparent ${
          value ? "text-gray-900" : "text-gray-400"
        }`}
      >
        <span className="truncate block mr-4">{value || placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
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
