import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useVendorProfileStore } from "../../store/vendorProfileStore";
import { schools, preferredCategories } from "../../constants";
import { ChevronDown, Check } from "lucide-react";
import { InputField } from "../InputField";

export function EditVendorProfile({ initialData, onClose }) {
  const [formData, setFormData] = useState(initialData || null);

  const isUpdatingVendorProfile = useVendorProfileStore(
    (s) => s.isUpdatingVendorProfile
  );
  const updateVendorProfile = useVendorProfileStore(
    (s) => s.updateVendorProfile
  );

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  if (!formData) return null;

  const handleChange = (field) => (e) =>
    setFormData((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        storeDescription: formData.storeDescription,
        businessCategory: formData.businessCategory,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        coverImage: formData.coverImage,
        gallery: formData.gallery
          ? formData.gallery
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        active: !!formData.active,
        mapLocation:
          formData.mapLocationLat || formData.mapLocationLng
            ? { lat: formData.mapLocationLat, lng: formData.mapLocationLng }
            : null,
      };

      await updateVendorProfile(payload);
      toast.success("Profile updated");
      if (typeof onClose === "function") onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.message ?? err?.message ?? "Update failed";
      toast.error(msg);
    }
  };

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-n-8/60 backdrop-blur-sm transition-opacity"
          onClick={() => typeof onClose === "function" && onClose()}
        />
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-2xl bg-white rounded-3xl p-8 z-10 overflow-auto max-h-[90vh] border border-n-3"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-n-8">Edit profile</h3>
            <button
              type="button"
              onClick={() => typeof onClose === "function" && onClose()}
              className="p-2 rounded-full hover:bg-n-2 text-n-5 hover:text-n-8 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-n-6 mb-1.5 uppercase tracking-wide">
                  Business Name (Read-only)
                </label>
                <input
                  type="text"
                  value={formData?.userId?.businessName || ""}
                  disabled
                  className="w-full px-4 py-3 bg-n-2 border border-n-3 rounded-xl text-n-5 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-n-6 mb-1.5 uppercase tracking-wide">
                  Store Username (Read-only)
                </label>
                <input
                  type="text"
                  value={formData?.userId?.storeUsername || ""}
                  disabled
                  className="w-full px-4 py-3 bg-n-2 border border-n-3 rounded-xl text-n-5 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-n-6 mb-1.5 uppercase tracking-wide">
                Description
              </label>
              <textarea
                value={formData.storeDescription}
                onChange={handleChange("storeDescription")}
                className="w-full min-h-[120px] px-4 py-3 bg-white border border-n-3 rounded-xl text-n-8 placeholder:text-n-4 focus:outline-none focus:border-primary-3 focus:ring-2 focus:ring-primary-3/20 transition-all duration-200 resize-y"
                rows={4}
                placeholder="Tell us about your store..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-n-6 mb-1.5 uppercase tracking-wide">
                  Category
                </label>
                <CustomDropdown
                  options={preferredCategories}
                  value={formData.businessCategory}
                  onChange={(value) =>
                    setFormData((f) => ({ ...f, businessCategory: value }))
                  }
                  placeholder="Select category"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-n-6 mb-1.5 uppercase tracking-wide">
                  Email (Read-only)
                </label>
                <input
                  type="text"
                  value={formData?.userId?.email || ""}
                  disabled
                  className="w-full px-4 py-3 bg-n-2 border border-n-3 rounded-xl text-n-5 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-n-6 mb-1.5 uppercase tracking-wide">
                School (Read-only)
              </label>
              <input
                type="text"
                value={formData?.userId?.schoolName || ""}
                disabled
                className="w-full px-4 py-3 bg-n-2 border border-n-3 rounded-xl text-n-5 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-n-6 mb-1.5 uppercase tracking-wide">
                  Phone (Read-only)
                </label>
                <input
                  type="text"
                  value={formData?.userId?.phoneNumber || ""}
                  disabled
                  className="w-full px-4 py-3 bg-n-2 border border-n-3 rounded-xl text-n-5 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-n-6 mb-1.5 uppercase tracking-wide">
                  WhatsApp (Read-only)
                </label>
                <input
                  type="text"
                  value={formData?.userId?.whatsAppNumber || ""}
                  disabled
                  className="w-full px-4 py-3 bg-n-2 border border-n-3 rounded-xl text-n-5 cursor-not-allowed"
                />
              </div>
            </div>

            <InputField
              label="Address"
              value={formData.address}
              onChange={handleChange("address")}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label="City"
                value={formData.city}
                onChange={handleChange("city")}
              />
              <InputField
                label="State"
                value={formData.state}
                onChange={handleChange("state")}
              />
              <InputField
                label="Country"
                value={formData.country}
                onChange={handleChange("country")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
              <label className="flex items-center gap-3 p-4 rounded-xl border border-n-3 cursor-pointer hover:border-n-4 transition-colors">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary-3 rounded border-gray-300 focus:ring-primary-3"
                  checked={!!formData.active}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, active: e.target.checked }))
                  }
                />
                <span className="font-medium text-n-7">Active Profile</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Map Lat"
                  value={formData.mapLocationLat || ""}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      mapLocationLat: e.target.value,
                    }))
                  }
                  placeholder="Lat"
                />
                <InputField
                  label="Map Lng"
                  value={formData.mapLocationLng || ""}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      mapLocationLng: e.target.value,
                    }))
                  }
                  placeholder="Lng"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-n-3">
              <button
                type="button"
                onClick={() => typeof onClose === "function" && onClose()}
                className="px-6 py-3 rounded-xl border border-n-3 text-n-6 font-medium hover:bg-n-2 hover:text-n-8 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingVendorProfile}
                className="px-8 py-3 bg-primary-3 text-white rounded-xl font-bold hover:bg-primary-4 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-primary-3 min-w-[160px] flex items-center justify-center"
              >
                {isUpdatingVendorProfile ? "Updating..." : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
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
