import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useClientProfileStore } from "../../store/clientProfileStore";
import { schools } from "../../constants";
import { ChevronDown, Check } from "lucide-react";

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
              <label className="block text-sm font-medium">Full name</label>
              <input
                value={clientProfileData.fullName}
                onChange={handleChange("fullName")}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">username</label>
              <input
                value={clientProfileData.username}
                onChange={handleChange("username")}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  value={clientProfileData.phoneNumber}
                  onChange={handleChange("phoneNumber")}
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">WhatsApp</label>
                <input
                  value={clientProfileData.whatsAppNumber}
                  onChange={handleChange("whatsAppNumber")}
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Address</label>
              <input
                value={clientProfileData.address}
                onChange={handleChange("address")}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">School</label>
              <CustomDropdown
                options={schools}
                value={clientProfileData.schoolName}
                onChange={(value) => setInputField("schoolName", value)}
                placeholder="Select your school"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium">City</label>
                <input
                  value={clientProfileData.city}
                  onChange={handleChange("city")}
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">State</label>
                <input
                  value={clientProfileData.state}
                  onChange={handleChange("state")}
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Country</label>
                <input
                  value={clientProfileData.country}
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
                    checked={!!clientProfileData.active}
                    onChange={(e) => setInputField("active", e.target.checked)}
                  />
                  <span className="ml-2">Active</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium">Map lat</label>
                <input
                  value={clientProfileData.mapLocationLat || ""}
                  onChange={(e) =>
                    setInputField("mapLocationLat", e.target.value)
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Map lng</label>
              <input
                value={clientProfileData.mapLocationLng || ""}
                onChange={(e) =>
                  setInputField("mapLocationLng", e.target.value)
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
                disabled={updating}
                className="px-4 py-2 bg-primary-3 text-white rounded min-w-[140px] flex items-center justify-center"
              >
                {updating ? "Updating Profile..." : "Save changes"}
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
