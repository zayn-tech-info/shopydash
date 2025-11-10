import { toast } from "react-hot-toast";
import Logo from "../assets/images/vendora_logo.png";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Edit, Link2 } from "lucide-react";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { useAuthStore } from "../store/authStore";
import { Loader } from "../components/Loader";
import { EditProfile } from "../components/EditProfile";
import VendorSidebar from "../components/Profile/VendorSidebar";
import VendorProducts from "../components/Profile/VendorProducts";

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <VendorSidebar
              vendorProfile={vendorProfile}
              authUser={authUser}
              onCopy={copyProfileLink}
              onLogout={() => {
                logout();
                navigate("/login");
              }}
            />
          </div>

          <div className="md:col-span-3">
            <div className="bg-white p-6 rounded-md border shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-bold text-n-9">
                    {vendorProfile?.businessName}
                  </h1>
                  <p className="text-sm text-n-6">
                    {vendorProfile?.businessCategory}
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  {authUser &&
                  vendorProfile &&
                  authUser._id === vendorProfile.userId ? (
                    <>
                      <button
                        onClick={openEdit}
                        aria-label="Edit profile"
                        className="p-2 px-5 rounded-md border bg-white text-sm"
                        title="Edit profile"
                      >
                      <Edit />
                      </button>
                      <button
                        onClick={handleLogout}
                        className="p-2 rounded-md bg-primary-3 px-3 text-white text-sm"
                        title="Logout"
                      >
                        Logout
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <VendorProducts vendor={vendorProfile} />
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
