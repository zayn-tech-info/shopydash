import SubscriptionBadge from "../components/common/SubscriptionBadge";
import { toast } from "react-hot-toast";
import Logo from "../assets/images/shopydash_logo.png";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Plus, MapPin, Settings } from "lucide-react";
import { useVendorProfileStore } from "../store/vendorProfileStore";
import { useAuthStore } from "../store/authStore";
import { EditVendorProfile } from "../components/vendor/EditVendorProfile";
import VendorSidebar from "../components/vendor/VendorSidebar";
import AboutAndProducts from "../components/vendor/AboutAndProducts";
import { VendorAddress } from "../components/vendor/VendorAddress";
import { VendorProfileSkeleton } from "../components/skeletons/VendorProfileSkeleton";

export default function VendorProfile() {
  const isGettingVendorProfile = useVendorProfileStore(
    (state) => state.isGettingVendorProfile,
  );

  const vendorProfile = useVendorProfileStore((state) => state.vendorProfile);
  const getProfile = useVendorProfileStore((state) => state.getProfile);

  const authUser = useAuthStore((s) => s.authUser);
  const logout = useAuthStore((s) => s.logout);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const navigate = useNavigate();

  const params = useParams();
  const location = useLocation();
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState(null);
  const fileInputRef = useRef(null);

  const isOwner = authUser?._id === vendorProfile?.userId?._id;
  const displayProfileImage = isOwner
    ? authUser?.profilePic || vendorProfile?.userId?.profilePic || Logo
    : vendorProfile?.userId?.profilePic || Logo;

  const vendorLocation = [
    vendorProfile?.userId?.city,
    vendorProfile?.userId?.state,
    vendorProfile?.userId?.country,
  ]
    .filter(Boolean)
    .join(", ");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const usernameToFetch = params?.username || authUser?.username;
        if (
          vendorProfile &&
          (vendorProfile?.userId?.username === usernameToFetch ||
            vendorProfile?.storeUsername === usernameToFetch)
        ) {
          return;
        }

        if (usernameToFetch) {
          await getProfile(usernameToFetch);
        }
      } catch (err) {
        console.error("Failed to load vendor profile:", err);
      }
    };
    fetchProfile();
  }, [getProfile, params?.username, authUser?.username, vendorProfile]);

  const copyProfileLink = useCallback(async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast.success("Profile link copied to clipboard");
    } catch (e) {
      toast.error("Could not copy link");
    }
  }, []);

  const openEdit = useCallback(() => {
    setFormData(vendorProfile || null);
    setShowEditModal(true);
  }, [vendorProfile]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      await checkAuth();
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      navigate("/login");
    }
  }, [logout, checkAuth, navigate]);

  if (isGettingVendorProfile) return <VendorProfileSkeleton />;

  const plan =
    vendorProfile?.userId?.subscriptionPlan ||
    (isOwner ? authUser?.subscriptionPlan : null);

  return (
    <main className="py-8 bg-n-1 min-h-[80vh]">
      <div className="container">
        <div className="relative bg-gradient-to-b from-primary-3 to-[#2d120a] rounded-3xl overflow-hidden mb-8 border border-n-3/20 shadow-sm group flex items-center min-h-[220px] md:min-h-[260px]">
          {authUser &&
            vendorProfile &&
            authUser._id === vendorProfile.userId?._id && (
              <button
                onClick={() => navigate("/settings")}
                className="absolute top-4 right-4 md:top-10 md:right-10 p-3 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-all z-20"
                title="Settings"
              >
                <Settings size={20} />
              </button>
            )}
          {/* Responsive Content Layout */}
          <div className="flex flex-col justify-center h-full w-full px-4 py-6 md:px-10 md:py-8">
            <div className="flex flex-col items-start md:flex-row md:items-center md:justify-between w-full">
              <div className="flex flex-col items-start md:flex-row md:items-center gap-2 md:gap-3 w-full">
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold drop-shadow-md flex items-center">
                  {vendorProfile?.userId?.businessName}
                  <span className="ml-2 md:ml-3 flex items-center">
                    <SubscriptionBadge plan={plan} size="sm" />
                  </span>
                </h1>
              </div>
              {vendorLocation && (
                <span className="flex items-center gap-2 font-bold text-base sm:text-lg bg-black/30 backdrop-blur-md px-3 py-2 sm:px-6 rounded-lg border border-white/10 text-white mt-6 md:mt-0 w-full md:w-auto justify-center md:justify-end">
                  <MapPin size={18} className="text-white" />
                  {vendorLocation}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24 space-y-6">
              <VendorSidebar
                vendorProfile={vendorProfile}
                authUser={authUser}
                onCopy={copyProfileLink}
                openEdit={openEdit}
                onLogout={async () => {
                  await logout();
                  window.location.href = "/login";
                }}
              />
            </div>
          </div>

          {}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-n-3/20 shadow-sm min-h-[400px]">
              <AboutAndProducts vendor={vendorProfile} />
            </div>

            {}
            <div className="bg-white rounded-2xl p-8 border border-n-3/20 shadow-sm">
              <VendorAddress
                vendorProfile={vendorProfile}
                authUser={authUser}
              />
            </div>
          </div>
        </div>

        {authUser && (
          <div className="lg:hidden mt-8 bg-white rounded-2xl p-6 border border-n-3/20 shadow-sm text-center">
            <div className="font-code text-xs font-bold text-n-4 uppercase tracking-wider mb-1">
              Logged in as
            </div>
            <div className="truncate text-n-6 font-medium mb-2">
              {authUser?.fullName || authUser?.username || authUser?.email}
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-3 border border-n-3/20 rounded-xl text-xs font-bold uppercase tracking-wider text-n-5 hover:text-primary-3 hover:border-primary-3 transition-all"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        )}

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
