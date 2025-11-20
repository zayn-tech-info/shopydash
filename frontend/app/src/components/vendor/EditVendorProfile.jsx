import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useVendorProfileStore } from "../../store/vendorProfileStore";
import { schools, preferredCategories } from "../../constants";
import { ChevronDown, Check } from "lucide-react";

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
        businessName: formData.businessName,
        storeUsername: formData.storeUsername,
        storeDescription: formData.storeDescription,
        businessCategory: formData.businessCategory,
        phoneNumber: formData.phoneNumber,
        whatsAppNumber: formData.whatsAppNumber,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        profileImage: formData.profileImage,
        coverImage: formData.coverImage,
        schoolName: formData.schoolName,
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
          className="absolute inset-0 bg-black/40"
          onClick={() => typeof onClose === "function" && onClose()}
        />
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 z-10 overflow-auto max-h-[90vh]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Edit profile</h3>
            <button
              type="button"
              onClick={() => typeof onClose === "function" && onClose()}
              className="p-2 rounded-md border"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Business name</label>
              <input
                value={formData.businessName}
                onChange={handleChange("businessName")}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Store username
              </label>
              <input
                value={formData.storeUsername}
                onChange={handleChange("storeUsername")}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={formData.storeDescription}
                onChange={handleChange("storeDescription")}
                className="w-full mt-1 border rounded px-3 py-2"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">Category</label>
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
                <label className="block text-sm font-medium">Email</label>
                <input
                  value={formData.email}
                  onChange={handleChange("email")}
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">School</label>
              <CustomDropdown
                options={schools}
                value={formData.schoolName || ""}
                onChange={(value) =>
                  setFormData((f) => ({ ...f, schoolName: value }))
                }
                placeholder="Select your school"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  value={formData.phoneNumber}
                  onChange={handleChange("phoneNumber")}
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">WhatsApp</label>
                <input
                  value={formData.whatsAppNumber}
                  onChange={handleChange("whatsAppNumber")}
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Address</label>
              <input
                value={formData.address}
                onChange={handleChange("address")}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium">City</label>
                <input
                  value={formData.city}
                  onChange={handleChange("city")}
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">State</label>
                <input
                  value={formData.state}
                  onChange={handleChange("state")}
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Country</label>
                <input
                  value={formData.country}
                  onChange={handleChange("country")}
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!formData.active}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, active: e.target.checked }))
                    }
                  />
                  <span className="ml-2">Active</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium">Map lat</label>
                <input
                  value={formData.mapLocationLat || ""}
                  onChange={(e) =>
                    setFormData((f) => ({
                      ...f,
                      mapLocationLat: e.target.value,
                    }))
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Map lng</label>
              <input
                value={formData.mapLocationLng || ""}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, mapLocationLng: e.target.value }))
                }
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => typeof onClose === "function" && onClose()}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingVendorProfile}
                className="px-4 py-2 bg-primary-3 text-white rounded min-w-[140px] flex items-center justify-center"
              >
                {isUpdatingVendorProfile
                  ? "Updating Profile..."
                  : "Save changes"}
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
