import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
// import { Loader } from "../components/Loader";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { useAuthStore } from "../store/authStore";
import { InputField } from "../components/InputField";
import { preferredCategories } from "../constants";
import { ChevronDown, Check } from "lucide-react";

export default function CreateVendorProfile() {
  const navigate = useNavigate();
  const profileData = useVendorProfileStore((state) => state.profileData);
  const setProfileField = useVendorProfileStore(
    (state) => state.setProfileField
  );
  const resetProfileData = useVendorProfileStore(
    (state) => state.resetProfileData
  );
  const createVendorProfile = useVendorProfileStore(
    (state) => state.createVendorProfile
  );
  const isCreatingProfile = useVendorProfileStore(
    (state) => state.isCreatingProfile
  );
  const { updateUser } = useAuthStore();

  useEffect(() => {
    console.log(profileData);
  }, [profileData]);

  const handleInputChange = (field) => (e) => {
    setProfileField(field, e.target.value);
  };

  const isSubmitting = !!isCreatingProfile;

  const paymentOptions = [
    { id: "bank_transfer", label: "Bank transfer" },
    { id: "paystack", label: "paystack" },
    { id: "credit_card", label: "Credit / Debit" },
  ];

  function togglePayment(method) {
    const current = profileData.paymentMethods || [];
    const exists = current.includes(method);
    setProfileField(
      "paymentMethods",
      exists ? current.filter((m) => m !== method) : [...current, method]
    );
  }

  function validate() {
    if (!profileData.businessName || !profileData.businessName.trim())
      return "Business name is required";
    if (!profileData.storeUsername || !profileData.storeUsername.trim())
      return "Store username is required";
    if (!profileData.phoneNumber || !profileData.phoneNumber.trim())
      return "Phone number is required";
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

      navigate("/vendor/profile");
    } catch (e) {
      toast.error(e);
    }
  }

  return (
    <main className="py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-4">
          Create your store profile
        </h1>
        <p className="text-sm text-n-7 mb-6">
          Fill in the details below so customers can find your store.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-medium">Basic information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                onChange={handleInputChange("businessName")}
                label="Business name"
                value={profileData.businessName}
              />
              <InputField
                label="Store name"
                value={profileData.storeUsername}
                onChange={handleInputChange("storeUsername")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={profileData.storeDescription}
                onChange={handleInputChange("storeDescription")}
                className="w-full mt-1 border rounded px-3 py-2"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <CustomDropdown
                options={preferredCategories}
                value={profileData.businessCategory}
                onChange={(value) => setProfileField("businessCategory", value)}
                placeholder="Select category"
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Contact</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                label="Phone number"
                value={profileData.phoneNumber}
                onChange={handleInputChange("phoneNumber")}
              />
              <InputField
                label="WhatsApp number"
                value={profileData.whatsAppNumber}
                onChange={handleInputChange("whatsAppNummber")}
              />
            </div>
            <InputField
              label="Email"
              value={profileData.email}
              onChange={handleInputChange("email")}
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Location</h2>
            <InputField
              label="Address"
              value={profileData.address}
              onChange={handleInputChange("address")}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* No label here */}
              <InputField
                placeholder="City"
                value={profileData.city}
                onChange={handleInputChange("city")}
              />
              <InputField
                placeholder="State"
                value={profileData.state}
                onChange={handleInputChange("state")}
              />
              <InputField
                placeholder="Country"
                value={profileData.country}
                onChange={handleInputChange("country")}
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Payments & bank</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {paymentOptions.map((p) => (
                <label className="inline-flex items-center gap-2" key={p.id}>
                  <input
                    type="checkbox"
                    checked={(profileData.paymentMethods || []).includes(p.id)}
                    onChange={() => togglePayment(p.id)}
                  />
                  <span className="text-sm">{p.label}</span>
                </label>
              ))}
            </div>

            <InputField
              label="Account number"
              onChange={handleInputChange("accountNumber")}
            />
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-medium">Social & settings</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                resetProfileData();
                navigate(-1);
              }}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white bg-primary-3 rounded min-w-[140px] flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
