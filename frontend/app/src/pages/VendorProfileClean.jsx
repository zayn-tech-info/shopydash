import { toast } from "react-hot-toast";
import Logo from "../assets/images/vendora_logo.png";
import { useEffect, useState } from "react";
import { Edit, Link2 } from "lucide-react";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { useAuthStore } from "../store/authStore";

export default function VendorProfileClean() {
  const {
    isGettingVendorProfile,
    vendorProfile,
    getVendorProfile,
    isUpdatingVendorProfile,
    updateVendorProfile,
  } = useVendorProfileStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const { authUser, checkAuth } = useAuthStore();

  function copyProfileLink() {
    const link = window.location.href;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(link)
        .then(() => toast.success("Profile link copied"))
        .catch(() => fallbackCopy(link));
    } else {
      fallbackCopy(link);
    }
  }

  function normaliseDate(dateString) {
    const isoDate = dateString;
    const date = new Date(isoDate);

    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options);

    return formattedDate;
  }

  useEffect(() => {
    getVendorProfile();
    checkAuth();
  }, [getVendorProfile, checkAuth]);

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
    if (!showEditModal || !vendorProfile) return;
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

  function fallbackCopy(text) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      toast.success("Profile link copied");
    } catch (e) {
      toast.error("Could not copy link");
    }
  }

  if (isGettingVendorProfile)
    return (
      <div className="py-20">
        <div className="max-w-3xl mx-auto">loading Vendor profile</div>
      </div>
    );
  if (!vendorProfile)
    return (
      <div className="py-20">
        <div className="max-w-3xl mx-auto">Vendor not found.</div>
      </div>
    );

  return (
    <main className="py-6 sm:py-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-md shadow-sm overflow-hidden mb-6 relative">
          <div className="w-full h-40 sm:h-48 bg-n-3">
            {vendorProfile.coverImage ? (
              <img
                src={vendorProfile.coverImage}
                alt="cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary-3 to-primary-4 flex items-center justify-center">
                <span className="text-white font-semibold md:text-3xl text-base md:mb-5 mb-2">
                  {vendorProfile && vendorProfile?.businessName
                    ? vendorProfile.businessName
                    : authUser.businessName}
                </span>
              </div>
            )}
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
              <img
                src={vendorProfile.profileImage || Logo}
                alt={vendorProfile.businessName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="absolute right-4 top-4 flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                vendorProfile.active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {vendorProfile.active ? "Active" : "Inactive"}
            </span>
            <button
              onClick={copyProfileLink}
              className="px-3 py-3 rounded-full bg-n-1 text-sm text-n-10 hover:bg-n-2 transition-colors duration-500"
            >
              <Link2 />
            </button>
          </div>
        </div>

        <div className="text-center mt-8 px-4">
          <h2 className="text-xl sm:text-xl font-extrabol">
            @
            <a className="text-blue-700 font-medium" href="">
              {vendorProfile && vendorProfile?.username
                ? vendorProfile.storeUsername
                : authUser.username}
            </a>
          </h2>
          <p className="text-sm text-n-6 mt-1">
            Member since{" "}
            <span className="font-bold">
              {normaliseDate(vendorProfile.createdAt)}
            </span>
          </p>

          <div className="mt-2 flex items-center justify-center gap-6 text-sm text-n-7">
            <div className="flex items-center gap-2">
              <span className="font-medium">0 followers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">0 following</span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            {authUser &&
            vendorProfile &&
            authUser._id === vendorProfile.userId ? (
              ""
            ) : (
              <button className="px-5 py-1 rounded-md bg-n-7  border-n-8 text-white text-sm font-medium">
                Follow
              </button>
            )}
            <button
              onClick={copyProfileLink}
              className="px-5 py-1 rounded-md border-n-8 text-n-9 border-2 text-sm font-medium"
            >
              Share
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="w-10 h-10 rounded-full border flex items-center justify-center"
            >
              <Edit />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-6 mt-6">
          <div className="text-n-7 mb-6 text-center sm:text-center">
            {vendorProfile.storeDescription}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="text-sm text-n-7">
                  <h4 className="font-medium md:text-lg border-n-7 border-2 backdrop-blur-sm inline-block px-2 rounded mb-2">
                    Category
                  </h4>
                  <div className="mb-3">{vendorProfile.businessCategory}</div>

                  <div className="border-t border-gray-100 pt-3">
                    <h4 className="mb-2 md:text-lg text-base font-medium">
                      Contact
                    </h4>
                    <dl className="space-y-3 text-sm">
                      <div className="flex items-start">
                        <dt className="w-28 sm:w-32 font-medium">Phone</dt>
                        <dd className="flex-1 text-primary-4 font-medium">
                          <a
                            href={`tel:${
                              vendorProfile && vendorProfile?.phoneNumber
                                ? vendorProfile.phoneNumber
                                : authUser.phoneNumber
                            }`}
                          >
                            {vendorProfile && vendorProfile?.phoneNumber
                              ? vendorProfile.phoneNumber
                              : authUser.phoneNumber}
                          </a>
                        </dd>
                      </div>

                      <div className="flex items-start">
                        <dt className="w-28 sm:w-32 font-medium">WhatsApp</dt>
                        <dd className="flex-1 text-primary-4 font-medium">
                          <a
                            href={`https://wa.me/${(vendorProfile &&
                            vendorProfile?.phoneNumber
                              ? vendorProfile.phoneNumber
                              : authUser.phoneNumber
                            )?.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Message on WhatsApp
                          </a>
                        </dd>
                      </div>

                      {vendorProfile.email ? (
                        <div className="flex items-start">
                          <dt className="w-28 sm:w-32 font-medium">Email</dt>
                          <dd className="flex-1 text-primary-4 font-medium">
                            <a href={`mailto:${vendorProfile.email}`}>
                              {vendorProfile.email}
                            </a>
                          </dd>
                        </div>
                      ) : (
                        <p className="md:text-lg bg-gray-100 border border-gray-300 md:px-3 px-2 mt-5 text-sm">
                          - -
                        </p>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                <h4 className=" md:text-lg border-n-7 border-2 backdrop-blur-sm inline-block px-2 rounded mb-2">
                  Location
                </h4>
                <div className="text-sm text-n-7 mt-1 space-y-4">
                  <div>{vendorProfile.address}</div>
                  <div>
                    {vendorProfile ? (
                      vendorProfile.city
                    ) : (
                      <p className="md:text-lg bg-gray-100 border border-gray-300 md:px-3 px-2 mt-5 text-sm">
                        - -
                      </p>
                    )}
                    , {vendorProfile.state}
                  </div>
                  <div>{vendorProfile ? vendorProfile.country : "--"}</div>
                </div>

                {vendorProfile.mapLocation ? (
                  <div className="mt-3">
                    <iframe
                      title="vendorProfile-map"
                      src={`https://www.google.com/maps?q=${vendorProfile.mapLocation.lat},${vendorProfile.mapLocation.lng}&z=15&output=embed`}
                      className="w-full h-36 rounded-md border"
                    />
                  </div>
                ) : (
                  <p className="md:text-lg bg-gray-100 border border-gray-300 md:px-3 px-2 mt-5 text-sm">
                    - -
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <h3 className="font-medium md:text-lg border-n-7 border-2 backdrop-blur-sm inline-block px-2 rounded mb-2">
                Gallery
              </h3>
              {vendorProfile.gallery && vendorProfile.gallery.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {vendorProfile.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="w-full h-24 bg-n-3 rounded overflow-hidden"
                    >
                      <img
                        src={img}
                        alt={`gallery-${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="md:text-lg bg-gray-100 border border-gray-300 md:px-3 p-2 mt-5 text-sm">
                  No gallery image yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && formData ? (
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
                <label className="block text-sm font-medium">
                  Business name
                </label>
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
      ) : null}
    </main>
  );
}
