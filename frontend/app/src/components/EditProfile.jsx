import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useVendorProfileStore } from "../store/vendorProfileStore";

export function EditProfile() {
  const vendorProfile = useVendorProfileStore((state) => state.vendorProfile);
  const isUpdatingVendorProfile = useVendorProfileStore((state) => state.isUpdatingVendorProfile);
  const updateVendorProfile = useVendorProfileStore((state) => state.updateVendorProfile);

  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      gallery: formData.gallery
        ? formData.gallery
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      active: !!formData.active,
      mapLocation:
        formData.mapLocationLat || formData.mapLocationLng
          ? {
              lat: formData.mapLocationLat,
              lng: formData.mapLocationLng,
            }
          : null,
    };
    await updateVendorProfile(payload);
    setShowEditModal(false);
  };

  useEffect(() => {
    setFormData({
      businessName: vendorProfile.businessName || "",
      storeUsername: vendorProfile.storeUsername || "",
      storeDescription: vendorProfile.storeDescription || "",
      businessCategory: vendorProfile.businessCategory || "",
      phoneNumber: vendorProfile.phoneNumber || "",
      whatsAppNumber: vendorProfile.whatsAppNumber || "",
      email: vendorProfile.email || "",
      address: vendorProfile.address || "",
      city: vendorProfile.city || "",
      state: vendorProfile.state || "",
      country: vendorProfile.country || "",
      profileImage: vendorProfile.profileImage || "",
      coverImage: vendorProfile.coverImage || "",
      gallery: vendorProfile.gallery ? vendorProfile.gallery.join(",") : "",
      active: !!vendorProfile.active,
      mapLocationLat: vendorProfile.mapLocation?.lat || "",
      mapLocationLng: vendorProfile.mapLocation?.lng || "",
    });
  }, [showEditModal, vendorProfile]);

  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setShowEditModal(false)}
        />
        <form
          onSubmit={handleSubmit}
          className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 z-10 overflow-auto max-h-[90vh]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Edit profile</h3>
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
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
                onChange={(e) =>
                  setFormData({ ...formData, businessName: e.target.value })
                }
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Store username
              </label>
              <input
                value={formData.storeUsername}
                onChange={(e) =>
                  setFormData({ ...formData, storeUsername: e.target.value })
                }
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={formData.storeDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    storeDescription: e.target.value,
                  })
                }
                className="w-full mt-1 border rounded px-3 py-2"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">Category</label>
                <input
                  value={formData.businessCategory}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      businessCategory: e.target.value,
                    })
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">WhatsApp</label>
                <input
                  value={formData.whatsAppNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whatsAppNumber: e.target.value,
                    })
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Address</label>
              <input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium">City</label>
                <input
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">State</label>
                <input
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Country</label>
                <input
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium">
                  Profile image (URL)
                </label>
                <input
                  value={formData.profileImage}
                  onChange={(e) =>
                    setFormData({ ...formData, profileImage: e.target.value })
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Cover image (URL)
                </label>
                <input
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData({ ...formData, coverImage: e.target.value })
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Gallery (comma-separated URLs)
              </label>
              <input
                value={formData.gallery}
                onChange={(e) =>
                  setFormData({ ...formData, gallery: e.target.value })
                }
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                  />
                  <span className="ml-2">Active</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium">Map lat</label>
                <input
                  value={formData.mapLocationLat}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mapLocationLat: e.target.value,
                    })
                  }
                  className="w-full mt-1 border rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Map lng</label>
              <input
                value={formData.mapLocationLng}
                onChange={(e) =>
                  setFormData({ ...formData, mapLocationLng: e.target.value })
                }
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingVendorProfile}
                className="px-4 py-2 bg-primary-3 text-white rounded"
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
