import { toast } from "react-hot-toast";
import Logo from "../assets/images/vendora_logo.png";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Edit, Link2 } from "lucide-react";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { useAuthStore } from "../store/authStore";
import { Loader } from "../components/Loader";
import { EditProfile } from "../components/EditProfile";
import VendorSidebar from "../components/vendor/VendorSidebar";
import VendorProducts from "../components/vendor/VendorProducts";
import { VendorAddress } from "../components/vendor/VendorAddress";

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
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const params = useParams();
  const location = useLocation();
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (
      location.pathname === "/profile" ||
      location.pathname === "/vendor/profile"
    ) {
      getVendorProfile();
    } else {
      getVendorProfile(params?.storeUsername).catch((e) => {
        console.error("Failed to get vendor profile:", e);
      });
    }
  }, [params?.storeUsername, getVendorProfile, location.pathname]);

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

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      navigate("/login");
    }
  };

  if (isGettingVendorProfile) return <Loader>Loading profile</Loader>;

  return (
    <main className="py-5 bg-gray-50 min-h-[70vh]">
      <div className="max-w-6xl mx-auto">
        <div className="relative bg-white rounded-lg overflow-hidden mb-8 border border-gray-100">
          <div className="w-full h-20 md:h-48 bg-n-3">
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
              className="inline-flex items-center justify-center px-3 py-2 rounded-md border border-gray-200 bg-white text-sm text-n-7"
              title="Copy profile link"
            >
              <Link2 />
            </button>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                vendorProfile?.active
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {vendorProfile?.active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <VendorSidebar
              vendorProfile={vendorProfile}
              authUser={authUser}
              onCopy={copyProfileLink}
              openEdit={openEdit}
              onLogout={() => {
                logout();
                navigate("/login");
              }}
            />
          </div>

          <div className="md:col-span-3 space-y-6">
            <div>
              <VendorProducts vendor={vendorProfile} />
            </div>
            <VendorAddress
              vendorProfile={vendorProfile}
              authUser={authUser}
              className="md:hidden block"
            />
            <div className="bg-white p-6 rounded-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-n-9">
                    {vendorProfile?.businessName}
                  </h1>
                  <p className="text-sm text-n-6 mt-1">
                    {vendorProfile?.businessCategory}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {authUser &&
                  vendorProfile &&
                  authUser._id === vendorProfile.userId ? (
                    <>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-md bg-primary-3 text-white text-sm"
                        title="Logout"
                      >
                        Logout
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

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
