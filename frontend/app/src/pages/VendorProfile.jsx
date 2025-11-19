import { toast } from "react-hot-toast";
import Logo from "../assets/images/vendora_logo.png";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Edit, Link2, LogOut } from "lucide-react";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { useAuthStore } from "../store/authStore";
import { Loader } from "../components/Loader";
import { EditVendorProfile } from "../components/vendor/EditVendorProfile";
import VendorSidebar from "../components/vendor/VendorSidebar";
import AboutAndProducts from "../components/vendor/AboutAndProducts";
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
    <main className="py-8 bg-n-1 min-h-[80vh]">
      <div className="container">
        {/* Cover Image Section */}
        <div className="relative bg-n-2/10 rounded-3xl overflow-hidden mb-8 border border-n-3/20 shadow-sm group">
          <div className="w-full h-48 md:h-64 lg:h-80 bg-n-3 relative">
            {vendorProfile?.coverImage ? (
              <img
                src={vendorProfile.coverImage}
                alt="cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary-3 to-primary-4" />
            )}
            {/* Overlay gradient for better text visibility if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-n-8/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* top-right actions */}
          <div className="absolute right-6 top-6 flex items-center gap-3 z-10">
            <button
              onClick={copyProfileLink}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-n-7 hover:bg-white hover:text-primary-3 transition-all shadow-sm"
              title="Copy profile link"
            >
              <Link2 size={18} />
            </button>
            <span
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm ${
                vendorProfile?.active
                  ? "bg-green-100/90 text-green-800"
                  : "bg-red-100/90 text-red-800"
              }`}
            >
              {vendorProfile?.active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 space-y-6">
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
              <VendorAddress
                vendorProfile={vendorProfile}
                authUser={authUser}
                className="lg:hidden block"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            {/* Header Info for Desktop (similar to ClientProfile) */}
            <div className="bg-white rounded-2xl p-8 border border-n-3/20 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="h3 text-n-8 mb-2">
                    {vendorProfile?.businessName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-n-4 body-2">
                    <span className="font-code text-primary-3 uppercase tracking-wider text-sm font-bold">
                      {vendorProfile?.businessCategory}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {authUser &&
                  vendorProfile &&
                  authUser._id === vendorProfile.userId ? (
                    <>
                      <button
                        onClick={handleLogout}
                        className="hidden lg:flex items-center gap-2 px-6 py-3 bg-n-1 border border-n-3/20 hover:border-primary-3 text-n-6 hover:text-primary-3 rounded-xl transition-all font-code text-xs font-bold uppercase tracking-wider"
                        title="Logout"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-n-3/20 shadow-sm min-h-[400px]">
              <AboutAndProducts vendor={vendorProfile} />
            </div>
          </div>
        </div>

        {showEditModal && formData ? (
          <EditVendorProfile
            initialData={formData}
            onClose={() => setShowEditModal(false)}
          />
        ) : null}
      </div>
    </main>
  );
}
