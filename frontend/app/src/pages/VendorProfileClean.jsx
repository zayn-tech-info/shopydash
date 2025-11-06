import { toast } from "react-hot-toast";
import Logo from "../assets/images/vendora_logo.png";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Edit, Link2 } from "lucide-react";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { useAuthStore } from "../store/authStore";
import { NoProfile } from "../components/NoProfile";
import { Loader } from "../components/Loader";
import { EditProfile } from "../components/EditProfile";

export default function VendorProfileClean() {
  // subscribe to store with stable selectors to avoid re-creating
  // an object on every render (which can cause infinite update loops)
  const isGettingVendorProfile = useVendorProfileStore(
    (state) => state.isGettingVendorProfile
  );
  const vendorProfile = useVendorProfileStore((state) => state.vendorProfile);
  const getVendorProfile = useVendorProfileStore(
    (state) => state.getVendorProfile
  );
  const updateVendorProfile = useVendorProfileStore(
    (state) => state.updateVendorProfile
  );

  const params = useParams();
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const { authUser } = useAuthStore();

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
    const usernameParam = params?.storeUsername;
    if (usernameParam && usernameParam !== "me") {
      getVendorProfile(usernameParam);
    } else {
      getVendorProfile();
    }
  }, [getVendorProfile, params?.storeUsername]);

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

  if (isGettingVendorProfile) return <Loader children="Loading profile" />;

  if (!vendorProfile) return <NoProfile />;

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
          <h2 className="text-2xl sm:text-2xl font-extrabol">
            @
            <span className="text-blue-700 font-medium ml-1">
              {vendorProfile?.storeUsername || authUser?.username || "store"}
            </span>
          </h2>
          <p className="text-sm text-n-6 mt-1">
            Member since{" "}
            <span className="font-bold">
              {vendorProfile?.createdAt
                ? normaliseDate(vendorProfile.createdAt)
                : "--"}
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
            {!(
              authUser &&
              vendorProfile &&
              authUser._id === vendorProfile.userId
            ) ? (
              <button className="px-4 py-2 rounded-md bg-primary-600 text-white text-sm font-medium shadow-sm hover:bg-primary-700 transition-colors">
                Follow
              </button>
            ) : (
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium"
              >
                Edit profile
              </button>
            )}

            <button
              onClick={copyProfileLink}
              className="px-4 py-2 rounded-md border border-gray-200 text-sm font-medium hover:bg-gray-50"
            >
              Share
            </button>

            {/* small icon action for quick edit (owner only) */}
            {authUser &&
            vendorProfile &&
            authUser._id === vendorProfile.userId ? (
              <button
                onClick={() => setShowEditModal(true)}
                aria-label="Open edit modal"
                className="w-10 h-10 rounded-full border flex items-center justify-center"
              >
                <Edit />
              </button>
            ) : null}
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

      {showEditModal && formData ? <EditProfile /> : null}
    </main>
  );
}
