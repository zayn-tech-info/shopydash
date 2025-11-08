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

const normaliseDate = (date) => {
  try {
    return new Date(date).toLocaleDateString();
  } catch (e) {
    return "--";
  }
};

export default function VendorProfile() {
  const isGettingVendorProfile = useVendorProfileStore(
    (state) => state.isGettingVendorProfile
  );
  const vendorProfile = useVendorProfileStore((state) => state.vendorProfile);
  const getVendorProfile = useVendorProfileStore(
    (state) => state.getVendorProfile
  );

  const authUser = useAuthStore((s) => s.authUser);

  const params = useParams();
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    getVendorProfile(params?.storeUsername).catch((e) => {
      console.error("Failed to get vendor profile:", e);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.storeUsername]);

  const copyProfileLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("Profile link copied to clipboard");
    } catch (e) {
      toast.error("Could not copy link");
    }
  };

  const openEdit = () => {
    setFormData(vendorProfile || null);
    setShowEditModal(true);
  };

  if (isGettingVendorProfile) return <Loader />;

  return (
    <main className="py-8">
      <div className="max-w-6xl mx-auto">
        {/* Top banner */}
        <div className="relative bg-white rounded-md shadow-sm overflow-hidden mb-6">
          <div className="w-full h-44 bg-n-3">
            {vendorProfile?.coverImage ? (
              <img
                src={vendorProfile.coverImage}
                alt="cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary-3 to-primary-4" />
            )}
          </div>

          {/* top-right actions */}
          <div className="absolute right-6 top-6 flex items-center gap-3">
            <button
              onClick={copyProfileLink}
              className="px-3 py-2 rounded-md border bg-white text-sm"
              title="Copy profile link"
            >
              <Link2 />
            </button>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                vendorProfile?.active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {vendorProfile?.active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Main layout: two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: avatar, name, role, actions */}
          <aside className="col-span-1 bg-white rounded-md shadow-sm p-6 border border-gray-100">
            <div className="pt-8">
              <div className="flex items-center justify-center sm:justify-start gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden border-2 border-gray-100 shadow bg-white">
                  <img
                    src={vendorProfile?.profileImage || Logo}
                    alt={vendorProfile?.businessName || "profile"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-xl font-semibold">
                    {vendorProfile?.businessName ||
                      authUser?.businessName ||
                      "Store"}
                  </h1>
                  <p className="text-sm text-n-6 mt-1">
                    {vendorProfile?.businessCategory || "Seller"}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <button className="px-4 py-2 bg-primary-3 text-white rounded-md text-sm">
                  Send message
                </button>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border rounded-md text-sm">
                    Contacts
                  </button>
                </div>
                {authUser &&
                vendorProfile &&
                authUser._id === vendorProfile.userId ? (
                  <button
                    onClick={openEdit}
                    aria-label="Edit profile"
                    className="p-2 rounded-md border bg-white"
                    title="Edit profile"
                  >
                    <Edit />
                  </button>
                ) : null}
              </div>

              {/* Rating moved below buttons */}
              <div className="mt-3 sm:mt-4 flex items-center justify-center sm:justify-start gap-2 text-yellow-400 text-sm">
                <span className="text-lg">⭐️⭐️⭐️⭐️☆</span>
                <span className="ml-2 text-n-7">
                  Rating: {vendorProfile?.rating ?? "-"}
                </span>
              </div>
            </div>

            <div className="mt-6 border-t pt-4 text-sm space-y-3">
              <div>
                <div className="font-medium">Phone</div>
                <div className="text-primary-4">
                  <a
                    href={`tel:${
                      vendorProfile?.phoneNumber || authUser?.phoneNumber || ""
                    }`}
                  >
                    {vendorProfile?.phoneNumber || authUser?.phoneNumber || "-"}
                  </a>
                </div>
              </div>

              <div>
                <div className="font-medium">Email</div>
                <div className="text-primary-4">
                  <a
                    href={`mailto:${
                      vendorProfile?.email || authUser?.email || ""
                    }`}
                  >
                    {vendorProfile?.email || authUser?.email || "-"}
                  </a>
                </div>
              </div>

              <div>
                <div className="font-medium">Location</div>
                <div>{vendorProfile?.address || "-"}</div>
                <div className="text-n-7">
                  {[
                    vendorProfile?.city,
                    vendorProfile?.state,
                    vendorProfile?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              </div>
            </div>
          </aside>

          {/* Right column: main profile content */}
          <section className="col-span-2 space-y-6">
            <div className="bg-white rounded-md shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-medium">About</h2>
              <p className="text-n-7 mt-3">
                {vendorProfile?.storeDescription || "No description yet."}
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Category</h4>
                  <div className="mt-1">
                    {vendorProfile?.businessCategory || "-"}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium">Member since</h4>
                  <div className="mt-1">
                    {vendorProfile?.createdAt
                      ? normaliseDate(vendorProfile.createdAt)
                      : "--"}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-md shadow-sm p-6 border border-gray-100">
              <h3 className="font-medium mb-3">Contact information</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-medium">Phone</dt>
                  <dd className="mt-1">
                    {vendorProfile?.phoneNumber || authUser?.phoneNumber || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">WhatsApp</dt>
                  <dd className="mt-1">
                    {vendorProfile?.whatsAppNumber || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium">Email</dt>
                  <dd className="mt-1">{vendorProfile?.email || "-"}</dd>
                </div>
                <div>
                  <dt className="font-medium">Website</dt>
                  <dd className="mt-1">
                    {vendorProfile?.website || vendorProfile?.site || "-"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-white rounded-md shadow-sm p-6 border border-gray-100">
              <h3 className="font-medium mb-3">Gallery</h3>
              {vendorProfile?.gallery && vendorProfile.gallery.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {vendorProfile.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="w-full h-28 bg-n-3 rounded overflow-hidden"
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
                <p className="text-sm text-n-7">No gallery image yet</p>
              )}
            </div>
          </section>
        </div>

        {/* Edit modal mounted by parent state */}
        {showEditModal && formData ? (
          <EditProfile
            initialData={formData}
            onClose={() => setShowEditModal(false)}
          />
        ) : null}
      </div>
    </main>
  );
}
