import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useClientProfileStore } from "../../store/clientProfileStore";

export function EditClientProfile({
  clientProfileData,
  onClose,
}) {
  const setInputField = useClientProfileStore(
    (state) => state.clientProfileData
  );
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
              <label className="block text-sm font-medium">Business name</label>
              <input
                value={clientProfileData.businessName}
                onChange={handleChange("businessName")}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Store username
              </label>
              <input
                value={clientProfileData.storeUsername}
                onChange={handleChange("storeUsername")}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={clientProfileData.storeDescription}
                onChange={handleChange("storeDescription")}
                className="w-full mt-1 border rounded px-3 py-2"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">Category</label>
                <input
                  value={clientProfileData.businessCategory}
                  onChange={handleChange("businessCategory")}
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  value={clientProfileData.email}
                  onChange={handleChange("email")}
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
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
                    onChange={(e) =>
                      setInputField((f) => ({ ...f, active: e.target.checked }))
                    }
                  />
                  <span className="ml-2">Active</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium">Map lat</label>
                <input
                  value={clientProfileData.mapLocationLat || ""}
                  onChange={(e) =>
                    setInputField((f) => ({
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
                value={clientProfileData.mapLocationLng || ""}
                onChange={(e) =>
                  setInputField((f) => ({
                    ...f,
                    mapLocationLng: e.target.value,
                  }))
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
                className="px-4 py-2 bg-primary-3 text-white rounded"
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
