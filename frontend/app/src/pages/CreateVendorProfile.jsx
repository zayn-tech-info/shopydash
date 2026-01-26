import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { useAuthStore } from "../store/authStore";
import { InputField } from "../components/InputField";
import { preferredCategories } from "../constants";
import { ChevronDown, Check } from "lucide-react";

export default function CreateVendorProfile() {
  const navigate = useNavigate();
  const profileData = useVendorProfileStore((state) => state.profileData);
  const setProfileField = useVendorProfileStore(
    (state) => state.setProfileField,
  );
  const resetProfileData = useVendorProfileStore(
    (state) => state.resetProfileData,
  );
  const createVendorProfile = useVendorProfileStore(
    (state) => state.createVendorProfile,
  );
  const isCreatingProfile = useVendorProfileStore(
    (state) => state.isCreatingProfile,
  );
  const { updateUser, authUser } = useAuthStore();

  useEffect(() => {
    console.log(profileData);
  }, [profileData]);

  const handleInputChange = (field) => (e) => {
    setProfileField(field, e.target.value);
  };

  const isSubmitting = !!isCreatingProfile;

  function validate() {
    if (!profileData.storeDescription || !profileData.storeDescription.trim())
      return "Store description is required";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    try {
      await createVendorProfile(profileData);
      updateUser({ hasProfile: true });
      toast.success("Profile created");

      navigate(`/p/${authUser?.username}`);
    } catch (e) {
      const errorMessage =
        e?.response?.data?.message || e?.message || "An error occurred";
      toast.error(errorMessage);
    }
  }

  return (
    <main className="min-h-screen py-12 bg-n-1 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-primary-3/5 blur-[120px]" />
        <div className="absolute top-[40%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary-2/5 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl border border-n-3 p-8 md:p-12 relative z-10">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-n-8 mb-3">
            Create your store profile
          </h1>
          <p className="text-n-5 text-lg">
            Fill in the details below so customers can find your store.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-n-8 border-b border-n-3 pb-2">
              Basic information
            </h2>

            <div>
              <label className="block text-sm font-medium text-n-6 mb-1.5 uppercase tracking-wide">
                Description
              </label>
              <textarea
                value={profileData.storeDescription}
                onChange={handleInputChange("storeDescription")}
                className="w-full min-h-[120px] px-4 py-3 bg-white border border-n-3 rounded-xl text-n-8 placeholder:text-n-4 focus:outline-none focus:border-primary-3 focus:ring-2 focus:ring-primary-3/20 transition-all duration-200 resize-y"
                placeholder="Tell us about your store..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-n-6 mb-3 uppercase tracking-wide">
                What kind of items do you sell?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {preferredCategories.map((category) => (
                  <label
                    key={category}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      (profileData.businessCategory || []).includes(category)
                        ? "border-primary-3 bg-primary-3/5"
                        : "border-n-3 hover:border-n-4 bg-white"
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={(profileData.businessCategory || []).includes(
                          category,
                        )}
                        onChange={(e) => {
                          const current = profileData.businessCategory || [];
                          const newValue = e.target.checked
                            ? [...current, category]
                            : current.filter((c) => c !== category);
                          setProfileField("businessCategory", newValue);
                        }}
                      />
                      <div className="w-5 h-5 border-2 border-n-4 rounded-md peer-checked:bg-primary-3 peer-checked:border-primary-3 transition-colors"></div>
                      <Check className="w-3.5 h-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-sm font-medium text-n-7">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-n-6 mb-1.5 uppercase tracking-wide">
                  How long have you been selling?
                </label>
                <CustomDropdown
                  options={[
                    "Less than 1 year",
                    "1-3 years",
                    "3-5 years",
                    "More than 5 years",
                  ]}
                  value={profileData.sellingDuration}
                  onChange={(value) =>
                    setProfileField("sellingDuration", value)
                  }
                  placeholder="Select duration"
                />
              </div>

              <div className="flex items-center h-full pt-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={profileData.offersDelivery || false}
                      onChange={(e) =>
                        setProfileField("offersDelivery", e.target.checked)
                      }
                    />
                    <div className="w-6 h-6 border-2 border-n-4 peer-checked:bg-primary-3 peer-checked:border-primary-3 rounded-md transition-all"></div>
                    <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </div>
                  <span className="font-medium text-n-6 group-hover:text-n-8 transition-colors">
                    Do you offer delivery services?
                  </span>
                </label>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-xl font-bold text-n-8 border-b border-n-3 pb-2">
              Socials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                placeholder="Instagram"
                onChange={handleInputChange("instagram")}
              />
              <InputField
                placeholder="Twitter"
                onChange={handleInputChange("twitter")}
              />
              <InputField
                placeholder="Facebook"
                onChange={handleInputChange("facebook")}
              />
            </div>
          </section>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-n-3">
            <button
              type="button"
              onClick={() => {
                resetProfileData();
                navigate(-1);
              }}
              className="px-6 py-3 rounded-xl border border-n-3 text-n-6 font-medium hover:bg-n-2 hover:text-n-8 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-8 py-3 bg-primary-3 text-white rounded-xl font-bold hover:bg-primary-4 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-primary-3 min-w-[160px] flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
