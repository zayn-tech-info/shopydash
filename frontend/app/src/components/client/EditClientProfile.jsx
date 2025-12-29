import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useClientProfileStore } from "../../store/clientProfileStore";
import { schools } from "../../constants";
import { ChevronDown, Check } from "lucide-react";
import { InputField } from "../InputField";

export function EditClientProfile({ clientProfileData, onClose }) {
  const setInputField = useClientProfileStore((state) => state.setInputField);
  const updating = useClientProfileStore((s) => s.updating);
  const updateClientProfile = useClientProfileStore(
    (s) => s.updateClientProfile
  );

  if (!clientProfileData) return null;

  const handleChange = (field) => (e) => setInputField(field, e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateClientProfile(clientProfileData);
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
                  Full Name (Read-only)
                </label>
                <input
                  type="text"
                  value={clientProfileData?.userId?.fullName || ""}
                  disabled
                  className="w-full px-4 py-3 bg-n-2 border border-n-3 rounded-xl text-n-5 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-n-6 mb-1.5 uppercase tracking-wide">
                  Username (Read-only)
                </label>
                <input
                  type="text"
                  value={clientProfileData?.userId?.username || ""}
                  disabled
                  className="w-full px-4 py-3 bg-n-2 border border-n-3 rounded-xl text-n-5 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-n-6 mb-1.5 uppercase tracking-wide">
                  Phone (Read-only)
                </label>
                <input
                  type="text"
                  value={clientProfileData?.userId?.phoneNumber || ""}
                  disabled
                  className="w-full px-4 py-3 bg-n-2 border border-n-3 rounded-xl text-n-5 cursor-not-allowed"
                />
              </div>
              {}
            </div>
            <InputField
              label="Address"
              value={clientProfileData.address}
              onChange={handleChange("address")}
            />

            <div>
              <label className="block text-sm font-medium text-n-6 mb-1.5 uppercase tracking-wide">
                School (Read-only)
              </label>
              <input
                type="text"
                value={clientProfileData?.userId?.schoolName || ""}
                disabled
                className="w-full px-4 py-3 bg-n-2 border border-n-3 rounded-xl text-n-5 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InputField
                label="City"
                value={clientProfileData.city}
                onChange={handleChange("city")}
              />
              <InputField
                label="State"
                value={clientProfileData.state}
                onChange={handleChange("state")}
              />
              <InputField
                label="Country"
                value={clientProfileData.country}
                onChange={handleChange("country")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
              <label className="flex items-center gap-3 p-4 rounded-xl border border-n-3 cursor-pointer hover:border-n-4 transition-colors">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-primary-3 rounded border-gray-300 focus:ring-primary-3"
                  checked={!!clientProfileData.active}
                  onChange={(e) => setInputField("active", e.target.checked)}
                />
                <span className="font-medium text-n-7">Active Profile</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Map Lat"
                  value={clientProfileData.mapLocationLat || ""}
                  onChange={(e) =>
                    setInputField("mapLocationLat", e.target.value)
                  }
                  placeholder="Lat"
                />
                <InputField
                  label="Map Lng"
                  value={clientProfileData.mapLocationLng || ""}
                  onChange={(e) =>
                    setInputField("mapLocationLng", e.target.value)
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
                disabled={updating}
                className="px-8 py-3 bg-primary-3 text-white rounded-xl font-bold hover:bg-primary-4 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:bg-primary-3 min-w-[160px] flex items-center justify-center"
              >
                {updating ? "Updating..." : "Save changes"}
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
